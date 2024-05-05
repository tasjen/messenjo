package main

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	pb "github.com/tasjen/message-app-fullstack/services/chat/internal/chat_proto"
	"github.com/tasjen/message-app-fullstack/services/chat/internal/models"
)

func (app *application) GetByUsername(ctx context.Context, req *pb.GetByUsernameReq) (*pb.GetByUsernameRes, error) {
	username := req.GetUsername()
	if l := len(username); l < 1 || l > 32 {
		return &pb.GetByUsernameRes{}, errors.New("bad request")
	}

	userId, err := app.users.GetByUsername(ctx, username)
	if err != nil {
		return &pb.GetByUsernameRes{}, err
	}

	return &pb.GetByUsernameRes{UserId: userId[:]}, nil
}

func (app *application) GetUserById(ctx context.Context, req *pb.GetUserByIdReq) (*pb.GetUserByIdRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &pb.GetUserByIdRes{}, err
	}
	username, err := app.users.GetById(ctx, userId)
	return &pb.GetUserByIdRes{Username: username}, err
}

func (app *application) GetContacts(ctx context.Context, req *pb.GetContactsReq) (*pb.GetContactsRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &pb.GetContactsRes{Contacts: []*pb.Contact{}}, err
	}
	stmt := `
		SELECT DISTINCT
		CASE
				WHEN g.name = '' THEN  'friend'
				ELSE 'group'
		END AS contact_type,
		CASE
				WHEN g.name = '' THEN  u.username
		ELSE g.name
		END AS contact_name,
		CASE
				WHEN g.name = '' THEN  u.id
				ELSE NULL
		END AS user_id,
		g.id AS group_id,
		CASE
				WHEN msg.content IS NOT NULL THEN msg.content 
				ELSE NULL
		END AS last_content,
		CASE
				WHEN msg.sent_at IS NOT NULL THEN msg.sent_at
				ELSE NULL
		END AS last_sent_at
		FROM (
				SELECT id, name
				FROM members
				JOIN groups
				ON members.group_id = groups.id
				WHERE members.user_id = $1
		) AS g
		LEFT JOIN members AS m
		ON m.group_id = g.id
		LEFT JOIN users AS u
		ON m.user_id = u.id
		LEFT JOIN messages AS msg
		ON m.group_id = msg.group_id
		WHERE u.id != $1
		AND (
				msg.id IN (
						SELECT MAX(id)
						FROM messages
						GROUP BY group_id
				)
				OR msg.id IS NULL
		)
		ORDER BY last_sent_at DESC;`
	rows, err := models.DB.Query(ctx, stmt, userId)
	if err == pgx.ErrNoRows {
		return &pb.GetContactsRes{}, nil
	}
	if err != nil {
		return nil, err
	}
	contacts, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*pb.Contact, error) {
		var c pb.Contact
		var lastContent sql.NullString
		var lastSentAt sql.NullTime
		err := row.Scan(&c.Type, &c.Name, &c.UserId, &c.GroupId, &lastContent, &lastSentAt)
		c.LastSentAt = max(0, lastSentAt.Time.UnixMilli())
		c.LastContent = lastContent.String
		return &c, err
	})
	if err != nil {
		app.errorLog.Println(err.Error())
		return &pb.GetContactsRes{}, err
	}

	return &pb.GetContactsRes{Contacts: contacts}, nil
}

func (app *application) GetMessages(ctx context.Context, req *pb.GetMessagesReq) (*pb.GetMessagesRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &pb.GetMessagesRes{}, err
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &pb.GetMessagesRes{}, err
	}

	messages, err := app.messages.GetFromGroupId(ctx, userId, groupId)
	if err != nil {
		return &pb.GetMessagesRes{}, err
	}

	var pbMessages []*pb.Message
	for _, e := range messages {
		pbMessages = append(pbMessages, &pb.Message{
			Id:           int32(e.Id),
			FromUsername: e.FromUsername,
			Content:      e.Content,
			SentAt:       e.SentAt.UnixMilli(),
		})
	}
	return &pb.GetMessagesRes{Messages: pbMessages}, nil
}

// this method is only for Auth service when creating new users
// where username is providerName concat with providerId
func (app *application) CreateUser(ctx context.Context, req *pb.CreateUserReq) (*pb.CreateUserRes, error) {
	username := req.GetUsername()
	if l := len(username); l < 1 || l > 32 {
		return &pb.CreateUserRes{}, errors.New("user name must be at least 1 and not exceed 32 characters")
	}

	userId := uuid.New()
	err := app.users.Add(ctx, userId, username)
	var pgErr *pgconn.PgError
	if err != nil && !(errors.As(err, &pgErr) && pgErr.Code == "23505") {
		return &pb.CreateUserRes{}, err
	}

	return &pb.CreateUserRes{UserId: userId[:]}, nil
}

func (app *application) CreateGroup(ctx context.Context, req *pb.CreateGroupReq) (*pb.Null, error) {
	groupName := req.GetGroupName()
	if l := len(groupName); l < 1 || l > 16 {
		return nil, errors.New("group name must be at least 1 and not exceed 16 characters")
	}
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return nil, err
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	groupId := uuid.New()
	err = app.groups.Add(ctx, tx, groupId, groupName)
	if err != nil {
		return nil, err
	}

	err = app.members.Add(ctx, tx, userId, groupId)
	if err != nil {
		return nil, err
	}

	err = tx.Commit(ctx)
	return nil, err
}

func (app *application) AddFriend(ctx context.Context, req *pb.AddFriendReq) (*pb.Null, error) {
	fromUserId, err := uuid.FromBytes(req.GetFromUserId())
	if err != nil {
		return nil, err
	}

	toUserId, err := uuid.FromBytes(req.GetToUserId())
	if err != nil {
		return nil, err
	}

	isFriend, err := app.users.IsFriend(ctx, fromUserId, toUserId)
	if err != nil {
		return nil, err
	}
	if isFriend {
		return nil, errors.New("already friends")
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	groupId := uuid.New()
	err = app.groups.Add(ctx, tx, groupId, "")
	if err != nil {
		return nil, err
	}

	err = app.members.Add(ctx, tx, fromUserId, groupId)
	if err != nil {
		return nil, err
	}

	err = app.members.Add(ctx, tx, toUserId, groupId)
	if err != nil {
		return nil, err
	}

	err = tx.Commit(ctx)
	return nil, err
}

func (app *application) AddMember(ctx context.Context, req *pb.AddMemberReq) (*pb.Null, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return nil, err
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return nil, err
	}

	err = app.members.Add(ctx, nil, userId, groupId)
	return nil, err
}

func (app *application) SendMessage(ctx context.Context, req *pb.SendMessageReq) (*pb.SendMessageRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return nil, err
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return nil, err
	}

	content := req.GetContent()
	if l := len(content); l < 1 || l > 300 {
		return nil, errors.New("message must be at least 1 character and not exceed 300 characters")
	}

	sentAt := req.GetSentAt()

	id, err := app.messages.Add(ctx, userId, groupId, content, sentAt)
	return &pb.SendMessageRes{MessageId: id}, err
}

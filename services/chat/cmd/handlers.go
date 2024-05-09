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
	empty "google.golang.org/protobuf/types/known/emptypb"
	timestamp "google.golang.org/protobuf/types/known/timestamppb"
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
		SELECT
			DISTINCT
			CASE
				WHEN groups.name = '' THEN  'friend'
				ELSE 'group'
			END AS contact_type,
			groups.id AS group_id,
			COALESCE(
				NULLIF(groups.name, ''),
				users.username
			) AS contact_name,
			messages.id AS last_message_id,
			messages.content AS last_content,
			messages.sent_at AS last_sent_at
		FROM 
			"groups"
			JOIN members
			ON groups.id = members.group_id
			JOIN users
			ON members.user_id = users.id
			LEFT JOIN messages
			ON groups.id = messages.group_id
		WHERE
			groups.id IN (
				SELECT DISTINCT group_id
				FROM members
				WHERE user_id = $1
			)
			AND users.id != $1
			AND (
				messages.id IN (
					SELECT "id"
					FROM messages
					WHERE "id" IN (
						SELECT MAX("id")
						FROM messages
						GROUP BY group_id
					)
				)
				OR messages.id IS NULL
			)
		ORDER BY 
			last_sent_at DESC;`
	rows, err := models.DB.Query(ctx, stmt, userId)
	if err == pgx.ErrNoRows {
		return &pb.GetContactsRes{}, nil
	}
	if err != nil {
		return nil, err
	}
	contacts, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*pb.Contact, error) {
		var c pb.Contact
		var lastMessageId sql.NullInt32
		var lastContent sql.NullString
		var lastSentAt sql.NullTime
		err := row.Scan(&c.Type, &c.GroupId, &c.Name, &lastMessageId, &lastContent, &lastSentAt)
		c.LastMessageId = lastMessageId.Int32
		c.LastSentAt = timestamp.New(lastSentAt.Time)
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
			SentAt:       timestamp.New(e.SentAt),
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

func (app *application) CreateGroup(ctx context.Context, req *pb.CreateGroupReq) (*empty.Empty, error) {
	groupName := req.GetGroupName()
	if l := len(groupName); l < 1 || l > 16 {
		return &empty.Empty{}, errors.New("group name must be at least 1 and not exceed 16 characters")
	}
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &empty.Empty{}, err
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &empty.Empty{}, err
	}
	defer tx.Rollback(ctx)

	groupId := uuid.New()
	err = app.groups.Add(ctx, tx, groupId, groupName)
	if err != nil {
		return &empty.Empty{}, err
	}

	err = app.members.Add(ctx, tx, userId, groupId)
	if err != nil {
		return &empty.Empty{}, err
	}

	err = tx.Commit(ctx)
	return &empty.Empty{}, err
}

func (app *application) AddFriend(ctx context.Context, req *pb.AddFriendReq) (*empty.Empty, error) {
	fromUserId, err := uuid.FromBytes(req.GetFromUserId())
	if err != nil {
		return &empty.Empty{}, err
	}

	toUserId, err := uuid.FromBytes(req.GetToUserId())
	if err != nil {
		return &empty.Empty{}, err
	}

	isFriend, err := app.users.IsFriend(ctx, fromUserId, toUserId)
	if err != nil {
		return &empty.Empty{}, err
	}
	if isFriend {
		return &empty.Empty{}, errors.New("already friends")
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &empty.Empty{}, err
	}
	defer tx.Rollback(ctx)

	groupId := uuid.New()
	err = app.groups.Add(ctx, tx, groupId, "")
	if err != nil {
		return &empty.Empty{}, err
	}

	err = app.members.Add(ctx, tx, fromUserId, groupId)
	if err != nil {
		return &empty.Empty{}, err
	}

	err = app.members.Add(ctx, tx, toUserId, groupId)
	if err != nil {
		return &empty.Empty{}, err
	}

	err = tx.Commit(ctx)
	return &empty.Empty{}, err
}

func (app *application) AddMember(ctx context.Context, req *pb.AddMemberReq) (*empty.Empty, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &empty.Empty{}, err
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &empty.Empty{}, err
	}

	err = app.members.Add(ctx, nil, userId, groupId)
	return &empty.Empty{}, err
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

	sentAt := req.GetSentAt().AsTime()

	id, err := app.messages.Add(ctx, userId, groupId, content, sentAt)
	if err != nil {
		return nil, err
	}

	// app.pubClient.Publish(ctx, "message", map[string]any{

	// })
	return &pb.SendMessageRes{MessageId: id}, err
}

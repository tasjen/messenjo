package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

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
	switch {
	case err == pgx.ErrNoRows:
		return &pb.GetByUsernameRes{}, nil
	case err != nil:
		app.errorLog.Println(err.Error())
		return &pb.GetByUsernameRes{}, err
	}

	return &pb.GetByUsernameRes{UserId: userId[:]}, nil
}

func (app *application) GetUserById(ctx context.Context, req *pb.GetUserByIdReq) (*pb.GetUserByIdRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &pb.GetUserByIdRes{}, err
	}
	user, err := app.users.GetById(ctx, userId)
	return &pb.GetUserByIdRes{Username: user.Username, Pfp: user.Pfp}, err
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
		END AS "type",
		groups.id AS group_id,
		CASE
			WHEN groups.name = '' THEN users.id
			ELSE NULL
		END AS user_id,
		COALESCE(
			NULLIF(groups.name, ''),
			users.username
		) AS name,
		CASE
			WHEN groups.name = '' THEN users.pfp
			ELSE groups.pfp
		END AS pfp,
		CASE
			WHEN groups.name = '' THEN NULL
			ELSE m2.count
		END AS member_count,
		messages.id AS last_message_id,
		messages.content AS last_content,
		messages.sent_at AS last_sent_at
	FROM
		"groups"
		JOIN members AS m1
		ON groups.id = m1.group_id
		JOIN (
			SELECT COUNT(user_id), group_id
			FROM members
			GROUP BY group_id
		) AS m2
		ON m1.group_id = m2.group_id
		JOIN users
		ON m1.user_id = users.id
		LEFT JOIN messages
		ON groups.id = messages.group_id
	WHERE
		groups.id IN (
			SELECT group_id
			FROM members
			WHERE user_id = $1
		)
		AND users.id != $1
		AND (
			messages.id IN (
					SELECT MAX("id")
					FROM messages
					GROUP BY group_id
			)
			OR messages.id IS NULL
		);`
	rows, err := models.DB.Query(ctx, stmt, userId)
	switch {
	case err == pgx.ErrNoRows:
		return &pb.GetContactsRes{}, nil
	case err != nil:
		app.errorLog.Println(err.Error())
		return &pb.GetContactsRes{}, err
	}

	contacts, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*pb.Contact, error) {
		var c pb.Contact
		var lastMessageId sql.NullInt32
		var lastContent sql.NullString
		var lastSentAt sql.NullTime
		var memberCount sql.NullInt32
		err := row.Scan(&c.Type, &c.GroupId, &c.UserId, &c.Name, &c.Pfp, &memberCount, &lastMessageId, &lastContent, &lastSentAt)
		c.MemberCount = memberCount.Int32
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
			FromPfp:      e.FromPfp.String,
			Content:      e.Content,
			SentAt:       timestamp.New(e.SentAt),
		})
	}
	return &pb.GetMessagesRes{Messages: pbMessages}, nil
}

// this method is only for Streaming service when users connect to WebSocket
func (app *application) GetGroupIds(ctx context.Context, req *pb.GetGroupIdsReq) (*pb.GetGroupIdsRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		app.errorLog.Println(err.Error())
		return &pb.GetGroupIdsRes{}, err
	}

	stmt := `
 		SELECT group_id
		FROM members
		WHERE user_id = $1;`

	rows, err := models.DB.Query(ctx, stmt, userId)
	switch {
	case err == pgx.ErrNoRows:
		return &pb.GetGroupIdsRes{}, nil
	case err != nil:
		app.errorLog.Println(err.Error())
		return &pb.GetGroupIdsRes{}, err
	}

	groupIds, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) ([]byte, error) {
		var groupId []byte
		err := row.Scan(&groupId)
		return groupId, err
	})
	if err != nil {
		app.errorLog.Println(err.Error())
		return &pb.GetGroupIdsRes{}, err
	}

	return &pb.GetGroupIdsRes{GroupIds: groupIds}, nil
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

func (app *application) SetPfp(ctx context.Context, req *pb.SetPfpReq) (*empty.Empty, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &empty.Empty{}, err
	}

	pfpUrl := req.GetPfpUrl()
	if l := len(pfpUrl); l < 1 || l > 512 {
		return &empty.Empty{}, errors.New("pfpUrl name must be at least 1 and not exceed 512 characters")
	}

	err = app.users.SetPfp(ctx, userId, pfpUrl)
	return &empty.Empty{}, err
}

func (app *application) CreateGroup(ctx context.Context, req *pb.CreateGroupReq) (*empty.Empty, error) {
	groupName := req.GetGroupName()
	if l := len(groupName); l < 1 || l > 16 {
		return &empty.Empty{}, errors.New("group name must be at least 1 and not exceed 16 characters")
	}

	userIds := req.GetUserIds()

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

	_, err = tx.CopyFrom(
		ctx,
		pgx.Identifier{"members"},
		[]string{"user_id", "group_id"},
		pgx.CopyFromSlice(len(userIds), func(i int) ([]any, error) {
			userId, err := uuid.FromBytes(userIds[i])
			return []any{userId, groupId}, err
		}),
	)
	if err != nil {
		return &empty.Empty{}, err
	}

	err = tx.Commit(ctx)
	return &empty.Empty{}, err
}

func (app *application) SetUsername(ctx context.Context, req *pb.SetUsernameReq) (*empty.Empty, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &empty.Empty{}, err
	}
	username := req.GetUsername()
	if l := len(username); l < 1 || l > 32 {
		return &empty.Empty{}, errors.New("user name must be at least 1 and not exceed 32 characters")
	}

	err = app.users.SetUsername(ctx, userId, username)
	var dupUsernameError *models.DupUsernameError
	if err != nil && !errors.As(err, &dupUsernameError) {
		return &empty.Empty{}, errors.New("internal server error")
	}

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
	switch {
	case err != nil:
		return &empty.Empty{}, err
	case isFriend:
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

	id, fromUsername, fromPfp, err := app.messages.Add(ctx, userId, groupId, content, sentAt)
	if err != nil {
		return nil, err
	}

	sendMessageAction := NewSendMessageAction(groupId.String(), id, fromUsername, fromPfp, content, sentAt.UnixMilli())
	sendMessageActionJson, err := json.Marshal(sendMessageAction)
	if err != nil {
		fmt.Println(err)
	}
	app.pubClient.Publish(ctx, "main", sendMessageActionJson)
	return &pb.SendMessageRes{MessageId: id}, err
}

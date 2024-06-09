package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	pb "github.com/tasjen/message-app-fullstack/services/chat/internal/chat_proto"
	"github.com/tasjen/message-app-fullstack/services/chat/internal/models"
	empty "google.golang.org/protobuf/types/known/emptypb"
	timestamp "google.golang.org/protobuf/types/known/timestamppb"
)

func (app *application) GetUserByUsername(ctx context.Context, req *pb.GetUserByUsernameReq) (*pb.User, error) {
	username := req.GetUsername()
	if l := len(username); l < 1 || l > 32 {
		return &pb.User{}, errors.New("bad request")
	}

	user, err := app.users.GetByUsername(ctx, username)
	switch {
	case err == pgx.ErrNoRows:
		return &pb.User{}, nil
	case err != nil:
		return &pb.User{}, err
	}

	return &pb.User{Id: user.Id[:], Username: user.Username, Pfp: user.Pfp}, nil
}

func (app *application) GetUserById(ctx context.Context, req *pb.GetUserByIdReq) (*pb.User, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &pb.User{}, err
	}
	user, err := app.users.GetById(ctx, userId)
	return &pb.User{Id: user.Id[:], Username: user.Username, Pfp: user.Pfp}, err
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
		if lastMessageId.Valid {
			c.LastMessage = &pb.Message{
				Id:      lastMessageId.Int32,
				Content: lastContent.String,
				SentAt:  timestamp.New(lastSentAt.Time),
			}
		}
		return &c, err
	})
	if err != nil {
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
		return &pb.GetGroupIdsRes{}, err
	}

	groupIds, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) ([]byte, error) {
		var groupId []byte
		err := row.Scan(&groupId)
		return groupId, err
	})
	if err != nil {
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
	err := app.users.Add(ctx, userId, username, req.GetPfp())
	if err != nil {
		// Returns an error if the cause of error isn't from duplicated username
		var dupUsernameError *models.DupUsernameError
		if !errors.As(err, &dupUsernameError) {
			return &pb.CreateUserRes{}, err
		}

		// Else, return the user id of the username instead.
		// This ensure that if a user is successfully created in ChatDB but somehow failed in AuthDB,
		// there won't be an error from the next attempt to create the same user
		// since users will be created in both ChatDB and AuthDB respectively.
		user, err := app.users.GetByUsername(ctx, username)
		if err != nil {
			return &pb.CreateUserRes{}, err
		}
		userId = user.Id
	}

	return &pb.CreateUserRes{UserId: userId[:]}, nil
}

func (app *application) UpdateUser(ctx context.Context, req *pb.UpdateUserReq) (*empty.Empty, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &empty.Empty{}, err
	}

	username := req.GetUsername()
	if l := len(username); l < 1 || l > 16 {
		return &empty.Empty{}, errors.New("user name must be at least 1 and not exceed 16 characters")
	}

	pfp := req.GetPfp()
	if l := len(pfp); l > 1024 {
		return &empty.Empty{}, errors.New("pfpUrl name must not exceed 1024 characters")
	}

	err = app.users.Update(ctx, userId, username, pfp)
	var dupUsernameError *models.DupUsernameError
	if err != nil && !errors.As(err, &dupUsernameError) {
		return &empty.Empty{}, errors.New("internal server error")
	}
	return &empty.Empty{}, err
}

func (app *application) CreateGroup(ctx context.Context, req *pb.CreateGroupReq) (*pb.CreateGroupRes, error) {
	groupName := req.GetGroupName()
	if l := len(groupName); l < 1 || l > 16 {
		return &pb.CreateGroupRes{}, errors.New("group name must be at least 1 and not exceed 16 characters")
	}
	pfp := req.GetPfp()
	if l := len(groupName); l > 1024 {
		return &pb.CreateGroupRes{}, errors.New("profile picture's url not exceed 1024 characters")
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &pb.CreateGroupRes{}, err
	}
	defer tx.Rollback(ctx)

	groupId := uuid.New()
	err = app.groups.Add(ctx, tx, groupId, groupName, pfp)
	if err != nil {
		return &pb.CreateGroupRes{}, err
	}

	var userIds []uuid.UUID
	for _, e := range req.GetUserIds() {
		userId, err := uuid.FromBytes(e)
		if err != nil {
			return &pb.CreateGroupRes{}, err
		}
		userIds = append(userIds, userId)
	}

	err = app.members.Add(ctx, tx, groupId, userIds)
	if err != nil {
		return &pb.CreateGroupRes{}, err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return &pb.CreateGroupRes{}, err
	}

	var userIdsString []string
	for _, e := range userIds {
		userIdsString = append(userIdsString, e.String())
	}

	action := NewAddGroupContactAction(userIdsString, groupId.String(), groupName, pfp, len(userIds))
	actionJson, err := json.Marshal(action)
	if err != nil {
		app.errorLog.Println(err)
	} else {
		app.pubClient.Publish(ctx, "main", actionJson)
	}
	return &pb.CreateGroupRes{GroupId: groupId[:]}, nil
}

func (app *application) UpdateGroup(ctx context.Context, req *pb.UpdateGroupReq) (*empty.Empty, error) {
	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &empty.Empty{}, err
	}
	groupName := req.GetName()
	if l := len(groupName); l < 1 || l > 16 {
		return &empty.Empty{}, errors.New("group name must be at least 1 and not exceed 16 characters")
	}
	pfp := req.GetPfp()
	if l := len(pfp); l > 1024 {
		return &empty.Empty{}, errors.New("profile picture's url must not exceed 1024 characters")
	}

	err = app.groups.Update(ctx, groupId, groupName, pfp)
	return &empty.Empty{}, err
}

func (app *application) AddFriend(ctx context.Context, req *pb.AddFriendReq) (*pb.AddFriendRes, error) {
	fromUserId, err := uuid.FromBytes(req.GetFromUserId())
	if err != nil {
		return &pb.AddFriendRes{}, err
	}

	toUserId, err := uuid.FromBytes(req.GetToUserId())
	if err != nil {
		return &pb.AddFriendRes{}, err
	}

	isFriend, err := app.users.IsFriend(ctx, fromUserId, toUserId)
	switch {
	case err != nil:
		return &pb.AddFriendRes{}, err
	case isFriend:
		return &pb.AddFriendRes{}, errors.New("already friends")
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &pb.AddFriendRes{}, err
	}
	defer tx.Rollback(ctx)

	groupId := uuid.New()
	err = app.groups.Add(ctx, tx, groupId, "", "")
	if err != nil {
		return &pb.AddFriendRes{}, err
	}

	err = app.members.Add(ctx, tx, groupId, []uuid.UUID{fromUserId, toUserId})
	if err != nil {
		return &pb.AddFriendRes{}, err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return &pb.AddFriendRes{}, err
	}

	fromUser, err := app.users.GetById(ctx, fromUserId)
	if err != nil {
		return &pb.AddFriendRes{}, err
	}

	action := NewAddFriendContactAction(
		toUserId.String(),
		groupId.String(),
		fromUserId.String(),
		fromUser.Username,
		fromUser.Pfp,
	)
	actionJson, err := json.Marshal(action)
	if err != nil {
		app.errorLog.Println(err)
	} else {
		app.pubClient.Publish(ctx, "main", actionJson)
	}
	return &pb.AddFriendRes{GroupId: groupId[:]}, nil
}

func (app *application) AddMembers(ctx context.Context, req *pb.AddMembersReq) (*empty.Empty, error) {
	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &empty.Empty{}, err
	}

	var userIds []uuid.UUID
	for _, e := range req.GetUserIds() {
		userId, err := uuid.FromBytes(e)
		if err != nil {
			return &empty.Empty{}, err
		}
		userIds = append(userIds, userId)
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &empty.Empty{}, err
	}
	defer tx.Rollback(ctx)

	err = app.members.Add(ctx, tx, groupId, userIds)
	return &empty.Empty{}, err
}

func (app *application) SendMessage(ctx context.Context, req *pb.SendMessageReq) (*pb.SendMessageRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &pb.SendMessageRes{}, err
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &pb.SendMessageRes{}, err
	}

	content := req.GetContent()
	if l := len(content); l < 1 || l > 300 {
		return &pb.SendMessageRes{}, errors.New("message must be at least 1 character and not exceed 300 characters")
	}

	sentAt := req.GetSentAt().AsTime()

	id, fromUsername, fromPfp, err := app.messages.Add(ctx, userId, groupId, content, sentAt)
	if err != nil {
		return &pb.SendMessageRes{}, err
	}

	sendMessageAction := NewAddMessageAction(groupId.String(), id, fromUsername, fromPfp, content, sentAt.UnixMilli())
	sendMessageActionJson, err := json.Marshal(sendMessageAction)
	if err != nil {
		app.errorLog.Println(err)
	} else {
		app.pubClient.Publish(ctx, "main", sendMessageActionJson)
	}
	return &pb.SendMessageRes{MessageId: id}, nil
}

package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	auth_pb "github.com/tasjen/messenjo/services/chat/internal/gen/auth"
	chat_pb "github.com/tasjen/messenjo/services/chat/internal/gen/chat"
	"github.com/tasjen/messenjo/services/chat/internal/models"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	empty "google.golang.org/protobuf/types/known/emptypb"
	timestamp "google.golang.org/protobuf/types/known/timestamppb"
)

func (app *application) GetUserByUsername(ctx context.Context, req *chat_pb.GetUserByUsernameReq) (*chat_pb.User, error) {
	username := req.GetUsername()
	if l := len(username); l < 1 || l > 32 {
		return &chat_pb.User{}, status.Error(
			codes.InvalidArgument,
			"bad request",
		)
	}

	user, err := app.users.GetByUsername(ctx, username)
	switch {
	case err == pgx.ErrNoRows:
		return &chat_pb.User{}, nil
	case err != nil:
		return &chat_pb.User{}, status.Error(
			codes.Internal,
			err.Error(),
		)
	}

	return &chat_pb.User{Id: user.Id[:], Username: user.Username, Pfp: user.Pfp}, nil
}

func (app *application) GetUserById(ctx context.Context, req *chat_pb.GetUserByIdReq) (*chat_pb.User, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &chat_pb.User{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid userId: ", req.GetUserId()),
		)
	}
	user, err := app.users.GetById(ctx, userId)
	if err != nil {
		return &chat_pb.User{}, status.Error(codes.Internal, err.Error())
	}

	return &chat_pb.User{Id: user.Id[:], Username: user.Username, Pfp: user.Pfp}, nil
}

func (app *application) GetContacts(ctx context.Context, req *chat_pb.GetContactsReq) (*chat_pb.GetContactsRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &chat_pb.GetContactsRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid userId: ", req.GetUserId()),
		)
	}
	stmt := `
		WITH latest_messages AS (
			SELECT DISTINCT ON (group_id) *
			FROM messages
			ORDER BY group_id, sent_at DESC
		),
		my_contacts AS (
			SELECT *
			FROM members
			WHERE user_id = $1
		)
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
				ELSE (SELECT COUNT(*) FROM members WHERE members.group_id = groups.id)
			END AS member_count,
			my_contacts.unread_count AS unread_count,
			latest_messages.id AS last_message_id,
			latest_messages.content AS last_content,
			latest_messages.sent_at AS last_sent_at
		FROM
			members
			JOIN "groups"
			ON members.group_id = groups.id
			JOIN my_contacts
			ON members.group_id = my_contacts.group_id
			JOIN users
			ON members.user_id = users.id
			LEFT JOIN latest_messages
			ON groups.id = latest_messages.group_id
		WHERE
			users.id != $1;`
	rows, err := models.DB.Query(ctx, stmt, userId)
	switch {
	case err == pgx.ErrNoRows:
		return &chat_pb.GetContactsRes{}, nil
	case err != nil:
		return &chat_pb.GetContactsRes{}, status.Error(codes.Internal, err.Error())
	}

	contacts, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*chat_pb.Contact, error) {
		var c chat_pb.Contact
		var lastMessageId sql.NullInt32
		var lastContent sql.NullString
		var lastSentAt sql.NullTime
		var memberCount sql.NullInt32
		err := row.Scan(&c.Type, &c.GroupId, &c.UserId, &c.Name, &c.Pfp, &memberCount, &c.UnreadCount, &lastMessageId, &lastContent, &lastSentAt)
		c.MemberCount = memberCount.Int32
		if lastMessageId.Valid {
			c.LastMessage = &chat_pb.Message{
				Id:      lastMessageId.Int32,
				Content: lastContent.String,
				SentAt:  timestamp.New(lastSentAt.Time),
			}
		}
		return &c, err
	})
	if err != nil {
		return &chat_pb.GetContactsRes{}, status.Error(codes.Internal, err.Error())
	}

	return &chat_pb.GetContactsRes{Contacts: contacts}, nil
}

func (app *application) GetMessages(ctx context.Context, req *chat_pb.GetMessagesReq) (*chat_pb.GetMessagesRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &chat_pb.GetMessagesRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid userId: ", req.GetUserId()),
		)
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &chat_pb.GetMessagesRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid groupId: ", req.GetGroupId()),
		)
	}

	messages, err := app.messages.GetFromGroupId(ctx, userId, groupId)
	switch {
	case err == pgx.ErrNoRows:
		return &chat_pb.GetMessagesRes{}, nil
	case err != nil:
		return &chat_pb.GetMessagesRes{}, status.Error(codes.Internal, err.Error())
	}

	var pbMessages []*chat_pb.Message
	for _, e := range messages {
		pbMessages = append(pbMessages, &chat_pb.Message{
			Id:           int32(e.Id),
			FromUsername: e.FromUsername,
			FromPfp:      e.FromPfp.String,
			Content:      e.Content,
			SentAt:       timestamp.New(e.SentAt),
		})
	}
	return &chat_pb.GetMessagesRes{Messages: pbMessages}, nil
}

// this method is only for Streaming service when users connect to WebSocket
func (app *application) GetGroupIds(ctx context.Context, req *chat_pb.GetGroupIdsReq) (*chat_pb.GetGroupIdsRes, error) {
	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &chat_pb.GetGroupIdsRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid userId: ", req.GetUserId()),
		)
	}

	groupIds, err := app.members.GetGroupIds(ctx, userId)
	if err != nil {
		return &chat_pb.GetGroupIdsRes{}, status.Error(codes.Internal, err.Error())
	}
	var groupIdsBytes [][]byte
	for _, e := range groupIds {
		groupIdsBytes = append(groupIdsBytes, e[:])
	}

	return &chat_pb.GetGroupIdsRes{GroupIds: groupIdsBytes}, nil
}

// this method is only for Auth service when creating new users
// with default usernames being providerName joined by providerId
func (app *application) CreateUser(ctx context.Context, req *chat_pb.CreateUserReq) (*chat_pb.CreateUserRes, error) {
	username := req.GetUsername()
	if l := len(username); l < 1 || l > 32 {
		return &chat_pb.CreateUserRes{}, status.Error(
			codes.InvalidArgument,
			"username must be between 1 and 16 characters long",
		)
	}

	userId := uuid.New()
	err := app.users.Add(ctx, userId, username, req.GetPfp())
	if err != nil {
		// Returns an error if the cause of error isn't from duplicated username
		var dupUsernameError *models.DupUsernameError
		if !errors.As(err, &dupUsernameError) {
			return &chat_pb.CreateUserRes{}, status.Error(codes.Internal, err.Error())
		}

		// Else, return the user id of the username instead.
		// This ensure that if a user is successfully created in ChatDB
		// but somehow failed in AuthDB, there won't be an error from
		// the next attempt to create the same user since users will be
		// created in both ChatDB and AuthDB respectively.
		user, err := app.users.GetByUsername(ctx, username)
		if err != nil {
			return &chat_pb.CreateUserRes{}, status.Error(codes.Internal, err.Error())
		}
		userId = user.Id
	}

	return &chat_pb.CreateUserRes{UserId: userId[:]}, nil
}

func (app *application) UpdateUser(ctx context.Context, req *chat_pb.UpdateUserReq) (*empty.Empty, error) {
	err := verifyUser(ctx, req.GetUserId(), app.authClient)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Unauthenticated, err.Error())
	}

	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid userId: ", req.GetUserId()),
		)
	}

	username := req.GetUsername()
	if l := len(username); l < 1 || l > 16 {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			"username must be between 1 and 16 characters long",
		)
	}

	pfp := req.GetPfp()
	if l := len(pfp); l > 1024 {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			"profile picture's url not exceed 1024 characters",
		)
	}

	err = app.users.Update(ctx, userId, username, pfp)
	var dupUsernameError *models.DupUsernameError
	if err != nil && !errors.As(err, &dupUsernameError) {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}
	return &empty.Empty{}, nil
}

func (app *application) CreateGroup(ctx context.Context, req *chat_pb.CreateGroupReq) (*chat_pb.CreateGroupRes, error) {
	// if the group creator's userId doesn't match his verified userId
	err := verifyUser(ctx, req.GetUserIds()[0], app.authClient)
	if err != nil {
		return &chat_pb.CreateGroupRes{}, status.Error(codes.Unauthenticated, err.Error())
	}

	groupName := req.GetGroupName()
	if l := len(groupName); l < 1 || l > 16 {
		return &chat_pb.CreateGroupRes{}, status.Error(
			codes.InvalidArgument,
			"group name must be between 1 and 16 characters long",
		)
	}
	pfp := req.GetPfp()
	if l := len(groupName); l > 1024 {
		return &chat_pb.CreateGroupRes{}, status.Error(
			codes.InvalidArgument,
			"profile picture's url not exceed 1024 characters",
		)
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &chat_pb.CreateGroupRes{}, status.Error(codes.Internal, err.Error())
	}
	defer tx.Rollback(ctx)

	groupId := uuid.New()
	err = app.groups.Add(ctx, tx, groupId, groupName, pfp)
	if err != nil {
		return &chat_pb.CreateGroupRes{}, status.Error(codes.Internal, err.Error())
	}

	var userIds []uuid.UUID
	for _, e := range req.GetUserIds() {
		userId, err := uuid.FromBytes(e)
		if err != nil {
			return &chat_pb.CreateGroupRes{}, status.Error(
				codes.InvalidArgument,
				fmt.Sprint("invalid userId: ", e),
			)
		}
		userIds = append(userIds, userId)
	}

	err = app.members.Add(ctx, tx, groupId, userIds)
	if err != nil {
		return &chat_pb.CreateGroupRes{}, status.Error(codes.Internal, err.Error())
	}

	err = tx.Commit(ctx)
	if err != nil {
		return &chat_pb.CreateGroupRes{}, status.Error(codes.Internal, err.Error())
	}

	go func() {
		var userIdsString []string
		for _, e := range userIds {
			userIdsString = append(userIdsString, e.String())
		}
		action := NewAddGroupContactAction(userIdsString, groupId.String(), groupName, pfp, len(userIds))
		actionJson, err := json.Marshal(action)
		if err != nil {
			app.logger.Error(fmt.Sprint("failed to send AddContactAction:", err.Error()))
		} else {
			newCtx, cancel := context.WithTimeout(context.Background(), time.Second)
			defer cancel()
			app.redisClient.Publish(newCtx, "main", actionJson)
		}
	}()

	return &chat_pb.CreateGroupRes{GroupId: groupId[:]}, nil
}

func (app *application) UpdateGroup(ctx context.Context, req *chat_pb.UpdateGroupReq) (*empty.Empty, error) {
	token, err := getToken(ctx)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Unauthenticated, err.Error())
	}
	_, err = app.authClient.VerifyToken(ctx, &auth_pb.VerifyTokenReq{Token: token})
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Unauthenticated, err.Error())
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid groupId: ", req.GetGroupId()),
		)
	}
	groupName := req.GetName()
	if l := len(groupName); l < 1 || l > 16 {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			"group name must be between 1 and 16 characters long",
		)
	}
	pfp := req.GetPfp()
	if l := len(pfp); l > 1024 {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			"profile picture's url must not exceed 1024 characters",
		)
	}

	err = app.groups.Update(ctx, groupId, groupName, pfp)
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.Internal,
			err.Error(),
		)
	}
	return &empty.Empty{}, nil
}

func (app *application) AddFriend(ctx context.Context, req *chat_pb.AddFriendReq) (*chat_pb.AddFriendRes, error) {
	err := verifyUser(ctx, req.GetFromUserId(), app.authClient)
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(codes.Unauthenticated, err.Error())
	}

	fromUserId, err := uuid.FromBytes(req.GetFromUserId())
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid fromUserId: ", req.GetFromUserId()),
		)
	}

	toUserId, err := uuid.FromBytes(req.GetToUserId())
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid toUserId: ", req.GetToUserId()),
		)
	}

	isFriend, err := app.users.IsFriend(ctx, fromUserId, toUserId)
	switch {
	case err != nil:
		return &chat_pb.AddFriendRes{}, status.Error(codes.Internal, err.Error())
	case isFriend:
		return &chat_pb.AddFriendRes{}, status.Error(
			codes.PermissionDenied,
			"already friends",
		)
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(codes.Internal, err.Error())
	}
	defer tx.Rollback(ctx)

	groupId := uuid.New()
	err = app.groups.Add(ctx, tx, groupId, "", "")
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(codes.Internal, err.Error())
	}

	err = app.members.Add(ctx, tx, groupId, []uuid.UUID{fromUserId, toUserId})
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(codes.Internal, err.Error())
	}

	err = tx.Commit(ctx)
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(codes.Internal, err.Error())
	}

	go func() {
		newCtx, cancel := context.WithTimeout(context.Background(), time.Second)
		defer cancel()
		fromUser, err := app.users.GetById(newCtx, fromUserId)
		if err != nil {
			app.logger.Error(err.Error())
			return
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
			app.logger.Error(fmt.Sprint("failed to send AddContactAction:", err.Error()))
		} else {
			app.redisClient.Publish(newCtx, "main", actionJson)
		}
	}()

	return &chat_pb.AddFriendRes{GroupId: groupId[:]}, nil
}

func (app *application) AddMembers(ctx context.Context, req *chat_pb.AddMembersReq) (*empty.Empty, error) {
	// if the adder doesn't belong to the group
	err := verifyUser(ctx, req.GetUserIds()[0], app.authClient)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Unauthenticated, err.Error())
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid groupId: ", req.GetGroupId()),
		)
	}

	var userIds []uuid.UUID
	for _, e := range req.GetUserIds() {
		userId, err := uuid.FromBytes(e)
		if err != nil {
			return &empty.Empty{}, status.Error(
				codes.InvalidArgument,
				fmt.Sprint("invalid userId: ", userId),
			)
		}
		userIds = append(userIds, userId)
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}
	defer tx.Rollback(ctx)

	err = app.members.Add(ctx, tx, groupId, userIds)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}

	err = tx.Commit(ctx)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}

	return &empty.Empty{}, nil
}

func (app *application) AddMessage(ctx context.Context, req *chat_pb.AddMessageReq) (*chat_pb.AddMessageRes, error) {
	err := verifyUser(ctx, req.GetUserId(), app.authClient)
	if err != nil {
		return &chat_pb.AddMessageRes{}, status.Error(codes.Unauthenticated, err.Error())
	}

	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &chat_pb.AddMessageRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid userId: ", req.GetUserId()),
		)
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &chat_pb.AddMessageRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid groupId: ", req.GetGroupId()),
		)
	}

	content := req.GetContent()
	if l := len(content); l < 1 || l > 300 {
		return &chat_pb.AddMessageRes{}, status.Error(
			codes.InvalidArgument,
			"message must be at least 1 character and not exceed 300 characters",
		)
	}

	tx, err := models.DB.Begin(ctx)
	if err != nil {
		return &chat_pb.AddMessageRes{}, status.Error(codes.Internal, err.Error())
	}
	defer tx.Rollback(ctx)

	sentAt := req.GetSentAt().AsTime()
	id, fromUsername, fromPfp, err := app.messages.Add(ctx, tx, userId, groupId, content, sentAt)
	if err != nil {
		return &chat_pb.AddMessageRes{}, status.Error(codes.Internal, err.Error())
	}

	err = tx.Commit(ctx)
	if err != nil {
		return &chat_pb.AddMessageRes{}, status.Error(codes.Internal, err.Error())
	}

	go func() {
		sendMessageAction := NewAddMessageAction(groupId.String(), id, fromUsername, fromPfp, content, sentAt.UnixMilli())
		sendMessageActionJson, err := json.Marshal(sendMessageAction)
		if err != nil {
			app.logger.Error(fmt.Sprint("failed to send AddMessageAction:", err.Error()))
		} else {
			newCtx, cancel := context.WithTimeout(context.Background(), time.Second)
			defer cancel()
			app.redisClient.Publish(newCtx, "main", sendMessageActionJson)
		}
	}()

	return &chat_pb.AddMessageRes{MessageId: id}, nil
}

func (app *application) ResetUnreadCount(ctx context.Context, req *chat_pb.ResetUnreadCountReq) (*empty.Empty, error) {
	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid groupId: ", req.GetGroupId()),
		)
	}

	userId, err := uuid.FromBytes(req.GetUserId())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid userId: ", req.GetUserId()),
		)
	}

	err = app.members.ResetUnreadCount(ctx, groupId, userId)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}

	return &empty.Empty{}, nil
}

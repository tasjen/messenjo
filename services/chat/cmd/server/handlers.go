package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
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

	user, err := app.data.GetUserByUsername(ctx, username)
	if err != nil {
		return &chat_pb.User{}, status.Error(
			codes.Internal,
			err.Error(),
		)
	}
	return &chat_pb.User{Id: user.Id[:], Username: user.Username, Pfp: user.Pfp}, nil
}

func (app *application) GetUserInfo(ctx context.Context, req *empty.Empty) (*chat_pb.User, error) {
	userId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &chat_pb.User{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}
	user, err := app.data.GetUserById(ctx, userId)
	if err != nil {
		return &chat_pb.User{}, status.Error(codes.Internal, err.Error())
	}

	return &chat_pb.User{Id: user.Id[:], Username: user.Username, Pfp: user.Pfp}, nil
}

func (app *application) GetContacts(ctx context.Context, req *empty.Empty) (*chat_pb.GetContactsRes, error) {
	userId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &chat_pb.GetContactsRes{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}
	contacts, err := app.data.GetContacts(ctx, userId)
	if err != nil {
		return &chat_pb.GetContactsRes{}, status.Error(codes.Internal, err.Error())
	}

	var contactsPb []*chat_pb.Contact
	var groupIds []string
	for _, e := range contacts {
		contactsPb = append(contactsPb, &chat_pb.Contact{
			Type:        e.Type,
			GroupId:     e.GroupId[:],
			UserId:      e.UserId[:],
			Name:        e.Name,
			Pfp:         e.Pfp,
			MemberCount: int32(e.MemberCount),
			UnreadCount: int32(e.UnreadCount),
			LastMessage: &chat_pb.Message{
				Id:      int32(e.LastMessageId),
				Content: e.LastContent,
				SentAt:  timestamp.New(e.LastSentAt),
			},
		})
		groupIds = append(groupIds, e.GroupId.String())
	}

	groupIdsJson, err := json.Marshal(groupIds)
	err = app.redisClient.Set(ctx, userId.String(), string(groupIdsJson[:]), 10*time.Second).Err()
	if err != nil {
		return &chat_pb.GetContactsRes{}, status.Error(codes.Internal, err.Error())
	}

	return &chat_pb.GetContactsRes{Contacts: contactsPb}, nil
}

func (app *application) GetMessages(ctx context.Context, req *chat_pb.GetMessagesReq) (*chat_pb.GetMessagesRes, error) {
	userId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &chat_pb.GetMessagesRes{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &chat_pb.GetMessagesRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid groupId: ", req.GetGroupId()),
		)
	}

	start, end := req.GetStart(), req.GetEnd()
	switch {
	case start < 1:
		return &chat_pb.GetMessagesRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("`start` must be greater than 0", req.GetGroupId()),
		)
	case end < 1:
		return &chat_pb.GetMessagesRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("`end` must be greater than 0", req.GetGroupId()),
		)
	case start > end:
		return &chat_pb.GetMessagesRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("`end` must be greater than `start`", req.GetGroupId()),
		)
	case end-start > 50:
		return &chat_pb.GetMessagesRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("cannot get more than 50 messages at a time", req.GetGroupId()),
		)
	}

	messages, err := app.data.GetMessagesFromGroupId(ctx, userId, groupId, int(start), int(end))
	if err != nil {
		return &chat_pb.GetMessagesRes{}, status.Error(codes.Internal, err.Error())
	}

	var messagesPb []*chat_pb.Message
	for _, e := range messages {
		messagesPb = append(messagesPb, &chat_pb.Message{
			Id:           int32(e.Id),
			FromUsername: e.FromUsername,
			FromPfp:      e.FromPfp,
			Content:      e.Content,
			SentAt:       timestamp.New(e.SentAt),
		})
	}
	return &chat_pb.GetMessagesRes{Messages: messagesPb}, nil
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

	pfp, err := parsePfp(req.GetPfp())
	if err != nil {
		return &chat_pb.CreateUserRes{}, status.Error(
			codes.InvalidArgument,
			err.Error(),
		)
	}

	userId, err := app.data.AddUser(ctx, username, pfp)
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
		user, err := app.data.GetUserByUsername(ctx, username)
		if err != nil {
			return &chat_pb.CreateUserRes{}, status.Error(codes.Internal, err.Error())
		}
		userId = user.Id
	}

	return &chat_pb.CreateUserRes{UserId: userId[:]}, nil
}

func (app *application) UpdateUser(ctx context.Context, req *chat_pb.UpdateUserReq) (*empty.Empty, error) {
	userId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &empty.Empty{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}

	username := req.GetUsername()
	if l := len(username); l < 1 || l > 16 {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			"username must be between 1 and 16 characters long",
		)
	}

	pfp, err := parsePfp(req.GetPfp())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			err.Error(),
		)
	}

	err = app.data.UpdateUser(ctx, userId, username, pfp)
	var dupUsernameError *models.DupUsernameError
	if err != nil {
		if errors.As(err, &dupUsernameError) {
			return &empty.Empty{}, status.Error(
				codes.InvalidArgument,
				fmt.Sprintf("username `%v` already exists", username),
			)
		}
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}
	return &empty.Empty{}, nil
}

func (app *application) CreateGroup(ctx context.Context, req *chat_pb.CreateGroupReq) (*chat_pb.CreateGroupRes, error) {
	groupName := req.GetGroupName()
	if l := len(groupName); l < 1 || l > 16 {
		return &chat_pb.CreateGroupRes{}, status.Error(
			codes.InvalidArgument,
			"group name must be between 1 and 16 characters long",
		)
	}
	pfp, err := parsePfp(req.GetPfp())
	if err != nil {
		return &chat_pb.CreateGroupRes{}, status.Error(
			codes.InvalidArgument,
			err.Error(),
		)
	}

	// group creator
	creatorUserId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &chat_pb.CreateGroupRes{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}

	userIds := []uuid.UUID{creatorUserId}
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

	groupId, err := app.data.CreateGroup(ctx, groupName, pfp, userIds...)
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
			err = app.redisClient.Publish(newCtx, "main", actionJson).Err()
			if err != nil {
				app.logger.Error(fmt.Sprint("failed to send AddContactAction:", err.Error()))
			}
		}
	}()

	return &chat_pb.CreateGroupRes{GroupId: groupId[:]}, nil
}

func (app *application) UpdateGroup(ctx context.Context, req *chat_pb.UpdateGroupReq) (*empty.Empty, error) {
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
	pfp, err := parsePfp(req.GetPfp())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			err.Error(),
		)
	}

	err = app.data.UpdateGroup(ctx, groupId, groupName, pfp)
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.Internal,
			err.Error(),
		)
	}
	return &empty.Empty{}, nil
}

func (app *application) AddFriend(ctx context.Context, req *chat_pb.AddFriendReq) (*chat_pb.AddFriendRes, error) {
	fromUserId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &chat_pb.AddFriendRes{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}

	toUserId, err := uuid.FromBytes(req.GetToUserId())
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid toUserId: ", req.GetToUserId()),
		)
	}

	groupId, err := app.data.AddFriend(ctx, fromUserId, toUserId)
	if err != nil {
		return &chat_pb.AddFriendRes{}, status.Error(codes.Internal, err.Error())
	}

	go func() {
		newCtx, cancel := context.WithTimeout(context.Background(), time.Second)
		defer cancel()
		fromUser, err := app.data.GetUserById(newCtx, fromUserId)
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
			err = app.redisClient.Publish(newCtx, "main", actionJson).Err()
			if err != nil {
				app.logger.Error(fmt.Sprint("failed to send AddContactAction:", err.Error()))
			}
		}
	}()

	return &chat_pb.AddFriendRes{GroupId: groupId[:]}, nil
}

func (app *application) Unfriend(ctx context.Context, req *chat_pb.UnfriendReq) (*empty.Empty, error) {
	fromUserId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &empty.Empty{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}

	toUserId, err := uuid.FromBytes(req.GetToUserId())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid toUserId: ", req.GetToUserId()),
		)
	}

	err = app.data.Unfriend(ctx, fromUserId, toUserId)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}

	return &empty.Empty{}, nil
}

func (app *application) LeaveGroup(ctx context.Context, req *chat_pb.LeaveGroupReq) (*empty.Empty, error) {
	fromUserId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &empty.Empty{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid groupId: ", req.GetGroupId()),
		)
	}

	err = app.data.LeaveGroup(ctx, fromUserId, groupId)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}

	return &empty.Empty{}, nil
}

func (app *application) AddMembers(ctx context.Context, req *chat_pb.AddMembersReq) (*empty.Empty, error) {
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

	err = app.data.AddMembers(ctx, groupId, userIds...)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}

	return &empty.Empty{}, nil
}

func (app *application) AddMessage(ctx context.Context, req *chat_pb.AddMessageReq) (*chat_pb.AddMessageRes, error) {
	userId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &chat_pb.AddMessageRes{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
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
	sentAt := req.GetSentAt().AsTime()
	id, fromUsername, fromPfp, err := app.data.AddMessage(ctx, userId, groupId, content, sentAt)
	if err != nil {
		return &chat_pb.AddMessageRes{}, status.Error(codes.Internal, err.Error())
	}

	go func() {
		addMessageAction := NewAddMessageAction(groupId.String(), id, fromUsername, fromPfp, content, sentAt.UnixMilli())
		addMessageActionJson, err := json.Marshal(addMessageAction)
		if err != nil {
			app.logger.Error(fmt.Sprint("failed to send AddMessageAction:", err.Error()))
		} else {
			newCtx, cancel := context.WithTimeout(context.Background(), time.Second)
			defer cancel()
			err = app.redisClient.Publish(newCtx, "main", addMessageActionJson).Err()
			if err != nil {
				app.logger.Error(fmt.Sprint("failed to send AddMessageAction:", err.Error()))
			}
		}
	}()

	return &chat_pb.AddMessageRes{MessageId: id}, nil
}

func (app *application) ResetUnreadCount(ctx context.Context, req *chat_pb.ResetUnreadCountReq) (*empty.Empty, error) {
	userId, ok := ctx.Value(userIdKey{}).(uuid.UUID)
	if !ok {
		return &empty.Empty{}, status.Error(
			codes.Internal,
			"failed to get `userId` from ctx",
		)
	}

	groupId, err := uuid.FromBytes(req.GetGroupId())
	if err != nil {
		return &empty.Empty{}, status.Error(
			codes.InvalidArgument,
			fmt.Sprint("invalid groupId: ", req.GetGroupId()),
		)
	}

	err = app.data.ResetUnreadCount(ctx, groupId, userId)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.Internal, err.Error())
	}

	return &empty.Empty{}, nil
}

// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             (unknown)
// source: chat/chat.proto

package chat

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	Chat_CreateUser_FullMethodName        = "/messenjo.Chat/CreateUser"
	Chat_GetUserByUsername_FullMethodName = "/messenjo.Chat/GetUserByUsername"
	Chat_GetUserInfo_FullMethodName       = "/messenjo.Chat/GetUserInfo"
	Chat_GetContacts_FullMethodName       = "/messenjo.Chat/GetContacts"
	Chat_GetMessages_FullMethodName       = "/messenjo.Chat/GetMessages"
	Chat_CreateGroup_FullMethodName       = "/messenjo.Chat/CreateGroup"
	Chat_UpdateUser_FullMethodName        = "/messenjo.Chat/UpdateUser"
	Chat_UpdateGroup_FullMethodName       = "/messenjo.Chat/UpdateGroup"
	Chat_AddFriend_FullMethodName         = "/messenjo.Chat/AddFriend"
	Chat_Unfriend_FullMethodName          = "/messenjo.Chat/Unfriend"
	Chat_LeaveGroup_FullMethodName        = "/messenjo.Chat/LeaveGroup"
	Chat_AddMembers_FullMethodName        = "/messenjo.Chat/AddMembers"
	Chat_AddMessage_FullMethodName        = "/messenjo.Chat/AddMessage"
	Chat_ResetUnreadCount_FullMethodName  = "/messenjo.Chat/ResetUnreadCount"
)

// ChatClient is the client API for Chat service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ChatClient interface {
	// for Auth (auth not required)
	CreateUser(ctx context.Context, in *CreateUserReq, opts ...grpc.CallOption) (*CreateUserRes, error)
	// for View (auth required)
	GetUserByUsername(ctx context.Context, in *GetUserByUsernameReq, opts ...grpc.CallOption) (*User, error)
	GetUserInfo(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*User, error)
	GetContacts(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*GetContactsRes, error)
	GetMessages(ctx context.Context, in *GetMessagesReq, opts ...grpc.CallOption) (*GetMessagesRes, error)
	CreateGroup(ctx context.Context, in *CreateGroupReq, opts ...grpc.CallOption) (*CreateGroupRes, error)
	UpdateUser(ctx context.Context, in *UpdateUserReq, opts ...grpc.CallOption) (*emptypb.Empty, error)
	UpdateGroup(ctx context.Context, in *UpdateGroupReq, opts ...grpc.CallOption) (*emptypb.Empty, error)
	AddFriend(ctx context.Context, in *AddFriendReq, opts ...grpc.CallOption) (*AddFriendRes, error)
	Unfriend(ctx context.Context, in *UnfriendReq, opts ...grpc.CallOption) (*emptypb.Empty, error)
	LeaveGroup(ctx context.Context, in *LeaveGroupReq, opts ...grpc.CallOption) (*emptypb.Empty, error)
	AddMembers(ctx context.Context, in *AddMembersReq, opts ...grpc.CallOption) (*emptypb.Empty, error)
	AddMessage(ctx context.Context, in *AddMessageReq, opts ...grpc.CallOption) (*AddMessageRes, error)
	ResetUnreadCount(ctx context.Context, in *ResetUnreadCountReq, opts ...grpc.CallOption) (*emptypb.Empty, error)
}

type chatClient struct {
	cc grpc.ClientConnInterface
}

func NewChatClient(cc grpc.ClientConnInterface) ChatClient {
	return &chatClient{cc}
}

func (c *chatClient) CreateUser(ctx context.Context, in *CreateUserReq, opts ...grpc.CallOption) (*CreateUserRes, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CreateUserRes)
	err := c.cc.Invoke(ctx, Chat_CreateUser_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) GetUserByUsername(ctx context.Context, in *GetUserByUsernameReq, opts ...grpc.CallOption) (*User, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(User)
	err := c.cc.Invoke(ctx, Chat_GetUserByUsername_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) GetUserInfo(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*User, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(User)
	err := c.cc.Invoke(ctx, Chat_GetUserInfo_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) GetContacts(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*GetContactsRes, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetContactsRes)
	err := c.cc.Invoke(ctx, Chat_GetContacts_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) GetMessages(ctx context.Context, in *GetMessagesReq, opts ...grpc.CallOption) (*GetMessagesRes, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(GetMessagesRes)
	err := c.cc.Invoke(ctx, Chat_GetMessages_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) CreateGroup(ctx context.Context, in *CreateGroupReq, opts ...grpc.CallOption) (*CreateGroupRes, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(CreateGroupRes)
	err := c.cc.Invoke(ctx, Chat_CreateGroup_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) UpdateUser(ctx context.Context, in *UpdateUserReq, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, Chat_UpdateUser_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) UpdateGroup(ctx context.Context, in *UpdateGroupReq, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, Chat_UpdateGroup_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) AddFriend(ctx context.Context, in *AddFriendReq, opts ...grpc.CallOption) (*AddFriendRes, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(AddFriendRes)
	err := c.cc.Invoke(ctx, Chat_AddFriend_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) Unfriend(ctx context.Context, in *UnfriendReq, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, Chat_Unfriend_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) LeaveGroup(ctx context.Context, in *LeaveGroupReq, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, Chat_LeaveGroup_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) AddMembers(ctx context.Context, in *AddMembersReq, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, Chat_AddMembers_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) AddMessage(ctx context.Context, in *AddMessageReq, opts ...grpc.CallOption) (*AddMessageRes, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(AddMessageRes)
	err := c.cc.Invoke(ctx, Chat_AddMessage_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *chatClient) ResetUnreadCount(ctx context.Context, in *ResetUnreadCountReq, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, Chat_ResetUnreadCount_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ChatServer is the server API for Chat service.
// All implementations must embed UnimplementedChatServer
// for forward compatibility.
type ChatServer interface {
	// for Auth (auth not required)
	CreateUser(context.Context, *CreateUserReq) (*CreateUserRes, error)
	// for View (auth required)
	GetUserByUsername(context.Context, *GetUserByUsernameReq) (*User, error)
	GetUserInfo(context.Context, *emptypb.Empty) (*User, error)
	GetContacts(context.Context, *emptypb.Empty) (*GetContactsRes, error)
	GetMessages(context.Context, *GetMessagesReq) (*GetMessagesRes, error)
	CreateGroup(context.Context, *CreateGroupReq) (*CreateGroupRes, error)
	UpdateUser(context.Context, *UpdateUserReq) (*emptypb.Empty, error)
	UpdateGroup(context.Context, *UpdateGroupReq) (*emptypb.Empty, error)
	AddFriend(context.Context, *AddFriendReq) (*AddFriendRes, error)
	Unfriend(context.Context, *UnfriendReq) (*emptypb.Empty, error)
	LeaveGroup(context.Context, *LeaveGroupReq) (*emptypb.Empty, error)
	AddMembers(context.Context, *AddMembersReq) (*emptypb.Empty, error)
	AddMessage(context.Context, *AddMessageReq) (*AddMessageRes, error)
	ResetUnreadCount(context.Context, *ResetUnreadCountReq) (*emptypb.Empty, error)
	mustEmbedUnimplementedChatServer()
}

// UnimplementedChatServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedChatServer struct{}

func (UnimplementedChatServer) CreateUser(context.Context, *CreateUserReq) (*CreateUserRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateUser not implemented")
}
func (UnimplementedChatServer) GetUserByUsername(context.Context, *GetUserByUsernameReq) (*User, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetUserByUsername not implemented")
}
func (UnimplementedChatServer) GetUserInfo(context.Context, *emptypb.Empty) (*User, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetUserInfo not implemented")
}
func (UnimplementedChatServer) GetContacts(context.Context, *emptypb.Empty) (*GetContactsRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetContacts not implemented")
}
func (UnimplementedChatServer) GetMessages(context.Context, *GetMessagesReq) (*GetMessagesRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetMessages not implemented")
}
func (UnimplementedChatServer) CreateGroup(context.Context, *CreateGroupReq) (*CreateGroupRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateGroup not implemented")
}
func (UnimplementedChatServer) UpdateUser(context.Context, *UpdateUserReq) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateUser not implemented")
}
func (UnimplementedChatServer) UpdateGroup(context.Context, *UpdateGroupReq) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateGroup not implemented")
}
func (UnimplementedChatServer) AddFriend(context.Context, *AddFriendReq) (*AddFriendRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AddFriend not implemented")
}
func (UnimplementedChatServer) Unfriend(context.Context, *UnfriendReq) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Unfriend not implemented")
}
func (UnimplementedChatServer) LeaveGroup(context.Context, *LeaveGroupReq) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method LeaveGroup not implemented")
}
func (UnimplementedChatServer) AddMembers(context.Context, *AddMembersReq) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AddMembers not implemented")
}
func (UnimplementedChatServer) AddMessage(context.Context, *AddMessageReq) (*AddMessageRes, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AddMessage not implemented")
}
func (UnimplementedChatServer) ResetUnreadCount(context.Context, *ResetUnreadCountReq) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ResetUnreadCount not implemented")
}
func (UnimplementedChatServer) mustEmbedUnimplementedChatServer() {}
func (UnimplementedChatServer) testEmbeddedByValue()              {}

// UnsafeChatServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ChatServer will
// result in compilation errors.
type UnsafeChatServer interface {
	mustEmbedUnimplementedChatServer()
}

func RegisterChatServer(s grpc.ServiceRegistrar, srv ChatServer) {
	// If the following call pancis, it indicates UnimplementedChatServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&Chat_ServiceDesc, srv)
}

func _Chat_CreateUser_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateUserReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).CreateUser(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_CreateUser_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).CreateUser(ctx, req.(*CreateUserReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_GetUserByUsername_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetUserByUsernameReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).GetUserByUsername(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_GetUserByUsername_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).GetUserByUsername(ctx, req.(*GetUserByUsernameReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_GetUserInfo_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).GetUserInfo(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_GetUserInfo_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).GetUserInfo(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_GetContacts_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).GetContacts(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_GetContacts_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).GetContacts(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_GetMessages_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetMessagesReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).GetMessages(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_GetMessages_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).GetMessages(ctx, req.(*GetMessagesReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_CreateGroup_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateGroupReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).CreateGroup(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_CreateGroup_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).CreateGroup(ctx, req.(*CreateGroupReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_UpdateUser_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateUserReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).UpdateUser(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_UpdateUser_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).UpdateUser(ctx, req.(*UpdateUserReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_UpdateGroup_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateGroupReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).UpdateGroup(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_UpdateGroup_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).UpdateGroup(ctx, req.(*UpdateGroupReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_AddFriend_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AddFriendReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).AddFriend(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_AddFriend_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).AddFriend(ctx, req.(*AddFriendReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_Unfriend_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UnfriendReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).Unfriend(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_Unfriend_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).Unfriend(ctx, req.(*UnfriendReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_LeaveGroup_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(LeaveGroupReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).LeaveGroup(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_LeaveGroup_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).LeaveGroup(ctx, req.(*LeaveGroupReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_AddMembers_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AddMembersReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).AddMembers(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_AddMembers_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).AddMembers(ctx, req.(*AddMembersReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_AddMessage_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AddMessageReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).AddMessage(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_AddMessage_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).AddMessage(ctx, req.(*AddMessageReq))
	}
	return interceptor(ctx, in, info, handler)
}

func _Chat_ResetUnreadCount_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ResetUnreadCountReq)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ChatServer).ResetUnreadCount(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Chat_ResetUnreadCount_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ChatServer).ResetUnreadCount(ctx, req.(*ResetUnreadCountReq))
	}
	return interceptor(ctx, in, info, handler)
}

// Chat_ServiceDesc is the grpc.ServiceDesc for Chat service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Chat_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "messenjo.Chat",
	HandlerType: (*ChatServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreateUser",
			Handler:    _Chat_CreateUser_Handler,
		},
		{
			MethodName: "GetUserByUsername",
			Handler:    _Chat_GetUserByUsername_Handler,
		},
		{
			MethodName: "GetUserInfo",
			Handler:    _Chat_GetUserInfo_Handler,
		},
		{
			MethodName: "GetContacts",
			Handler:    _Chat_GetContacts_Handler,
		},
		{
			MethodName: "GetMessages",
			Handler:    _Chat_GetMessages_Handler,
		},
		{
			MethodName: "CreateGroup",
			Handler:    _Chat_CreateGroup_Handler,
		},
		{
			MethodName: "UpdateUser",
			Handler:    _Chat_UpdateUser_Handler,
		},
		{
			MethodName: "UpdateGroup",
			Handler:    _Chat_UpdateGroup_Handler,
		},
		{
			MethodName: "AddFriend",
			Handler:    _Chat_AddFriend_Handler,
		},
		{
			MethodName: "Unfriend",
			Handler:    _Chat_Unfriend_Handler,
		},
		{
			MethodName: "LeaveGroup",
			Handler:    _Chat_LeaveGroup_Handler,
		},
		{
			MethodName: "AddMembers",
			Handler:    _Chat_AddMembers_Handler,
		},
		{
			MethodName: "AddMessage",
			Handler:    _Chat_AddMessage_Handler,
		},
		{
			MethodName: "ResetUnreadCount",
			Handler:    _Chat_ResetUnreadCount_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "chat/chat.proto",
}

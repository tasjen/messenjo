// Original file: lib/chat_proto/chat.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AddFriendReq as _AddFriendReq, AddFriendReq__Output as _AddFriendReq__Output } from './AddFriendReq';
import type { AddFriendRes as _AddFriendRes, AddFriendRes__Output as _AddFriendRes__Output } from './AddFriendRes';
import type { AddMembersReq as _AddMembersReq, AddMembersReq__Output as _AddMembersReq__Output } from './AddMembersReq';
import type { CreateGroupReq as _CreateGroupReq, CreateGroupReq__Output as _CreateGroupReq__Output } from './CreateGroupReq';
import type { CreateGroupRes as _CreateGroupRes, CreateGroupRes__Output as _CreateGroupRes__Output } from './CreateGroupRes';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { GetContactsReq as _GetContactsReq, GetContactsReq__Output as _GetContactsReq__Output } from './GetContactsReq';
import type { GetContactsRes as _GetContactsRes, GetContactsRes__Output as _GetContactsRes__Output } from './GetContactsRes';
import type { GetMessagesReq as _GetMessagesReq, GetMessagesReq__Output as _GetMessagesReq__Output } from './GetMessagesReq';
import type { GetMessagesRes as _GetMessagesRes, GetMessagesRes__Output as _GetMessagesRes__Output } from './GetMessagesRes';
import type { GetUserByIdReq as _GetUserByIdReq, GetUserByIdReq__Output as _GetUserByIdReq__Output } from './GetUserByIdReq';
import type { GetUserByUsernameReq as _GetUserByUsernameReq, GetUserByUsernameReq__Output as _GetUserByUsernameReq__Output } from './GetUserByUsernameReq';
import type { SendMessageReq as _SendMessageReq, SendMessageReq__Output as _SendMessageReq__Output } from './SendMessageReq';
import type { SendMessageRes as _SendMessageRes, SendMessageRes__Output as _SendMessageRes__Output } from './SendMessageRes';
import type { UpdateGroupReq as _UpdateGroupReq, UpdateGroupReq__Output as _UpdateGroupReq__Output } from './UpdateGroupReq';
import type { UpdateUserReq as _UpdateUserReq, UpdateUserReq__Output as _UpdateUserReq__Output } from './UpdateUserReq';
import type { User as _User, User__Output as _User__Output } from './User';

export interface ChatClient extends grpc.Client {
  AddFriend(argument: _AddFriendReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_AddFriendRes__Output>): grpc.ClientUnaryCall;
  AddFriend(argument: _AddFriendReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_AddFriendRes__Output>): grpc.ClientUnaryCall;
  AddFriend(argument: _AddFriendReq, options: grpc.CallOptions, callback: grpc.requestCallback<_AddFriendRes__Output>): grpc.ClientUnaryCall;
  AddFriend(argument: _AddFriendReq, callback: grpc.requestCallback<_AddFriendRes__Output>): grpc.ClientUnaryCall;
  addFriend(argument: _AddFriendReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_AddFriendRes__Output>): grpc.ClientUnaryCall;
  addFriend(argument: _AddFriendReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_AddFriendRes__Output>): grpc.ClientUnaryCall;
  addFriend(argument: _AddFriendReq, options: grpc.CallOptions, callback: grpc.requestCallback<_AddFriendRes__Output>): grpc.ClientUnaryCall;
  addFriend(argument: _AddFriendReq, callback: grpc.requestCallback<_AddFriendRes__Output>): grpc.ClientUnaryCall;
  
  AddMembers(argument: _AddMembersReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddMembers(argument: _AddMembersReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddMembers(argument: _AddMembersReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddMembers(argument: _AddMembersReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addMembers(argument: _AddMembersReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addMembers(argument: _AddMembersReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addMembers(argument: _AddMembersReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addMembers(argument: _AddMembersReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  CreateGroup(argument: _CreateGroupReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateGroupRes__Output>): grpc.ClientUnaryCall;
  CreateGroup(argument: _CreateGroupReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_CreateGroupRes__Output>): grpc.ClientUnaryCall;
  CreateGroup(argument: _CreateGroupReq, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateGroupRes__Output>): grpc.ClientUnaryCall;
  CreateGroup(argument: _CreateGroupReq, callback: grpc.requestCallback<_CreateGroupRes__Output>): grpc.ClientUnaryCall;
  createGroup(argument: _CreateGroupReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateGroupRes__Output>): grpc.ClientUnaryCall;
  createGroup(argument: _CreateGroupReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_CreateGroupRes__Output>): grpc.ClientUnaryCall;
  createGroup(argument: _CreateGroupReq, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateGroupRes__Output>): grpc.ClientUnaryCall;
  createGroup(argument: _CreateGroupReq, callback: grpc.requestCallback<_CreateGroupRes__Output>): grpc.ClientUnaryCall;
  
  GetContacts(argument: _GetContactsReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetContactsRes__Output>): grpc.ClientUnaryCall;
  GetContacts(argument: _GetContactsReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetContactsRes__Output>): grpc.ClientUnaryCall;
  GetContacts(argument: _GetContactsReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetContactsRes__Output>): grpc.ClientUnaryCall;
  GetContacts(argument: _GetContactsReq, callback: grpc.requestCallback<_GetContactsRes__Output>): grpc.ClientUnaryCall;
  getContacts(argument: _GetContactsReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetContactsRes__Output>): grpc.ClientUnaryCall;
  getContacts(argument: _GetContactsReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetContactsRes__Output>): grpc.ClientUnaryCall;
  getContacts(argument: _GetContactsReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetContactsRes__Output>): grpc.ClientUnaryCall;
  getContacts(argument: _GetContactsReq, callback: grpc.requestCallback<_GetContactsRes__Output>): grpc.ClientUnaryCall;
  
  GetMessages(argument: _GetMessagesReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetMessagesRes__Output>): grpc.ClientUnaryCall;
  GetMessages(argument: _GetMessagesReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetMessagesRes__Output>): grpc.ClientUnaryCall;
  GetMessages(argument: _GetMessagesReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetMessagesRes__Output>): grpc.ClientUnaryCall;
  GetMessages(argument: _GetMessagesReq, callback: grpc.requestCallback<_GetMessagesRes__Output>): grpc.ClientUnaryCall;
  getMessages(argument: _GetMessagesReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetMessagesRes__Output>): grpc.ClientUnaryCall;
  getMessages(argument: _GetMessagesReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetMessagesRes__Output>): grpc.ClientUnaryCall;
  getMessages(argument: _GetMessagesReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetMessagesRes__Output>): grpc.ClientUnaryCall;
  getMessages(argument: _GetMessagesReq, callback: grpc.requestCallback<_GetMessagesRes__Output>): grpc.ClientUnaryCall;
  
  GetUserById(argument: _GetUserByIdReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  GetUserById(argument: _GetUserByIdReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  GetUserById(argument: _GetUserByIdReq, options: grpc.CallOptions, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  GetUserById(argument: _GetUserByIdReq, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  getUserById(argument: _GetUserByIdReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  getUserById(argument: _GetUserByIdReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  getUserById(argument: _GetUserByIdReq, options: grpc.CallOptions, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  getUserById(argument: _GetUserByIdReq, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  
  GetUserByUsername(argument: _GetUserByUsernameReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  GetUserByUsername(argument: _GetUserByUsernameReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  GetUserByUsername(argument: _GetUserByUsernameReq, options: grpc.CallOptions, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  GetUserByUsername(argument: _GetUserByUsernameReq, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  getUserByUsername(argument: _GetUserByUsernameReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  getUserByUsername(argument: _GetUserByUsernameReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  getUserByUsername(argument: _GetUserByUsernameReq, options: grpc.CallOptions, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  getUserByUsername(argument: _GetUserByUsernameReq, callback: grpc.requestCallback<_User__Output>): grpc.ClientUnaryCall;
  
  SendMessage(argument: _SendMessageReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _SendMessageReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _SendMessageReq, options: grpc.CallOptions, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _SendMessageReq, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _SendMessageReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _SendMessageReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _SendMessageReq, options: grpc.CallOptions, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _SendMessageReq, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  
  UpdateGroup(argument: _UpdateGroupReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateGroup(argument: _UpdateGroupReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateGroup(argument: _UpdateGroupReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateGroup(argument: _UpdateGroupReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateGroup(argument: _UpdateGroupReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateGroup(argument: _UpdateGroupReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateGroup(argument: _UpdateGroupReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateGroup(argument: _UpdateGroupReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  UpdateUser(argument: _UpdateUserReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _UpdateUserReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _UpdateUserReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  UpdateUser(argument: _UpdateUserReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _UpdateUserReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _UpdateUserReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _UpdateUserReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  updateUser(argument: _UpdateUserReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
}

export interface ChatHandlers extends grpc.UntypedServiceImplementation {
  AddFriend: grpc.handleUnaryCall<_AddFriendReq__Output, _AddFriendRes>;
  
  AddMembers: grpc.handleUnaryCall<_AddMembersReq__Output, _google_protobuf_Empty>;
  
  CreateGroup: grpc.handleUnaryCall<_CreateGroupReq__Output, _CreateGroupRes>;
  
  GetContacts: grpc.handleUnaryCall<_GetContactsReq__Output, _GetContactsRes>;
  
  GetMessages: grpc.handleUnaryCall<_GetMessagesReq__Output, _GetMessagesRes>;
  
  GetUserById: grpc.handleUnaryCall<_GetUserByIdReq__Output, _User>;
  
  GetUserByUsername: grpc.handleUnaryCall<_GetUserByUsernameReq__Output, _User>;
  
  SendMessage: grpc.handleUnaryCall<_SendMessageReq__Output, _SendMessageRes>;
  
  UpdateGroup: grpc.handleUnaryCall<_UpdateGroupReq__Output, _google_protobuf_Empty>;
  
  UpdateUser: grpc.handleUnaryCall<_UpdateUserReq__Output, _google_protobuf_Empty>;
  
}

export interface ChatDefinition extends grpc.ServiceDefinition {
  AddFriend: MethodDefinition<_AddFriendReq, _AddFriendRes, _AddFriendReq__Output, _AddFriendRes__Output>
  AddMembers: MethodDefinition<_AddMembersReq, _google_protobuf_Empty, _AddMembersReq__Output, _google_protobuf_Empty__Output>
  CreateGroup: MethodDefinition<_CreateGroupReq, _CreateGroupRes, _CreateGroupReq__Output, _CreateGroupRes__Output>
  GetContacts: MethodDefinition<_GetContactsReq, _GetContactsRes, _GetContactsReq__Output, _GetContactsRes__Output>
  GetMessages: MethodDefinition<_GetMessagesReq, _GetMessagesRes, _GetMessagesReq__Output, _GetMessagesRes__Output>
  GetUserById: MethodDefinition<_GetUserByIdReq, _User, _GetUserByIdReq__Output, _User__Output>
  GetUserByUsername: MethodDefinition<_GetUserByUsernameReq, _User, _GetUserByUsernameReq__Output, _User__Output>
  SendMessage: MethodDefinition<_SendMessageReq, _SendMessageRes, _SendMessageReq__Output, _SendMessageRes__Output>
  UpdateGroup: MethodDefinition<_UpdateGroupReq, _google_protobuf_Empty, _UpdateGroupReq__Output, _google_protobuf_Empty__Output>
  UpdateUser: MethodDefinition<_UpdateUserReq, _google_protobuf_Empty, _UpdateUserReq__Output, _google_protobuf_Empty__Output>
}

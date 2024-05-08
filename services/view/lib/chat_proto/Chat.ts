// Original file: chat.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AddFriendReq as _AddFriendReq, AddFriendReq__Output as _AddFriendReq__Output } from './AddFriendReq';
import type { AddMemberReq as _AddMemberReq, AddMemberReq__Output as _AddMemberReq__Output } from './AddMemberReq';
import type { CreateGroupReq as _CreateGroupReq, CreateGroupReq__Output as _CreateGroupReq__Output } from './CreateGroupReq';
import type { CreateUserReq as _CreateUserReq, CreateUserReq__Output as _CreateUserReq__Output } from './CreateUserReq';
import type { CreateUserRes as _CreateUserRes, CreateUserRes__Output as _CreateUserRes__Output } from './CreateUserRes';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { GetByUsernameReq as _GetByUsernameReq, GetByUsernameReq__Output as _GetByUsernameReq__Output } from './GetByUsernameReq';
import type { GetByUsernameRes as _GetByUsernameRes, GetByUsernameRes__Output as _GetByUsernameRes__Output } from './GetByUsernameRes';
import type { GetContactsReq as _GetContactsReq, GetContactsReq__Output as _GetContactsReq__Output } from './GetContactsReq';
import type { GetContactsRes as _GetContactsRes, GetContactsRes__Output as _GetContactsRes__Output } from './GetContactsRes';
import type { GetMessagesReq as _GetMessagesReq, GetMessagesReq__Output as _GetMessagesReq__Output } from './GetMessagesReq';
import type { GetMessagesRes as _GetMessagesRes, GetMessagesRes__Output as _GetMessagesRes__Output } from './GetMessagesRes';
import type { GetUserByIdReq as _GetUserByIdReq, GetUserByIdReq__Output as _GetUserByIdReq__Output } from './GetUserByIdReq';
import type { GetUserByIdRes as _GetUserByIdRes, GetUserByIdRes__Output as _GetUserByIdRes__Output } from './GetUserByIdRes';
import type { SendMessageReq as _SendMessageReq, SendMessageReq__Output as _SendMessageReq__Output } from './SendMessageReq';
import type { SendMessageRes as _SendMessageRes, SendMessageRes__Output as _SendMessageRes__Output } from './SendMessageRes';

export interface ChatClient extends grpc.Client {
  AddFriend(argument: _AddFriendReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddFriend(argument: _AddFriendReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddFriend(argument: _AddFriendReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddFriend(argument: _AddFriendReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addFriend(argument: _AddFriendReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addFriend(argument: _AddFriendReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addFriend(argument: _AddFriendReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addFriend(argument: _AddFriendReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  AddMember(argument: _AddMemberReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddMember(argument: _AddMemberReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddMember(argument: _AddMemberReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  AddMember(argument: _AddMemberReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addMember(argument: _AddMemberReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addMember(argument: _AddMemberReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addMember(argument: _AddMemberReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  addMember(argument: _AddMemberReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  CreateGroup(argument: _CreateGroupReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CreateGroup(argument: _CreateGroupReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CreateGroup(argument: _CreateGroupReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  CreateGroup(argument: _CreateGroupReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  createGroup(argument: _CreateGroupReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  createGroup(argument: _CreateGroupReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  createGroup(argument: _CreateGroupReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  createGroup(argument: _CreateGroupReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  CreateUser(argument: _CreateUserReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateUserRes__Output>): grpc.ClientUnaryCall;
  CreateUser(argument: _CreateUserReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_CreateUserRes__Output>): grpc.ClientUnaryCall;
  CreateUser(argument: _CreateUserReq, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateUserRes__Output>): grpc.ClientUnaryCall;
  CreateUser(argument: _CreateUserReq, callback: grpc.requestCallback<_CreateUserRes__Output>): grpc.ClientUnaryCall;
  createUser(argument: _CreateUserReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateUserRes__Output>): grpc.ClientUnaryCall;
  createUser(argument: _CreateUserReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_CreateUserRes__Output>): grpc.ClientUnaryCall;
  createUser(argument: _CreateUserReq, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateUserRes__Output>): grpc.ClientUnaryCall;
  createUser(argument: _CreateUserReq, callback: grpc.requestCallback<_CreateUserRes__Output>): grpc.ClientUnaryCall;
  
  GetByUsername(argument: _GetByUsernameReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetByUsernameRes__Output>): grpc.ClientUnaryCall;
  GetByUsername(argument: _GetByUsernameReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetByUsernameRes__Output>): grpc.ClientUnaryCall;
  GetByUsername(argument: _GetByUsernameReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetByUsernameRes__Output>): grpc.ClientUnaryCall;
  GetByUsername(argument: _GetByUsernameReq, callback: grpc.requestCallback<_GetByUsernameRes__Output>): grpc.ClientUnaryCall;
  getByUsername(argument: _GetByUsernameReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetByUsernameRes__Output>): grpc.ClientUnaryCall;
  getByUsername(argument: _GetByUsernameReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetByUsernameRes__Output>): grpc.ClientUnaryCall;
  getByUsername(argument: _GetByUsernameReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetByUsernameRes__Output>): grpc.ClientUnaryCall;
  getByUsername(argument: _GetByUsernameReq, callback: grpc.requestCallback<_GetByUsernameRes__Output>): grpc.ClientUnaryCall;
  
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
  
  GetUserById(argument: _GetUserByIdReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetUserByIdRes__Output>): grpc.ClientUnaryCall;
  GetUserById(argument: _GetUserByIdReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetUserByIdRes__Output>): grpc.ClientUnaryCall;
  GetUserById(argument: _GetUserByIdReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetUserByIdRes__Output>): grpc.ClientUnaryCall;
  GetUserById(argument: _GetUserByIdReq, callback: grpc.requestCallback<_GetUserByIdRes__Output>): grpc.ClientUnaryCall;
  getUserById(argument: _GetUserByIdReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetUserByIdRes__Output>): grpc.ClientUnaryCall;
  getUserById(argument: _GetUserByIdReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetUserByIdRes__Output>): grpc.ClientUnaryCall;
  getUserById(argument: _GetUserByIdReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetUserByIdRes__Output>): grpc.ClientUnaryCall;
  getUserById(argument: _GetUserByIdReq, callback: grpc.requestCallback<_GetUserByIdRes__Output>): grpc.ClientUnaryCall;
  
  SendMessage(argument: _SendMessageReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _SendMessageReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _SendMessageReq, options: grpc.CallOptions, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  SendMessage(argument: _SendMessageReq, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _SendMessageReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _SendMessageReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _SendMessageReq, options: grpc.CallOptions, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  sendMessage(argument: _SendMessageReq, callback: grpc.requestCallback<_SendMessageRes__Output>): grpc.ClientUnaryCall;
  
}

export interface ChatHandlers extends grpc.UntypedServiceImplementation {
  AddFriend: grpc.handleUnaryCall<_AddFriendReq__Output, _google_protobuf_Empty>;
  
  AddMember: grpc.handleUnaryCall<_AddMemberReq__Output, _google_protobuf_Empty>;
  
  CreateGroup: grpc.handleUnaryCall<_CreateGroupReq__Output, _google_protobuf_Empty>;
  
  CreateUser: grpc.handleUnaryCall<_CreateUserReq__Output, _CreateUserRes>;
  
  GetByUsername: grpc.handleUnaryCall<_GetByUsernameReq__Output, _GetByUsernameRes>;
  
  GetContacts: grpc.handleUnaryCall<_GetContactsReq__Output, _GetContactsRes>;
  
  GetMessages: grpc.handleUnaryCall<_GetMessagesReq__Output, _GetMessagesRes>;
  
  GetUserById: grpc.handleUnaryCall<_GetUserByIdReq__Output, _GetUserByIdRes>;
  
  SendMessage: grpc.handleUnaryCall<_SendMessageReq__Output, _SendMessageRes>;
  
}

export interface ChatDefinition extends grpc.ServiceDefinition {
  AddFriend: MethodDefinition<_AddFriendReq, _google_protobuf_Empty, _AddFriendReq__Output, _google_protobuf_Empty__Output>
  AddMember: MethodDefinition<_AddMemberReq, _google_protobuf_Empty, _AddMemberReq__Output, _google_protobuf_Empty__Output>
  CreateGroup: MethodDefinition<_CreateGroupReq, _google_protobuf_Empty, _CreateGroupReq__Output, _google_protobuf_Empty__Output>
  CreateUser: MethodDefinition<_CreateUserReq, _CreateUserRes, _CreateUserReq__Output, _CreateUserRes__Output>
  GetByUsername: MethodDefinition<_GetByUsernameReq, _GetByUsernameRes, _GetByUsernameReq__Output, _GetByUsernameRes__Output>
  GetContacts: MethodDefinition<_GetContactsReq, _GetContactsRes, _GetContactsReq__Output, _GetContactsRes__Output>
  GetMessages: MethodDefinition<_GetMessagesReq, _GetMessagesRes, _GetMessagesReq__Output, _GetMessagesRes__Output>
  GetUserById: MethodDefinition<_GetUserByIdReq, _GetUserByIdRes, _GetUserByIdReq__Output, _GetUserByIdRes__Output>
  SendMessage: MethodDefinition<_SendMessageReq, _SendMessageRes, _SendMessageReq__Output, _SendMessageRes__Output>
}

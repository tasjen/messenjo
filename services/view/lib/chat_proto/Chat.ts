// Original file: lib/chat_proto/chat.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AddFriendReq as _AddFriendReq, AddFriendReq__Output as _AddFriendReq__Output } from './AddFriendReq';
import type { AddFriendRes as _AddFriendRes, AddFriendRes__Output as _AddFriendRes__Output } from './AddFriendRes';
import type { AddMemberReq as _AddMemberReq, AddMemberReq__Output as _AddMemberReq__Output } from './AddMemberReq';
import type { CreateGroupReq as _CreateGroupReq, CreateGroupReq__Output as _CreateGroupReq__Output } from './CreateGroupReq';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { GetContactsReq as _GetContactsReq, GetContactsReq__Output as _GetContactsReq__Output } from './GetContactsReq';
import type { GetContactsRes as _GetContactsRes, GetContactsRes__Output as _GetContactsRes__Output } from './GetContactsRes';
import type { GetMessagesReq as _GetMessagesReq, GetMessagesReq__Output as _GetMessagesReq__Output } from './GetMessagesReq';
import type { GetMessagesRes as _GetMessagesRes, GetMessagesRes__Output as _GetMessagesRes__Output } from './GetMessagesRes';
import type { GetUserByIdReq as _GetUserByIdReq, GetUserByIdReq__Output as _GetUserByIdReq__Output } from './GetUserByIdReq';
import type { GetUserByUsernameReq as _GetUserByUsernameReq, GetUserByUsernameReq__Output as _GetUserByUsernameReq__Output } from './GetUserByUsernameReq';
import type { SendMessageReq as _SendMessageReq, SendMessageReq__Output as _SendMessageReq__Output } from './SendMessageReq';
import type { SendMessageRes as _SendMessageRes, SendMessageRes__Output as _SendMessageRes__Output } from './SendMessageRes';
import type { SetGroupPfpReq as _SetGroupPfpReq, SetGroupPfpReq__Output as _SetGroupPfpReq__Output } from './SetGroupPfpReq';
import type { SetUserPfpReq as _SetUserPfpReq, SetUserPfpReq__Output as _SetUserPfpReq__Output } from './SetUserPfpReq';
import type { SetUsernameReq as _SetUsernameReq, SetUsernameReq__Output as _SetUsernameReq__Output } from './SetUsernameReq';
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
  
  SetGroupPfp(argument: _SetGroupPfpReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetGroupPfp(argument: _SetGroupPfpReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetGroupPfp(argument: _SetGroupPfpReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetGroupPfp(argument: _SetGroupPfpReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setGroupPfp(argument: _SetGroupPfpReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setGroupPfp(argument: _SetGroupPfpReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setGroupPfp(argument: _SetGroupPfpReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setGroupPfp(argument: _SetGroupPfpReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  SetUserPfp(argument: _SetUserPfpReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetUserPfp(argument: _SetUserPfpReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetUserPfp(argument: _SetUserPfpReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetUserPfp(argument: _SetUserPfpReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setUserPfp(argument: _SetUserPfpReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setUserPfp(argument: _SetUserPfpReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setUserPfp(argument: _SetUserPfpReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setUserPfp(argument: _SetUserPfpReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  SetUsername(argument: _SetUsernameReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetUsername(argument: _SetUsernameReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetUsername(argument: _SetUsernameReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  SetUsername(argument: _SetUsernameReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setUsername(argument: _SetUsernameReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setUsername(argument: _SetUsernameReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setUsername(argument: _SetUsernameReq, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setUsername(argument: _SetUsernameReq, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
}

export interface ChatHandlers extends grpc.UntypedServiceImplementation {
  AddFriend: grpc.handleUnaryCall<_AddFriendReq__Output, _AddFriendRes>;
  
  AddMember: grpc.handleUnaryCall<_AddMemberReq__Output, _google_protobuf_Empty>;
  
  CreateGroup: grpc.handleUnaryCall<_CreateGroupReq__Output, _google_protobuf_Empty>;
  
  GetContacts: grpc.handleUnaryCall<_GetContactsReq__Output, _GetContactsRes>;
  
  GetMessages: grpc.handleUnaryCall<_GetMessagesReq__Output, _GetMessagesRes>;
  
  GetUserById: grpc.handleUnaryCall<_GetUserByIdReq__Output, _User>;
  
  GetUserByUsername: grpc.handleUnaryCall<_GetUserByUsernameReq__Output, _User>;
  
  SendMessage: grpc.handleUnaryCall<_SendMessageReq__Output, _SendMessageRes>;
  
  SetGroupPfp: grpc.handleUnaryCall<_SetGroupPfpReq__Output, _google_protobuf_Empty>;
  
  SetUserPfp: grpc.handleUnaryCall<_SetUserPfpReq__Output, _google_protobuf_Empty>;
  
  SetUsername: grpc.handleUnaryCall<_SetUsernameReq__Output, _google_protobuf_Empty>;
  
}

export interface ChatDefinition extends grpc.ServiceDefinition {
  AddFriend: MethodDefinition<_AddFriendReq, _AddFriendRes, _AddFriendReq__Output, _AddFriendRes__Output>
  AddMember: MethodDefinition<_AddMemberReq, _google_protobuf_Empty, _AddMemberReq__Output, _google_protobuf_Empty__Output>
  CreateGroup: MethodDefinition<_CreateGroupReq, _google_protobuf_Empty, _CreateGroupReq__Output, _google_protobuf_Empty__Output>
  GetContacts: MethodDefinition<_GetContactsReq, _GetContactsRes, _GetContactsReq__Output, _GetContactsRes__Output>
  GetMessages: MethodDefinition<_GetMessagesReq, _GetMessagesRes, _GetMessagesReq__Output, _GetMessagesRes__Output>
  GetUserById: MethodDefinition<_GetUserByIdReq, _User, _GetUserByIdReq__Output, _User__Output>
  GetUserByUsername: MethodDefinition<_GetUserByUsernameReq, _User, _GetUserByUsernameReq__Output, _User__Output>
  SendMessage: MethodDefinition<_SendMessageReq, _SendMessageRes, _SendMessageReq__Output, _SendMessageRes__Output>
  SetGroupPfp: MethodDefinition<_SetGroupPfpReq, _google_protobuf_Empty, _SetGroupPfpReq__Output, _google_protobuf_Empty__Output>
  SetUserPfp: MethodDefinition<_SetUserPfpReq, _google_protobuf_Empty, _SetUserPfpReq__Output, _google_protobuf_Empty__Output>
  SetUsername: MethodDefinition<_SetUsernameReq, _google_protobuf_Empty, _SetUsernameReq__Output, _google_protobuf_Empty__Output>
}

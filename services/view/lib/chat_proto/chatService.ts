import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ChatClient as _ChatClient, ChatDefinition as _ChatDefinition } from './Chat';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  AddFriendReq: MessageTypeDefinition
  AddFriendRes: MessageTypeDefinition
  AddMembersReq: MessageTypeDefinition
  Chat: SubtypeConstructor<typeof grpc.Client, _ChatClient> & { service: _ChatDefinition }
  Contact: MessageTypeDefinition
  CreateGroupReq: MessageTypeDefinition
  CreateGroupRes: MessageTypeDefinition
  GetContactsReq: MessageTypeDefinition
  GetContactsRes: MessageTypeDefinition
  GetMessagesReq: MessageTypeDefinition
  GetMessagesRes: MessageTypeDefinition
  GetUserByIdReq: MessageTypeDefinition
  GetUserByUsernameReq: MessageTypeDefinition
  Message: MessageTypeDefinition
  SendMessageReq: MessageTypeDefinition
  SendMessageRes: MessageTypeDefinition
  UpdateGroupReq: MessageTypeDefinition
  UpdateUserReq: MessageTypeDefinition
  User: MessageTypeDefinition
  google: {
    protobuf: {
      Empty: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
    }
  }
}


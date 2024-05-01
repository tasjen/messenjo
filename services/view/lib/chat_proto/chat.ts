import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ChatClient as _ChatClient, ChatDefinition as _ChatDefinition } from './Chat';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  AddFriendReq: MessageTypeDefinition
  AddMemberReq: MessageTypeDefinition
  Chat: SubtypeConstructor<typeof grpc.Client, _ChatClient> & { service: _ChatDefinition }
  Contact: MessageTypeDefinition
  CreateGroupReq: MessageTypeDefinition
  CreateUserReq: MessageTypeDefinition
  CreateUserRes: MessageTypeDefinition
  GetByUsernameReq: MessageTypeDefinition
  GetByUsernameRes: MessageTypeDefinition
  GetContactsReq: MessageTypeDefinition
  GetContactsRes: MessageTypeDefinition
  GetMessagesReq: MessageTypeDefinition
  GetMessagesRes: MessageTypeDefinition
  Message: MessageTypeDefinition
  Null: MessageTypeDefinition
  SendMessageReq: MessageTypeDefinition
}


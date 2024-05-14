import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ChatClient as _ChatClient, ChatDefinition as _ChatDefinition } from './Chat';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Chat: SubtypeConstructor<typeof grpc.Client, _ChatClient> & { service: _ChatDefinition }
  GetGroupIdsReq: MessageTypeDefinition
  GetGroupIdsRes: MessageTypeDefinition
}


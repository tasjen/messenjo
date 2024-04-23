import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AuthClient as _AuthClient, AuthDefinition as _AuthDefinition } from './Auth';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Auth: SubtypeConstructor<typeof grpc.Client, _AuthClient> & { service: _AuthDefinition }
  AuthRequest: MessageTypeDefinition
  AuthResponse: MessageTypeDefinition
}


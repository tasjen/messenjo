import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { TokenVerifierClient as _TokenVerifierClient, TokenVerifierDefinition as _TokenVerifierDefinition } from './TokenVerifier';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  AuthRequest: MessageTypeDefinition
  AuthResponse: MessageTypeDefinition
  TokenVerifier: SubtypeConstructor<typeof grpc.Client, _TokenVerifierClient> & { service: _TokenVerifierDefinition }
}


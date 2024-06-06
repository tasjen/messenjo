// Original file: auth_proto/auth.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { VerifyTokenReq as _VerifyTokenReq, VerifyTokenReq__Output as _VerifyTokenReq__Output } from './VerifyTokenReq';
import type { VerifyTokenRes as _VerifyTokenRes, VerifyTokenRes__Output as _VerifyTokenRes__Output } from './VerifyTokenRes';

export interface AuthClient extends grpc.Client {
  VerifyToken(argument: _VerifyTokenReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_VerifyTokenRes__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _VerifyTokenReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_VerifyTokenRes__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _VerifyTokenReq, options: grpc.CallOptions, callback: grpc.requestCallback<_VerifyTokenRes__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _VerifyTokenReq, callback: grpc.requestCallback<_VerifyTokenRes__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _VerifyTokenReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_VerifyTokenRes__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _VerifyTokenReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_VerifyTokenRes__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _VerifyTokenReq, options: grpc.CallOptions, callback: grpc.requestCallback<_VerifyTokenRes__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _VerifyTokenReq, callback: grpc.requestCallback<_VerifyTokenRes__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthHandlers extends grpc.UntypedServiceImplementation {
  VerifyToken: grpc.handleUnaryCall<_VerifyTokenReq__Output, _VerifyTokenRes>;
  
}

export interface AuthDefinition extends grpc.ServiceDefinition {
  VerifyToken: MethodDefinition<_VerifyTokenReq, _VerifyTokenRes, _VerifyTokenReq__Output, _VerifyTokenRes__Output>
}

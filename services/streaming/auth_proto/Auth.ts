// Original file: auth_proto/auth.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AuthRequest as _AuthRequest, AuthRequest__Output as _AuthRequest__Output } from './AuthRequest';
import type { AuthResponse as _AuthResponse, AuthResponse__Output as _AuthResponse__Output } from './AuthResponse';

export interface AuthClient extends grpc.Client {
  VerifyToken(argument: _AuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_AuthResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _AuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_AuthResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _AuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_AuthResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _AuthRequest, callback: grpc.requestCallback<_AuthResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _AuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_AuthResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _AuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_AuthResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _AuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_AuthResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _AuthRequest, callback: grpc.requestCallback<_AuthResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthHandlers extends grpc.UntypedServiceImplementation {
  VerifyToken: grpc.handleUnaryCall<_AuthRequest__Output, _AuthResponse>;
  
}

export interface AuthDefinition extends grpc.ServiceDefinition {
  VerifyToken: MethodDefinition<_AuthRequest, _AuthResponse, _AuthRequest__Output, _AuthResponse__Output>
}

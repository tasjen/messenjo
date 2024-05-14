// Original file: chat_proto/chat.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetGroupIdsReq as _GetGroupIdsReq, GetGroupIdsReq__Output as _GetGroupIdsReq__Output } from './GetGroupIdsReq';
import type { GetGroupIdsRes as _GetGroupIdsRes, GetGroupIdsRes__Output as _GetGroupIdsRes__Output } from './GetGroupIdsRes';

export interface ChatClient extends grpc.Client {
  GetGroupIds(argument: _GetGroupIdsReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetGroupIdsRes__Output>): grpc.ClientUnaryCall;
  GetGroupIds(argument: _GetGroupIdsReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetGroupIdsRes__Output>): grpc.ClientUnaryCall;
  GetGroupIds(argument: _GetGroupIdsReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetGroupIdsRes__Output>): grpc.ClientUnaryCall;
  GetGroupIds(argument: _GetGroupIdsReq, callback: grpc.requestCallback<_GetGroupIdsRes__Output>): grpc.ClientUnaryCall;
  getGroupIds(argument: _GetGroupIdsReq, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetGroupIdsRes__Output>): grpc.ClientUnaryCall;
  getGroupIds(argument: _GetGroupIdsReq, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetGroupIdsRes__Output>): grpc.ClientUnaryCall;
  getGroupIds(argument: _GetGroupIdsReq, options: grpc.CallOptions, callback: grpc.requestCallback<_GetGroupIdsRes__Output>): grpc.ClientUnaryCall;
  getGroupIds(argument: _GetGroupIdsReq, callback: grpc.requestCallback<_GetGroupIdsRes__Output>): grpc.ClientUnaryCall;
  
}

export interface ChatHandlers extends grpc.UntypedServiceImplementation {
  GetGroupIds: grpc.handleUnaryCall<_GetGroupIdsReq__Output, _GetGroupIdsRes>;
  
}

export interface ChatDefinition extends grpc.ServiceDefinition {
  GetGroupIds: MethodDefinition<_GetGroupIdsReq, _GetGroupIdsRes, _GetGroupIdsReq__Output, _GetGroupIdsRes__Output>
}

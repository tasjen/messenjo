// Original file: chat.proto

import type { Long } from '@grpc/proto-loader';

export interface SendMessageReq {
  'userId'?: (Buffer | Uint8Array | string);
  'groupId'?: (Buffer | Uint8Array | string);
  'content'?: (string);
  'sentAt'?: (number | string | Long);
}

export interface SendMessageReq__Output {
  'userId'?: (Uint8Array);
  'groupId'?: (Uint8Array);
  'content'?: (string);
  'sentAt'?: (number);
}

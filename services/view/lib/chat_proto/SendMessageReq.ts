// Original file: chat.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';

export interface SendMessageReq {
  'userId'?: (Buffer | Uint8Array | string);
  'groupId'?: (Buffer | Uint8Array | string);
  'content'?: (string);
  'sentAt'?: (_google_protobuf_Timestamp | null);
}

export interface SendMessageReq__Output {
  'userId'?: (Uint8Array);
  'groupId'?: (Uint8Array);
  'content'?: (string);
  'sentAt'?: (_google_protobuf_Timestamp__Output);
}

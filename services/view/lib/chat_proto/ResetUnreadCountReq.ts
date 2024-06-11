// Original file: lib/chat_proto/chat.proto


export interface ResetUnreadCountReq {
  'userId'?: (Buffer | Uint8Array | string);
  'groupId'?: (Buffer | Uint8Array | string);
}

export interface ResetUnreadCountReq__Output {
  'userId'?: (Uint8Array);
  'groupId'?: (Uint8Array);
}

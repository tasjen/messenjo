// Original file: lib/chat_proto/chat.proto


export interface GetMessagesReq {
  'userId'?: (Buffer | Uint8Array | string);
  'groupId'?: (Buffer | Uint8Array | string);
}

export interface GetMessagesReq__Output {
  'userId'?: (Uint8Array);
  'groupId'?: (Uint8Array);
}

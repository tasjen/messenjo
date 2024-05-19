// Original file: lib/chat_proto/chat.proto


export interface ChangeUsernameReq {
  'userId'?: (Buffer | Uint8Array | string);
  'username'?: (string);
}

export interface ChangeUsernameReq__Output {
  'userId'?: (Uint8Array);
  'username'?: (string);
}

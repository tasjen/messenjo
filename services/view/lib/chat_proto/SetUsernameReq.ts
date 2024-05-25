// Original file: lib/chat_proto/chat.proto


export interface SetUsernameReq {
  'userId'?: (Buffer | Uint8Array | string);
  'username'?: (string);
}

export interface SetUsernameReq__Output {
  'userId'?: (Uint8Array);
  'username'?: (string);
}

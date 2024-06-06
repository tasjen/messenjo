// Original file: lib/chat_proto/chat.proto


export interface UpdateUserReq {
  'userId'?: (Buffer | Uint8Array | string);
  'username'?: (string);
  'pfp'?: (string);
}

export interface UpdateUserReq__Output {
  'userId'?: (Uint8Array);
  'username'?: (string);
  'pfp'?: (string);
}

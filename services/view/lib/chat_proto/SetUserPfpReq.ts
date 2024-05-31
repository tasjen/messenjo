// Original file: lib/chat_proto/chat.proto


export interface SetUserPfpReq {
  'userId'?: (Buffer | Uint8Array | string);
  'pfpUrl'?: (string);
}

export interface SetUserPfpReq__Output {
  'userId'?: (Uint8Array);
  'pfpUrl'?: (string);
}

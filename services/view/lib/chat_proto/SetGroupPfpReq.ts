// Original file: lib/chat_proto/chat.proto


export interface SetGroupPfpReq {
  'groupId'?: (Buffer | Uint8Array | string);
  'pfpUrl'?: (string);
}

export interface SetGroupPfpReq__Output {
  'groupId'?: (Uint8Array);
  'pfpUrl'?: (string);
}

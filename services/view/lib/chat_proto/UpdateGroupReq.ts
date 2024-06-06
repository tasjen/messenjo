// Original file: lib/chat_proto/chat.proto


export interface UpdateGroupReq {
  'groupId'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'pfp'?: (string);
}

export interface UpdateGroupReq__Output {
  'groupId'?: (Uint8Array);
  'name'?: (string);
  'pfp'?: (string);
}

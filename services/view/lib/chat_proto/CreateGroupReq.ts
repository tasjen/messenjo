// Original file: chat.proto


export interface CreateGroupReq {
  'userId'?: (Buffer | Uint8Array | string);
  'groupName'?: (string);
}

export interface CreateGroupReq__Output {
  'userId'?: (Uint8Array);
  'groupName'?: (string);
}

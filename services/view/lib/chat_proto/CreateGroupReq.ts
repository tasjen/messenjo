// Original file: lib/chat_proto/chat.proto


export interface CreateGroupReq {
  'groupName'?: (string);
  'userIds'?: (Buffer | Uint8Array | string)[];
}

export interface CreateGroupReq__Output {
  'groupName'?: (string);
  'userIds'?: (Uint8Array)[];
}

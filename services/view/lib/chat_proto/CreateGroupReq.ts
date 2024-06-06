// Original file: lib/chat_proto/chat.proto


export interface CreateGroupReq {
  'groupName'?: (string);
  'pfp'?: (string);
  'userIds'?: (Buffer | Uint8Array | string)[];
}

export interface CreateGroupReq__Output {
  'groupName'?: (string);
  'pfp'?: (string);
  'userIds'?: (Uint8Array)[];
}

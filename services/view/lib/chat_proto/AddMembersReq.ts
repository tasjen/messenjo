// Original file: lib/chat_proto/chat.proto


export interface AddMembersReq {
  'groupId'?: (Buffer | Uint8Array | string);
  'userIds'?: (Buffer | Uint8Array | string)[];
}

export interface AddMembersReq__Output {
  'groupId'?: (Uint8Array);
  'userIds'?: (Uint8Array)[];
}

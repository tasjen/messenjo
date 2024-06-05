// Original file: lib/chat_proto/chat.proto


export interface CreateGroupReq {
  'groupName'?: (string);
  'pfpUrl'?: (string);
  'userIds'?: (Buffer | Uint8Array | string)[];
}

export interface CreateGroupReq__Output {
  'groupName'?: (string);
  'pfpUrl'?: (string);
  'userIds'?: (Uint8Array)[];
}

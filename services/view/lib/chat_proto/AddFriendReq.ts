// Original file: chat.proto


export interface AddFriendReq {
  'fromUserId'?: (Buffer | Uint8Array | string);
  'toUserId'?: (Buffer | Uint8Array | string);
}

export interface AddFriendReq__Output {
  'fromUserId'?: (Uint8Array);
  'toUserId'?: (Uint8Array);
}

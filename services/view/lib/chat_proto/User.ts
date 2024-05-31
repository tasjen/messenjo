// Original file: lib/chat_proto/chat.proto


export interface User {
  'id'?: (Buffer | Uint8Array | string);
  'username'?: (string);
  'pfp'?: (string);
}

export interface User__Output {
  'id'?: (Uint8Array);
  'username'?: (string);
  'pfp'?: (string);
}

// Original file: lib/chat_proto/chat.proto

import type { Message as _Message, Message__Output as _Message__Output } from './Message';

export interface Contact {
  'type'?: (string);
  'groupId'?: (Buffer | Uint8Array | string);
  'userId'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'pfp'?: (string);
  'memberCount'?: (number);
  'unreadCount'?: (number);
  'lastMessage'?: (_Message | null);
}

export interface Contact__Output {
  'type'?: (string);
  'groupId'?: (Uint8Array);
  'userId'?: (Uint8Array);
  'name'?: (string);
  'pfp'?: (string);
  'memberCount'?: (number);
  'unreadCount'?: (number);
  'lastMessage'?: (_Message__Output);
}

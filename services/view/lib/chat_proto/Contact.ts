// Original file: chat.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';

export interface Contact {
  'type'?: (string);
  'groupId'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'lastMessageId'?: (number);
  'lastContent'?: (string);
  'lastSentAt'?: (_google_protobuf_Timestamp | null);
}

export interface Contact__Output {
  'type'?: (string);
  'groupId'?: (Uint8Array);
  'name'?: (string);
  'lastMessageId'?: (number);
  'lastContent'?: (string);
  'lastSentAt'?: (_google_protobuf_Timestamp__Output);
}

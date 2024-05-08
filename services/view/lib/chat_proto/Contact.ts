// Original file: chat.proto

import type { Long } from '@grpc/proto-loader';

export interface Contact {
  'type'?: (string);
  'groupId'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'lastMessageId'?: (number);
  'lastContent'?: (string);
  'lastSentAt'?: (number | string | Long);
}

export interface Contact__Output {
  'type'?: (string);
  'groupId'?: (Uint8Array);
  'name'?: (string);
  'lastMessageId'?: (number);
  'lastContent'?: (string);
  'lastSentAt'?: (number);
}

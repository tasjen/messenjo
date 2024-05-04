// Original file: chat.proto

import type { Long } from '@grpc/proto-loader';

export interface Contact {
  'type'?: (string);
  'userId'?: (Buffer | Uint8Array | string);
  'groupId'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'lastContent'?: (string);
  'lastSentAt'?: (number | string | Long);
}

export interface Contact__Output {
  'type'?: (string);
  'userId'?: (Uint8Array);
  'groupId'?: (Uint8Array);
  'name'?: (string);
  'lastContent'?: (string);
  'lastSentAt'?: (number);
}

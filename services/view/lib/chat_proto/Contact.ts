// Original file: chat.proto

import type { Long } from '@grpc/proto-loader';

export interface Contact {
  'groupId'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'lastContent'?: (string);
  'lastSentAt'?: (number | string | Long);
}

export interface Contact__Output {
  'groupId'?: (Uint8Array);
  'name'?: (string);
  'lastContent'?: (string);
  'lastSentAt'?: (number);
}

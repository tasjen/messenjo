// Original file: chat.proto

import type { Long } from '@grpc/proto-loader';

export interface Message {
  'id'?: (number);
  'content'?: (string);
  'sentAt'?: (number | string | Long);
}

export interface Message__Output {
  'id'?: (number);
  'content'?: (string);
  'sentAt'?: (number);
}

// Original file: null

// import type { Long } from '@grpc/proto-loader';
import Long from "long";

export interface Timestamp {
  'seconds'?: (number | string | Long);
  'nanos'?: (number);
}

export interface Timestamp__Output {
  'seconds'?: (Long);
  'nanos'?: (number);
}

import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logger } from "./logger";
import { Timestamp } from "@bufbuild/protobuf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toDateMs(timestamp?: Timestamp): number {
  if (!timestamp) return 0;
  return Number(timestamp.seconds ?? 0) * 1e3 + (timestamp.nanos ?? 0) / 1e6;
}

export function toHandledError(err: unknown): Error {
  if (err instanceof Error) {
    logger.error(err.message);
    return new Error(`internal server error`);
  }
  logger.error(`unknown error:`, err);
  return new Error("unknown server error");
}

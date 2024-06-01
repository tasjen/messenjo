import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toDateMs(timestamp: {
  seconds: number;
  nanos: number;
}): number {
  return timestamp.seconds * 1e3 + timestamp.nanos / 1e6;
}

export function uuidFormat(uuid: string): string {
  let result = "";
  for (let i = 0; i < uuid.length; i++) {
    result += uuid[i];
    if ([7, 11, 15, 19].includes(i)) result += "-";
  }
  return result;
}

export function uuidParse(uuid: string): Uint8Array {
  if (
    !/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(uuid)
  ) {
    throw new Error(`Invalid UUID string format: ${uuid}`);
  }

  uuid = uuid.replaceAll("-", "");

  const uuidBytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    const hexPair = uuid.slice(i * 2, i * 2 + 2);
    uuidBytes[i] = parseInt(hexPair, 16);
  }

  return uuidBytes;
}

export function uuidStringify(bytes: Buffer | Uint8Array | string): string {
  if (bytes instanceof Buffer) {
    return uuidFormat(bytes.toString("hex"));
  }
  if (bytes.length !== 16) {
    throw new Error("Invalid Uint8Array size (should be 16)");
  }

  let uuidString = "";
  for (let i = 0; i < bytes.length; i++) {
    uuidString += bytes[i].toString(16).padStart(2, "0");
    if ([3, 5, 7, 9].includes(i)) {
      uuidString += "-";
    }
  }
  return uuidString;
}

export function newDeadline(durationInSec: number) {
  const deadline = new Date();
  return deadline.setSeconds(deadline.getSeconds() + durationInSec);
}

export function toDateFormat(unixMilli: number): {
  date: string;
  time: string;
} {
  const date = new Date(unixMilli);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return { date: `${day}/${month}`, time: `${hours}:${minutes}` };
}

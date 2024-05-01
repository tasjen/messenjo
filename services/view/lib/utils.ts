import { type ClassValue, clsx } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function session(headers: ReadonlyHeaders): Uint8Array {
  const userIdS = headers.get("userId");
  if (!userIdS) redirect("/login");
  return new Uint8Array(userIdS.split(",").map((e) => Number(e)));
}

export function toUuidFormat(uuid: string): string {
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

export function toDateFormat(unixMilli: number): [string, string] {
  const date = new Date(unixMilli);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return [`${day}/${month}`, `${hours}:${minutes}`];
}

export function newDeadline(durationInSec: number) {
  const deadline = new Date();
  return deadline.setSeconds(deadline.getSeconds() + durationInSec);
}

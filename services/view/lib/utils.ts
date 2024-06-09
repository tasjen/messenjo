import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toDateMs(timestamp: {
  seconds?: number;
  nanos?: number;
}): number {
  return (timestamp.seconds ?? 0) * 1e3 + (timestamp.nanos ?? 0) / 1e6;
}

export function newDeadline(durationInSec: number): number {
  const deadline = new Date();
  return deadline.setSeconds(deadline.getSeconds() + durationInSec);
}

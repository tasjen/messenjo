import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

interface Long {
  toNumber: () => number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toDateMs({
  seconds,
  nanos,
}: {
  seconds?: Long | number;
  nanos?: number;
}): number {
  if (!z.number().safeParse(seconds).success) {
    seconds = (seconds as Long).toNumber();
  }
  return ((seconds as number) ?? 0) * 1e3 + (nanos ?? 0) / 1e6;
}

export function newDeadline(durationInSec: number): number {
  const deadline = new Date();
  return deadline.setSeconds(deadline.getSeconds() + durationInSec);
}

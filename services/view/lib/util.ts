import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logger } from "./logger";
import { toast } from "sonner";
import { Code, ConnectError } from "@connectrpc/connect";
import { redirect } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleNodeError(err: unknown): void {
  if (err instanceof ConnectError) {
    switch (err.code) {
      case Code["Unauthenticated"]:
        redirect("/login");
      case Code["Internal"]:
        redirect("/error");
      default:
        logger.error(err.message);
    }
  } else if (err instanceof Error) {
    logger.error(err.message);
  } else {
    logger.error(`unknown error:`, err);
  }
}

export function handleWebError(err: unknown): void {
  if (err instanceof ConnectError) {
    switch (err.code) {
      case Code["Unauthenticated"]:
        window.location.href = "/login";
        return;
      default:
        toast(err.message);
    }
  } else if (err instanceof Error) {
    toast(err.message);
  } else {
    toast(`unknown error: ` + err);
  }
}

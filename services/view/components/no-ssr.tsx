"use client";

import { useStore } from "@/lib/store/client";
import { ReactNode } from "react";

type Props = {
  fallback?: ReactNode;
  children: ReactNode;
};

export default function NoSSR({ fallback, children }: Props) {
  const { isClient } = useStore((s) => s);

  return isClient ? children : fallback;
}

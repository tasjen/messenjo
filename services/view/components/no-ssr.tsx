"use client";

import { useStore } from "@/lib/stores/client-store";
import { ReactNode } from "react";

type Props = {
  fallback?: ReactNode;
  children: ReactNode;
};

export default function NoSSR({ fallback, children }: Props) {
  const { isClient } = useStore();

  return isClient ? children : fallback;
}

"use client";

import { useStore } from "@/lib/stores/client-store";

export default function Username() {
  const store = useStore();
  return <div>{store.user.username}</div>;
}

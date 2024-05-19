"use client";

import { useClientStore } from "@/lib/stores/client-store";

export default function Username() {
  const store = useClientStore();
  return <div>{store.user.username}</div>;
}

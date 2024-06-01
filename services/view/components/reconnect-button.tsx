"use client";

import { useStore } from "@/lib/stores/client-store";
import { Button } from "@/components/ui/button";

export default function ReconnectButton() {
  const { isWsDisconnected } = useStore();

  if (isWsDisconnected) {
    return (
      <div className="flex flex-col items-center">
        <div>{"You're disconnected"}</div>
        <Button onClick={() => window.location.reload()}>Reconnect</Button>
      </div>
    );
  }
  return <></>;
}

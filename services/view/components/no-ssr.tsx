"use client";

import { ReactNode, useEffect, useState } from "react";

export default function NoSSR({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient && children;
}

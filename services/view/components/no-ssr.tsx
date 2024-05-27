"use client";

import { ReactNode, useEffect, useState } from "react";

type Props = {
  fallback?: ReactNode;
  children: ReactNode;
};

export default function NoSSR({ fallback, children }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : fallback;
}

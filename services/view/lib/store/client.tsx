"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
} from "react";
import { useStore as zustandUseStore } from "zustand";
import { type Store, createStore, initStore } from "./zustand-store";

type StoreApi = ReturnType<typeof createStore>;
const StoreContext = createContext<StoreApi | undefined>(undefined);

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreApi>();
  if (!storeRef.current) {
    storeRef.current = createStore(initStore());
  }

  useEffect(() => {
    storeRef.current?.setState({ isClient: true });
  }, []);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): Store;
export function useStore<T>(selector: (s: Store) => T): T;
export function useStore<T>(selector?: (s: Store) => T): T | Store {
  const storeContext = useContext(StoreContext);

  if (!storeContext) {
    throw new Error(`useStore must be use within StoreProvider`);
  }

  return selector
    ? zustandUseStore(storeContext, selector)
    : zustandUseStore(storeContext, (s) => s);
}

/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
} from "react";
import { useStore as zustandUseStore } from "zustand";

import { type TStore, createStore, initStore } from "./zustand-store";

export type StoreApi = ReturnType<typeof createStore>;

export const StoreContext = createContext<StoreApi | undefined>(undefined);

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreApi>();
  if (!storeRef.current) {
    storeRef.current = createStore(initStore());
  }

  useEffect(() => {
    storeRef.current?.setState((state) => ({ ...state, isClient: true }));
  }, []);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore<T>(selector: (store: TStore) => T): T {
  const storeContext = useContext(StoreContext);

  if (!storeContext) {
    throw new Error(`useStore must be use within StoreProvider`);
  }

  return zustandUseStore(storeContext, selector);
}

import { create } from "zustand";
import { User, Contact } from "../data";

type ServerState = {
  user: User;
  contacts: Contact[];
};

export const serverStore = create<ServerState>(() => ({
  user: {} as User,
  contacts: [],
}));

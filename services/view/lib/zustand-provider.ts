import { create } from "zustand";
import { Contact, User } from "./data";

type State = {
  user: User;
  setUser: (user: User) => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
};

export const useStore = create<State>((set) => ({
  user: {} as User,
  setUser: (user) => set(() => ({ user })),
  contacts: [],
  setContacts: (contacts) => set(() => ({ contacts })),
}));

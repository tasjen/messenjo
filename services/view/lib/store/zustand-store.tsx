import { createStore as zustandCreateStore } from "zustand/vanilla";
import { Contact, GroupContact, Message, User } from "../schema";
import { MESSAGES_BATCH_SIZE } from "../config";

type State = {
  user: User;
  contacts: Contact[];
  currentContact: Contact | undefined;
  isWsDisconnected: boolean;
  isClient: boolean;
};

type Action = {
  setUser: (user: User) => void;
  setGroup: (group: GroupContact) => void;
  loadContacts: (contacts: Contact[]) => void;
  setCurrentContact: (contact: Contact | undefined) => void;
  loadLatestMessages: (groupId: string, messages: Message[]) => void;
  loadOlderMessages: (groupId: string, messages: Message[]) => void;
  addMessage: (groupId: string, message: Message) => void;
  resetUnreadCount: (groupId: string) => void;
  addContact: (contact: Contact) => void;
  removeContact: (groupId: string) => void;
  connectWs: () => void;
  disConnectWs: () => void;
};

export type Store = State & Action;

export const initStore = (): State => {
  return {
    user: {} as User,
    contacts: [],
    currentContact: undefined,
    isWsDisconnected: false,
    isClient: false,
  };
};

export function createStore(initState: State) {
  return zustandCreateStore<Store>()((set) => ({
    ...initState,
    setUser: (user) => set({ user }),
    setGroup: (groupContact) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((c) =>
          c.groupId !== groupContact.groupId ? c : groupContact
        ),
      })),
    loadContacts: (contacts) => set({ contacts }),
    setCurrentContact: (contact) => set({ currentContact: contact }),
    loadLatestMessages: (groupId, messages) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((c) =>
          // only load messages if not already
          c.groupId !== groupId || c.latestMessagesLoaded
            ? c
            : {
                ...c,
                messages,
                latestMessagesLoaded: true,
                allMessagesLoaded: messages.length < MESSAGES_BATCH_SIZE,
              }
        ),
      })),
    loadOlderMessages: (groupId, messages) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((c) =>
          c.groupId !== groupId || c.allMessagesLoaded
            ? c
            : {
                ...c,
                messages: [...c.messages, ...messages],
                allMessagesLoaded: messages.length < MESSAGES_BATCH_SIZE,
              }
        ),
      })),
    addMessage: (groupId, message) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((c) =>
          // only add a message if the message is not already added
          // by checking username and sentAt field since one user cannot (?)
          // send more than one messages with the same sentAt value
          c.groupId !== groupId ||
          c.messages.find(
            (m) =>
              m.fromUsername === message.fromUsername &&
              m.sentAt === message.sentAt
          )
            ? c
            : {
                ...c,
                messages:
                  c.messages.length === 0
                    ? [message]
                    : message.sentAt >= c.messages[0].sentAt
                      ? [message, ...c.messages]
                      : c.messages.toSpliced(1, 0, message),
                unreadCount:
                  message.fromUsername === state.user.username
                    ? 0
                    : c.unreadCount + 1,
              }
        ),
      })),
    resetUnreadCount: (groupId) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((c) =>
          c.groupId !== groupId ? c : { ...c, unreadCount: 0 }
        ),
      })),
    addContact: (contact) =>
      set((state) => ({
        ...state,
        contacts:
          state.contacts.find((c) => c.groupId === contact.groupId) ||
          (contact.type === "friend" && contact.name === state.user.username)
            ? state.contacts
            : [...state.contacts, contact],
      })),
    removeContact: (groupId) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.filter((c) => c.groupId !== groupId),
      })),
    connectWs: () => set({ isWsDisconnected: false }),
    disConnectWs: () => set({ isWsDisconnected: true }),
  }));
}

import { createStore as zustandCreateStore } from "zustand/vanilla";
import { Contact, GroupContact, Message, User } from "../schema";
import { MESSAGES_BATCH_SIZE } from "../config";

type State = {
  user: User;
  contacts: Contact[];
  isWsDisconnected: boolean;
  isClient: boolean;
};

type Action = {
  setUser: (user: User) => void;
  setGroup: (group: GroupContact) => void;
  loadContacts: (contacts: Contact[]) => void;
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
        contacts: state.contacts.map((contact) =>
          contact.groupId !== groupContact.groupId ? contact : groupContact
        ),
      })),
    loadContacts: (contacts) => set({ contacts }),
    loadLatestMessages: (groupId, messages) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((contact) =>
          // only load messages if not already
          contact.groupId !== groupId || contact.latestMessagesLoaded
            ? contact
            : {
                ...contact,
                messages,
                latestMessagesLoaded: true,
                allMessagesLoaded: messages.length < MESSAGES_BATCH_SIZE,
              }
        ),
      })),
    loadOlderMessages: (groupId, messages) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.groupId !== groupId || contact.allMessagesLoaded
            ? contact
            : {
                ...contact,
                messages: [...contact.messages, ...messages],
                allMessagesLoaded: messages.length < MESSAGES_BATCH_SIZE,
              }
        ),
      })),
    addMessage: (groupId, message) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((contact) =>
          // only add a message if the message is not already added
          // by checking username and sentAt field since one user cannot (?)
          // send more than one messages with the same sentAt value
          contact.groupId !== groupId ||
          contact.messages.find(
            (m) =>
              m.fromUsername === message.fromUsername &&
              m.sentAt === message.sentAt
          )
            ? contact
            : {
                ...contact,
                messages:
                  contact.messages.length === 0
                    ? [message]
                    : message.sentAt >= contact.messages[0].sentAt
                      ? [message, ...contact.messages]
                      : contact.messages.toSpliced(1, 0, message),
                unreadCount:
                  message.fromUsername === state.user.username
                    ? 0
                    : contact.unreadCount + 1,
              }
        ),
      })),
    resetUnreadCount: (groupId) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.groupId !== groupId ? contact : { ...contact, unreadCount: 0 }
        ),
      })),
    addContact: (contact) =>
      set((state) => ({
        ...state,
        contacts:
          state.contacts.find(
            (contact) => contact.groupId === contact.groupId
          ) ||
          (contact.type === "friend" && contact.name === state.user.username)
            ? state.contacts
            : [...state.contacts, contact],
      })),
    removeContact: (groupId) =>
      set((state) => ({
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact.groupId !== groupId
        ),
      })),
    connectWs: () => set((state) => ({ ...state, isWsDisconnected: false })),
    disConnectWs: () => set((state) => ({ ...state, isWsDisconnected: true })),
  }));
}

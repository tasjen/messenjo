import { createContext, useContext } from "react";

interface IUserContext {
  user_id: string;
}

const UserContext = createContext<IUserContext | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useTaskFormContext must be used inside the TaskFormContextProvider"
    );
  }
  return context;
}

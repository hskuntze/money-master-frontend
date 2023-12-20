import { createContext } from "react";
import { User } from "types/user";

export type UserContextData = {
  user?: User;
};

export type UserContextType = {
  userContextData: UserContextData;
  setUserContextData: (userContextData: UserContextData) => void;
}

export const UserContext = createContext<UserContextType>({
  userContextData: {},
  setUserContextData: () => null,
});

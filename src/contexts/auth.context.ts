import { User } from "@/api/auth.api";
import { createContext } from "react";

export interface AuthContextProps {
  user: User | null | undefined;
  isLoading: boolean;
  reload: () => void;
  logout: () => void;
}

export const initAuthContextProps: AuthContextProps = {
  user: undefined,
  isLoading: true,
  reload() {},
  logout() {},
};

export const AuthContext = createContext<AuthContextProps>(initAuthContextProps);

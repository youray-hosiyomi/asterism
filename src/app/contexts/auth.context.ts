import { Auth } from "@/common/api/auth.api";
import { createContext } from "react";

interface AuthContextProps {
  auth: Auth | null;
  isLoading: boolean;
  refetch: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  auth: null,
  isLoading: false,
  refetch() {},
});

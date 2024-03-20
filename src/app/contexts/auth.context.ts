import { Auth } from "@/app/api/auth.api";
import { createContext } from "react";

interface AuthContextProps {
  auth: Auth | null;
  userId: string;
  isLoading: boolean;
  refetch: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  auth: null,
  userId: "",
  isLoading: false,
  refetch() {},
});

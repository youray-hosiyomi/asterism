import { FC, ReactNode } from "react";
import { useAuth } from "../hooks/auth.hook";
import { AuthContext } from "../contexts/auth.context";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: auth, isLoading, refetch } = useAuth();
  return <AuthContext.Provider value={{ auth: auth ?? null, isLoading, refetch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

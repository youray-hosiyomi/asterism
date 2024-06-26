"use client";

import { useGetAuthUser, useLogin, useLogout } from "@/api/auth.api";
import { AuthContext } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { data: user, refetch: reload, isLoading } = useGetAuthUser();
  const logout = useLogout();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);
  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          isLoading,
          reload,
          logout() {
            logout.mutateAsync().then(() => {
              router.push("/login");
            });
          },
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;

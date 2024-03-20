import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuth, login, logout } from "@/app/api/auth.api";
import { toast } from "react-toastify";

export const useAuthContext = () => useContext(AuthContext);

const key = "auth";

export const useAuth = () => {
  return useQuery({
    queryKey: [key],
    queryFn: getAuth,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [key],
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [key],
        // exact: true
      });
      toast.success("Login successful");
    },
    onError: () => {
      toast.error("Login failure");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [key],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [key],
        // exact: true
      });
      toast.success("Logout successful");
    },
    onError: () => {
      toast.error("Logout successful");
      //
    },
  });
};

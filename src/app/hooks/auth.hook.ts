import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuth, login, logout } from "@/common/api/auth.api";
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
      toast.success("ログイン成功");
    },
    onError: () => {
      toast.error("ログイン失敗");
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
      toast.success("ログアウト成功");
    },
    onError: () => {
      toast.error("ログアウト失敗");
      //
    },
  });
};

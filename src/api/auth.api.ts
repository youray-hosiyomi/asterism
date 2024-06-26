/* eslint-disable react-hooks/rules-of-hooks */
import { apiServer, client } from "@/utils/client.util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextRequest } from "next/server";

const authKey = "auth";

export const csrf = async () => client.get("/sanctum/csrf-cookie");

export type User = {
  name: string;
  email: string;
};

export const getAuthUser = async (): Promise<User | null> => {
  await csrf();
  try {
    const { data } = await client.get("/api/user");
    return data;
  } catch (err) {
    err;
    return null;
  }
};

export const useGetAuthUser = () => {
  return useQuery({
    queryKey: [authKey],
    queryFn: getAuthUser,
  });
};

export const getAuthUserOnServer = async (req: NextRequest): Promise<User | null> => {
  const headers = {
    Cookie: req.headers.get("cookie") ?? "",
    referer: req.headers.get("referer") ?? req.headers.get("host") ?? "", // 初期ロードの際にrefererを参照しないため、hostから持ってくる
    "X-Xsrf-Token": req.headers.get("X-Xsrf-Token") ?? "",
  };
  await csrf();
  try {
    const { data } = await apiServer.get("/api/user", {
      headers,
    });
    return data;
  } catch (err: any) {
    err;
    return null;
  }
};

export type LoginReq = {
  email: string;
  password: string;
};

export const login = async (req: LoginReq): Promise<User> => {
  await csrf();
  const { data } = await client.post<User>("/login", req);
  return data;
};

export const useLogin = () => useMutation({ mutationFn: login, mutationKey: [authKey] });

export const logout = async (): Promise<void> => {
  await client.post("/logout");
};

export const useLogout = () => useMutation({ mutationFn: logout, mutationKey: [authKey] });

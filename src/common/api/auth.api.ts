import { Session, SignInWithPasswordCredentials, User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase.util";

export type LoginReq = SignInWithPasswordCredentials;
export const login = async (req: LoginReq) => {
  const { data, error } = await supabase.auth.signInWithPassword(req);
  if (error) {
    throw error;
  }
  return data;
};

export const logout = async () => {
  const res = await supabase.auth.signOut();
  if (res.error) {
    throw res.error;
  }
};

export type Auth = {
  session: Session;
  user: User;
};
export const getAuth = async (): Promise<Auth | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  if (!session) return null;
  return {
    session,
    user: session.user,
  };
};

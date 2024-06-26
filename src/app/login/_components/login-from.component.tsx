"use client";

import { LoginReq, useLogin } from "@/api/auth.api";
import { FC, FormEvent, useCallback, useState } from "react";
import { KeyIcon, MailIcon } from "lucide-react";
import AppTitle from "@/components/app-title.component";
import { useRouter } from "next/navigation";
import { UILoading } from "@youray-hosiyomi/asterism-ui-react";

const LoginForm: FC = () => {
  const router = useRouter();
  const [req, setReq] = useState<LoginReq>({ email: "", password: "" });
  const login = useLogin();
  const handleLogin = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      login.mutate(req, {
        onSuccess: () => {
          router.refresh();
        },
      });
    },
    [login, req, router],
  );
  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 pb-48 pt-6 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <AppTitle className="select-none text-3xl font-semibold" />
          <div className="mt-7">
            <div>
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="label">
                    <div color="blue-gray" className="label-text">
                      メールアドレス
                    </div>
                  </label>
                  <div className="mt-2">
                    <label className="input input-bordered w-full flex items-center gap-2">
                      <MailIcon className="w-4 h-4 opacity-70" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="grow"
                        placeholder="メールアドレス"
                        value={req.email}
                        onChange={(e) =>
                          setReq((prev) => {
                            return {
                              ...prev,
                              email: e.target.value,
                            };
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="label">
                    <div color="blue-gray" className="label-text">
                      パスワード
                    </div>
                  </label>
                  <div className="mt-2">
                    <label className="input input-bordered w-full flex items-center gap-2">
                      <KeyIcon className="w-4 h-4 opacity-70" />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="grow"
                        placeholder="パスワード"
                        autoComplete="current-password"
                        value={req.password}
                        onChange={(e) =>
                          setReq((prev) => {
                            return {
                              ...prev,
                              password: e.target.value,
                            };
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn btn-primary w-full" disabled={login.isPending}>
                    ログイン
                    {login.isPending && <UILoading />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

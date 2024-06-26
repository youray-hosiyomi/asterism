import { useAuth } from "@/hooks/auth.hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@youray-hosiyomi/asterism-ui-react";
import { FC } from "react";

export interface AuthUserBtnProps {}

export const AuthUserBtn: FC<AuthUserBtnProps> = ({}) => {
  const { user, logout } = useAuth();
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className="btn btn-outline btn-sm">{user?.name}</button>
        </PopoverTrigger>
        <PopoverContent className="w-80 !z-[100]">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              logout();
            }}
          >
            ログアウト
          </button>
        </PopoverContent>
      </Popover>
    </>
  );
};

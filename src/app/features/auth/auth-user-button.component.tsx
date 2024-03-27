import { useLogout } from "@/app/hooks/auth.hook";
import { Auth } from "@/app/api/auth.api";
import { FC } from "react";

interface AuthUserButtonProps {
  auth: Auth;
}

const AuthUserButton: FC<AuthUserButtonProps> = ({ auth }) => {
  auth;
  const logout = useLogout();
  return (
    <>
      <button
        className="btn btn-sm"
        onClick={() => {
          logout.mutateAsync();
        }}
      >
        Logout
      </button>
    </>
  );
};

export default AuthUserButton;

import { FC } from "react";
import LoginForm from "./_components/login-from.component";

const LoginPage: FC = () => {
  return (
    <main className="h-dvh animate-fadein">
      <div className="flex min-h-full justify-center">
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;

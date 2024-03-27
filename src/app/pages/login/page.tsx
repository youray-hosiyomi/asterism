import LoginForm from "@/app/features/auth/login-form.component";
import { GuestPageFC } from "@/common/type/page.type";

const Login_Page: GuestPageFC = () => {
  return (
    <main className="h-dvh animate-fadein">
      <div className="flex min-h-full justify-center">
        <LoginForm />
      </div>
    </main>
  );
};

export default Login_Page;

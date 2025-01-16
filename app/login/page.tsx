import { AuthForm } from "../components/auth/auth-form";

export const metadata = {
  title: "Login | Mozzy",
  description: "Login to your Mozzy account",
};

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}

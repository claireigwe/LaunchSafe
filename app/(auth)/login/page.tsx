import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form/login-form";

export const metadata: Metadata = {
  title: "Sign In | LaunchSafe",
};

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}

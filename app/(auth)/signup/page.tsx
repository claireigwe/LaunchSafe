import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/signup-form/signup-form";

export const metadata: Metadata = {
  title: "Create Account | LaunchSafe",
};

export default function SignupPage() {
  return (
    <main>
      <SignupForm />
    </main>
  );
}

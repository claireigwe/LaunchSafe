import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | LaunchSafe",
};

export default function ForgotPasswordPage() {
  return (
    <main>
      <ForgotPasswordForm />
    </main>
  );
}

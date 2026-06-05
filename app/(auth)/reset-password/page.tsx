import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | LaunchSafe",
};

export default function ResetPasswordPage() {
  return (
    <main>
      <ResetPasswordForm />
    </main>
  );
}

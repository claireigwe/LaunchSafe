"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import styles from "./reset-password-form.module.css";
import Link from "next/link";

export function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Assuming the user arrived here with a valid recovery link containing an access_token 
    // or code in the URL fragment which Supabase auth client automatically picks up.
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Update password</h1>
        <p className={styles.subtitle}>Enter your new password below.</p>
      </div>

      {success ? (
        <div className={styles.successState}>
          <p className={styles.successMessage}>
            Your password has been successfully updated.
          </p>
          <Button fullWidth onClick={() => router.push("/login")}>
            Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>New Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Update Password
          </Button>
        </form>
      )}

      {!success && (
        <p className={styles.footerText}>
          Remembered your password? <Link href="/login" className={styles.link}>Sign in</Link>
        </p>
      )}
    </div>
  );
}

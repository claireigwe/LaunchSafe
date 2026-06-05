"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import styles from "./forgot-password-form.module.css";
import Link from "next/link";

export function ForgotPasswordForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reset your password</h1>
        <p className={styles.subtitle}>Enter your email to receive a reset link.</p>
      </div>

      {success ? (
        <div className={styles.successState}>
          <p className={styles.successMessage}>
            Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
          </p>
          <Button fullWidth onClick={() => setSuccess(false)} variant="outline">
            Try again
          </Button>
          <p className={styles.footerText}>
            <Link href="/login" className={styles.link}>Return to sign in</Link>
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="you@company.com"
              />
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>

          <p className={styles.footerText}>
            Remember your password? <Link href="/login" className={styles.link}>Sign in</Link>
          </p>
        </>
      )}
    </div>
  );
}

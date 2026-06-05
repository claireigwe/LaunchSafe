"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import styles from "./signup-form.module.css";
import Link from "next/link";

export function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("redirect") || "/onboarding"
    : "/onboarding";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback?next=${redirectTo}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      router.push(redirectTo);
      router.refresh();
    } else {
      setError("Please check your email to verify your account.");
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Start discovering compliance requirements today.</p>
      </div>

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

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
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
          Create Account
        </Button>
      </form>

      <p className={styles.footerText}>
        Already have an account? <Link href="/login" className={styles.link}>Sign in</Link>
      </p>
    </div>
  );
}

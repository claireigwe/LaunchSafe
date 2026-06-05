"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { setAccountCreated, saveProfile } from "@/features/settings/api/settings-api";
import styles from "./signup-form.module.css";
import Link from "next/link";

export function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
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
      const isRateLimit = signUpError.status === 429 || /rate\s*limit/i.test(signUpError.message);
      if (isRateLimit) {
        const match = signUpError.message.match(/(\d+)\s*(second|minute|sec)/i);
        if (match) {
          setError(`Too many sign-up attempts. Please try again in ${match[1]} ${match[2]}${match[1] !== "1" ? "s" : ""}.`);
        } else {
          setError("Too many sign-up attempts. Please try again in 5 minutes.");
        }
      } else {
        setError(signUpError.message);
      }
      setIsLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setAccountCreated();
      saveProfile({ fullName: fullName.trim(), email, jobTitle: jobTitle.trim() });
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
          <label htmlFor="fullName" className={styles.label}>Full Name</label>
          <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={styles.input} placeholder="John Doe" autoComplete="name" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobTitle" className={styles.label}>Role <span className={styles.optional}>(optional)</span></label>
          <input id="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={styles.input} placeholder="e.g. Founder, CEO, Compliance Officer" autoComplete="organization-title" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} placeholder="you@company.com" autoComplete="email" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} placeholder="••••••••" minLength={6} autoComplete="new-password" />
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

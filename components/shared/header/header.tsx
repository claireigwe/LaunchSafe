"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const pathname = usePathname();
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            LaunchSafe
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link 
            href="/about" 
            className={`${styles.navLink} ${pathname === "/about" ? styles.navLinkActive : ""}`}
          >
            About
          </Link>
          <Link 
            href="/pricing" 
            className={`${styles.navLink} ${pathname === "/pricing" ? styles.navLinkActive : ""}`}
          >
            Pricing
          </Link>
          <Link 
            href="/faq" 
            className={`${styles.navLink} ${pathname === "/faq" ? styles.navLinkActive : ""}`}
          >
            FAQ
          </Link>
        </nav>

        <div className={styles.actions}>
          {session ? (
            <Link href="/onboarding" tabIndex={-1}>
              <Button variant="primary" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.signInLink}>
                Sign in
              </Link>
              <Link href="/signup" tabIndex={-1}>
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

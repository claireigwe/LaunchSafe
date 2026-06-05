import Link from "next/link";
import { Button } from "@/components/ui/button";
import styles from "./pricing-cta.module.css";

export function PricingCta() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Ready to manage your compliance?</h2>
          <p className={styles.subtitle}>
            Take the first step toward compliance certainty today.
          </p>
          <div className={styles.actions}>
            <Link href="/assessment" tabIndex={-1}>
              <Button size="lg" className={styles.button}>
                Start Free Assessment
              </Button>
            </Link>
            <a href="#autopilot-plans" tabIndex={-1}>
              <Button size="lg" variant="outline" className={styles.button}>
                View Subscription Plans
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

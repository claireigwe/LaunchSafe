import Link from "next/link";
import { Button } from "@/components/ui/button";
import styles from "./cta-section.module.css";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryActionText?: string;
  primaryActionHref?: string;
  secondaryActionText?: string;
  secondaryActionHref?: string;
}

export function CTASection({
  title = "Ready to launch safely?",
  subtitle = "Join hundreds of founders building compliant businesses from day one.",
  primaryActionText = "Start Free Assessment",
  primaryActionHref = "/assessment",
  secondaryActionText = "View Plans",
  secondaryActionHref = "/pricing",
}: CTASectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.actions}>
            <Link href={primaryActionHref} tabIndex={-1}>
              <Button size="lg" className={styles.primaryButton}>
                {primaryActionText}
              </Button>
            </Link>
            <Link href={secondaryActionHref} tabIndex={-1}>
              <Button variant="outline" size="lg" className={styles.secondaryButton}>
                {secondaryActionText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ShieldCheck } from "lucide-react";
import styles from "./about-hero.module.css";

export function AboutHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>Our Mission</span>
          </div>
          <h1 className={styles.title}>
            Helping businesses launch and stay compliant.
          </h1>
          <div className={styles.description}>
            <p>Most founders don't fail because of bad ideas. Many fail because they discover compliance requirements too late.</p>
            <p>LaunchSafe exists to make compliance clear, accessible, and actionable for everyone.</p>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.iconContainer}>
            <ShieldCheck size={80} strokeWidth={1} className={styles.icon} />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Card } from "@/components/ui/card";
import { Search, ListChecks, ShieldAlert, Rocket } from "lucide-react";
import styles from "./feature-section.module.css";

export function FeatureSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Everything you need to launch safely</h2>
          <p className={styles.subtitle}>
            Stop guessing what your business needs. We provide the intelligence to launch and stay compliant.
          </p>
        </div>

        <div className={styles.grid}>
          <Card className={styles.card} padding="lg">
            <div className={styles.iconWrapper}>
              <Search className={styles.icon} size={24} />
            </div>
            <h3 className={styles.cardTitle}>Discover Requirements</h3>
            <p className={styles.cardText}>
              Find out exactly what licenses, permits, and registrations your specific business needs in your jurisdiction before you invest money.
            </p>
          </Card>

          <Card className={styles.card} padding="lg">
            <div className={styles.iconWrapper}>
              <ListChecks className={styles.icon} size={24} />
            </div>
            <h3 className={styles.cardTitle}>Understand Obligations</h3>
            <p className={styles.cardText}>
              Get clear, verifiable estimates of official costs, timelines, and ongoing renewal requirements without the legal jargon.
            </p>
          </Card>

          <Card className={styles.card} padding="lg">
            <div className={styles.iconWrapper}>
              <ShieldAlert className={styles.icon} size={24} />
            </div>
            <h3 className={styles.cardTitle}>Reduce Risk</h3>
            <p className={styles.cardText}>
              Identify potential compliance roadblocks and risks early. Don't lose money to surprise fines or delays.
            </p>
          </Card>

          <Card className={styles.card} padding="lg">
            <div className={styles.iconWrapper}>
              <Rocket className={styles.icon} size={24} />
            </div>
            <h3 className={styles.cardTitle}>Launch & Monitor</h3>
            <p className={styles.cardText}>
              Generate required application letters and checklists, and track your compliance tasks on autopilot after you launch.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

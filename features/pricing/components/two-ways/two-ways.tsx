import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./two-ways.module.css";

export function TwoWays() {
  const explorerFeatures = [
    "Free Compliance Assessment",
    "Compliance Summary",
    "Requirement Discovery",
    "Agency Identification",
    "Compliance Complexity Score"
  ];

  const explorerUnlocks = [
    "Full Compliance Report",
    "Requirement Breakdown",
    "Cost Analysis",
    "Risk Analysis",
    "Launch Roadmap",
    "Compliance Timeline"
  ];

  const autopilotFeatures = [
    "Compliance Dashboard",
    "Compliance Tracking",
    "Compliance Calendar",
    "Regulatory Updates",
    "Deadline Monitoring",
    "Notifications",
    "Evidence Management",
    "Document Generation"
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Card 1 */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <span className={styles.badge}>One-Time Purchase</span>
            </div>
            <h3 className={styles.cardTitle}>Pre-Launch Compliance Explorer</h3>
            <p className={styles.cardDescription}>
              For founders and entrepreneurs evaluating a new business.
            </p>
            
            <div className={styles.featureGroup}>
              <h4 className={styles.groupTitle}>Includes:</h4>
              <ul className={styles.list}>
                {explorerFeatures.map((f, i) => (
                  <li key={i}><Check size={16} className={styles.checkIcon} /> {f}</li>
                ))}
              </ul>
            </div>

            <div className={styles.unlockGroup}>
              <div className={styles.priceHeader}>
                <span className={styles.priceLabel}>One-Time Report Purchase:</span>
                <span className={styles.priceValue}>₦10,000</span>
              </div>
              <h4 className={styles.groupTitle}>Unlocks:</h4>
              <ul className={styles.list}>
                {explorerUnlocks.map((f, i) => (
                  <li key={i}><Check size={16} className={styles.checkIcon} /> {f}</li>
                ))}
              </ul>
            </div>

            <div className={styles.cardAction}>
              <Link href="/assessment" tabIndex={-1} className={styles.fullWidth}>
                <Button className={styles.fullWidth} size="lg">Start Free Assessment</Button>
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.card}>
            <div className={styles.badgeWrapper}>
              <span className={styles.badgeAutopilot}>Recurring Subscription</span>
            </div>
            <h3 className={styles.cardTitle}>Compliance Autopilot</h3>
            <p className={styles.cardDescription}>
              For businesses that want ongoing compliance management.
            </p>
            
            <div className={styles.featureGroup}>
              <h4 className={styles.groupTitle}>Includes:</h4>
              <ul className={styles.list}>
                {autopilotFeatures.map((f, i) => (
                  <li key={i}><Check size={16} className={styles.checkIcon} /> {f}</li>
                ))}
              </ul>
            </div>

            <div className={`${styles.cardAction} ${styles.pushBottom}`}>
              <a href="#autopilot-plans" tabIndex={-1} className={styles.fullWidth}>
                <Button className={styles.fullWidth} variant="outline" size="lg">Choose a Plan</Button>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

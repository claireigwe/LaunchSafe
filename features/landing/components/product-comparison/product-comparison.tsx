import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import styles from "./product-comparison.module.css";

export function ProductComparisonSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Choose how you want to launch safely</h2>
          <p className={styles.subtitle}>
            Whether you're just exploring an idea or already operating, LaunchSafe has a solution.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Product A: Explorer */}
          <Card className={styles.card} padding="lg">
            <div className={styles.cardHeader}>
              <h3 className={styles.productName}>Pre-Launch Compliance Explorer</h3>
              <p className={styles.productDescription}>
                For founders preparing to launch. Understand what you need and what it costs.
              </p>
              <div className={styles.pricing}>
                <span className={styles.price}>One-time report</span>
              </div>
            </div>
            <div className={styles.cardFeatures}>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Custom Business Assessment
              </div>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Exact Requirement Discovery
              </div>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Cost & Timeline Estimates
              </div>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Risk Analysis
              </div>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Launch Roadmap
              </div>
            </div>
            <div className={styles.cardFooter}>
              <Link href="/assessment" tabIndex={-1}>
                <Button variant="outline" className={styles.button}>Get Your Report</Button>
              </Link>
            </div>
          </Card>

          {/* Product B: Autopilot */}
          <Card className={`${styles.card} ${styles.cardPrimary}`} padding="lg">
            <div className={styles.badge}>Most Popular</div>
            <div className={styles.cardHeader}>
              <h3 className={styles.productName}>Compliance Autopilot</h3>
              <p className={styles.productDescription}>
                For active businesses. Keep your compliance on track without the legal headache.
              </p>
              <div className={styles.pricing}>
                <span className={styles.price}>Monthly subscription</span>
              </div>
            </div>
            <div className={styles.cardFeatures}>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Compliance Dashboard
              </div>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Deadline Tracking & Reminders
              </div>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Regulatory Update Monitoring
              </div>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Secure Evidence Storage
              </div>
              <div className={styles.featureItem}>
                <Check size={16} className={styles.checkIcon} /> Document Generation
              </div>
            </div>
            <div className={styles.cardFooter}>
              <Link href="/pricing" tabIndex={-1}>
                <Button variant="primary" className={styles.button}>View Plans</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

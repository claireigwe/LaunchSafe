import { Building2, Rocket } from "lucide-react";
import styles from "./who-we-serve.module.css";

export function WhoWeServe() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>For every stage of your business.</h2>
          <p className={styles.subtitle}>
            Whether you are just exploring an idea or already operating, LaunchSafe provides the structure you need.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Rocket size={24} className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Pre-Launch Founders</h3>
            <p className={styles.cardDescription}>
              You have an idea, but you don't know the regulatory requirements, costs, or risks.
            </p>
            <ul className={styles.list}>
              <li>Assess viability before investing money</li>
              <li>Discover required permits and licenses</li>
              <li>Estimate startup compliance costs</li>
              <li>Get a clear launch roadmap</li>
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <Building2 size={24} className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Existing Businesses</h3>
            <p className={styles.cardDescription}>
              You are already operating and need to maintain your compliance status without missing deadlines.
            </p>
            <ul className={styles.list}>
              <li>Track ongoing renewals and filings</li>
              <li>Receive automated deadline reminders</li>
              <li>Generate supporting compliance documents</li>
              <li>Maintain a centralized compliance record</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

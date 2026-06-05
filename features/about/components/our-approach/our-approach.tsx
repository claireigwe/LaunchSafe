import { Check, ShieldAlert, Users } from "lucide-react";
import styles from "./our-approach.module.css";

export function OurApproach() {
  const priorities = [
    "Verified information",
    "Transparency",
    "Source attribution",
    "Clear explanations",
    "Practical guidance",
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Compliance intelligence, not guesswork.</h2>
          <p className={styles.subtitle}>
            We prioritize accuracy over assumptions. Our platform is built on transparency and traceability.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.prioritiesCard}>
            <h3 className={styles.cardTitle}>Our Priorities</h3>
            <ul className={styles.priorityList}>
              {priorities.map((p, i) => (
                <li key={i} className={styles.priorityItem}>
                  <Check size={20} className={styles.checkIcon} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.distinctionCard}>
            <h3 className={styles.cardTitle}>Clear Data Distinctions</h3>
            <p className={styles.cardDescription}>
              We clearly distinguish between different types of information so you always know what to trust:
            </p>
            <div className={styles.badges}>
              <div className={styles.badgeItem}>
                <div className={styles.badgeIconWrapper}><Check size={16} /></div>
                <div className={styles.badgeText}>
                  <strong>Official Information</strong>
                  <span>Sourced directly from agencies.</span>
                </div>
              </div>
              <div className={styles.badgeItem}>
                <div className={styles.badgeIconWrapper}><ShieldAlert size={16} /></div>
                <div className={styles.badgeText}>
                  <strong>Estimated Information</strong>
                  <span>Reasonable, data-backed estimates.</span>
                </div>
              </div>
              <div className={styles.badgeItem}>
                <div className={styles.badgeIconWrapper}><Users size={16} /></div>
                <div className={styles.badgeText}>
                  <strong>Community-Reported</strong>
                  <span>Real experiences from other founders.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

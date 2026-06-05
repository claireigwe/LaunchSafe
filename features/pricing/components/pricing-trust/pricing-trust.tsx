import { Shield } from "lucide-react";
import styles from "./pricing-trust.module.css";

export function PricingTrust() {
  const agencies = [
    "Corporate Affairs Commission (CAC)",
    "Federal Inland Revenue Service (FIRS)",
    "State Internal Revenue Services",
    "National Agency for Food and Drug Administration and Control (NAFDAC)",
    "Standards Organisation of Nigeria (SON)",
    "Nigeria Data Protection Commission (NDPC)"
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Shield className={styles.icon} size={48} />
          <h2 className={styles.title}>Regulatory intelligence you can trust</h2>
          <p className={styles.subtitle}>
            Our compliance engine continuously tracks requirements, deadlines, and fees across major Nigerian regulatory agencies.
          </p>
        </div>

        <div className={styles.agenciesGrid}>
          {agencies.map((agency, index) => (
            <div key={index} className={styles.agencyCard}>
              <span className={styles.agencyName}>{agency}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

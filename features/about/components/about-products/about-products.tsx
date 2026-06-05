import styles from "./about-products.module.css";

export function AboutProducts() {
  const explorerFeatures = [
    "Compliance assessment",
    "Requirement discovery",
    "Agency identification",
    "Cost analysis",
    "Risk analysis",
    "Launch roadmap",
  ];

  const autopilotFeatures = [
    "Compliance dashboard",
    "Deadline tracking",
    "Compliance calendar",
    "Regulatory updates",
    "Notifications",
    "Document generation",
    "Compliance history",
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How LaunchSafe Works</h2>
          <p className={styles.subtitle}>
            Two core products designed to support you at every stage of your business journey.
          </p>
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Pre-Launch Compliance Explorer</h3>
              <p className={styles.cardDescription}>
                Discover compliance requirements before investing significant time or money into a business.
              </p>
            </div>
            <ul className={styles.featureList}>
              {explorerFeatures.map((f, i) => (
                <li key={i} className={styles.featureItem}>
                  <span className={styles.bullet}></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Compliance Autopilot</h3>
              <p className={styles.cardDescription}>
                Stay compliant after launch with ongoing compliance management.
              </p>
            </div>
            <ul className={styles.featureList}>
              {autopilotFeatures.map((f, i) => (
                <li key={i} className={styles.featureItem}>
                  <span className={styles.bullet}></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

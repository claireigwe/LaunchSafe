import styles from "./regulatory-intelligence.module.css";

export function RegulatoryIntelligence() {
  const agencies = [
    { name: "CAC", fullName: "Corporate Affairs Commission" },
    { name: "FIRS", fullName: "Federal Inland Revenue Service" },
    { name: "NAFDAC", fullName: "National Agency for Food and Drug Administration and Control" },
    { name: "SON", fullName: "Standards Organisation of Nigeria" },
    { name: "NDPC", fullName: "Nigeria Data Protection Commission" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Built on verified regulatory knowledge.</h2>
          <p className={styles.subtitle}>
            LaunchSafe is designed to organize and explain regulatory information so businesses can make informed decisions with confidence.
          </p>
        </div>

        <div className={styles.agencyGrid}>
          {agencies.map((agency, i) => (
            <div key={i} className={styles.agencyCard}>
              <div className={styles.agencyAbbr}>{agency.name}</div>
              <div className={styles.agencyFull}>{agency.fullName}</div>
            </div>
          ))}
        </div>

        <div className={styles.disclaimer}>
          * LaunchSafe is an independent compliance intelligence platform and is not officially affiliated with or endorsed by any government agency.
        </div>
      </div>
    </section>
  );
}

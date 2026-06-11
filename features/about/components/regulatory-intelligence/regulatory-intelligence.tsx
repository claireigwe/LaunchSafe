import Image from "next/image";
import styles from "./regulatory-intelligence.module.css";

const AGENCIES = [
  { slug: "cac", name: "CAC", fullName: "Corporate Affairs Commission" },
  { slug: "firs", name: "FIRS", fullName: "Federal Inland Revenue Service" },
  { slug: "nafdac", name: "NAFDAC", fullName: "National Agency for Food and Drug Administration and Control" },
  { slug: "son", name: "SON", fullName: "Standards Organisation of Nigeria" },
  { slug: "ndpc", name: "NDPC", fullName: "Nigeria Data Protection Commission" },
];

export function RegulatoryIntelligence() {
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
          {AGENCIES.map((agency, i) => (
            <div key={i} className={styles.agencyCard}>
              <Image src={`/images/regulators/${agency.slug}.png`} alt={agency.name} width={100} height={40} className={styles.agencyLogo} />
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

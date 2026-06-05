import { CheckCircle2 } from "lucide-react";
import styles from "./why-we-exist.module.css";

export function WhyWeExist() {
  const features = [
    "Clear requirements",
    "Actionable steps",
    "Compliance timelines",
    "Cost visibility",
    "Ongoing compliance management",
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Built to bring clarity to compliance.</h2>
          <p className={styles.description}>
            LaunchSafe was created to help entrepreneurs and businesses make informed decisions before and after launch.
          </p>
          <p className={styles.description}>
            By transforming complex, fragmented regulatory information into structured data, we give you the clarity and confidence to operate safely.
          </p>
        </div>
        <div className={styles.features}>
          <ul className={styles.featureList}>
            {features.map((feature, i) => (
              <li key={i} className={styles.featureItem}>
                <CheckCircle2 size={24} className={styles.checkIcon} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

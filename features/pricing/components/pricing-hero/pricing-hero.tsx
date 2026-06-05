import styles from "./pricing-hero.module.css";

export function PricingHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Simple pricing for smarter compliance decisions.</h1>
          <p className={styles.subtitle}>
            Whether you're exploring a new business idea or managing an existing business, LaunchSafe provides the compliance intelligence you need to move forward with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}

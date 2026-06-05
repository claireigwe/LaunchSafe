import styles from "./faq-hero.module.css";

export function FAQHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Everything you need to know about LaunchSafe, compliance assessments, subscriptions, pricing, and regulatory intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}

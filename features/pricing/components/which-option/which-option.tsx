import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./which-option.module.css";

export function WhichOption() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Which option is right for me?</h2>
          <p className={styles.subtitle}>
            Choose the path that matches your current business stage.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Option 1 */}
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>"I have a business idea, but I haven't launched yet."</h3>
              <p className={styles.cardDescription}>
                You need the <strong>Pre-Launch Compliance Explorer</strong>. This will help you understand if your idea is viable, what permits you need, and how much compliance will cost before you spend money on registration or operations.
              </p>
            </div>
            <Link href="/assessment" className={styles.cardLink}>
              Start Free Assessment <ArrowRight size={16} />
            </Link>
          </div>

          {/* Option 2 */}
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>"I am already running a business and need to stay compliant."</h3>
              <p className={styles.cardDescription}>
                You need <strong>Compliance Autopilot</strong>. We'll set up your compliance dashboard, track your ongoing deadlines, generate necessary documents, and notify you before any renewals are due.
              </p>
            </div>
            <a href="#autopilot-plans" className={styles.cardLink}>
              View Subscription Plans <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

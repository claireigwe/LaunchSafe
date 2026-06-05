import { AlertCircle, ArrowRight } from "lucide-react";
import styles from "./the-problem.module.css";

export function TheProblem() {
  const questions = [
    "What registrations do I need?",
    "Which permits apply to me?",
    "Which agencies regulate my business?",
    "How much will compliance cost?",
    "What deadlines must I track?",
    "What happens if I miss a requirement?",
  ];

  const consequences = [
    "Delays",
    "Unexpected costs",
    "Fines",
    "Lost opportunities",
    "Regulatory risk",
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Compliance shouldn't be a guessing game.</h2>
          <p className={styles.subtitle}>
            Many business owners struggle to answer critical questions about their regulatory obligations.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.questionsCard}>
            <h3 className={styles.cardTitle}>The Questions</h3>
            <ul className={styles.questionList}>
              {questions.map((q, i) => (
                <li key={i} className={styles.questionItem}>
                  <span className={styles.bullet}></span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.consequencesCard}>
            <div className={styles.cardHeader}>
              <AlertCircle className={styles.alertIcon} />
              <h3 className={styles.cardTitle}>The Consequences</h3>
            </div>
            <ul className={styles.consequenceList}>
              {consequences.map((c, i) => (
                <li key={i} className={styles.consequenceItem}>
                  <ArrowRight size={16} className={styles.arrowIcon} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowDown } from "lucide-react";
import styles from "./assessment-flow.module.css";

export function AssessmentFlow() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How the assessment works</h2>
          <p className={styles.subtitle}>
            A simple, transparent process to get your compliance roadmap.
          </p>
        </div>

        <div className={styles.flowContainer}>
          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Start Assessment</h3>
            </div>
            <p className={styles.stepDescription}>
              Answer a few questions about your intended business.
            </p>
          </div>

          <div className={styles.arrowWrapper}>
            <ArrowDown className={styles.arrow} size={24} />
          </div>

          <div className={styles.step}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumberSecondary}>2</div>
              <h3 className={styles.stepTitleSecondary}>Receive Free Summary</h3>
            </div>
            <div className={styles.stepBox}>
              <h4 className={styles.boxTitle}>View:</h4>
              <ul className={styles.list}>
                <li>Requirement Count</li>
                <li>Agency Count</li>
                <li>Compliance Categories</li>
                <li>Compliance Complexity Score</li>
              </ul>
            </div>
          </div>

          <div className={styles.arrowWrapper}>
            <ArrowDown className={styles.arrow} size={24} />
          </div>

          <div className={styles.stepHighlight}>
            <div className={styles.stepHeaderHighlight}>
              <div className={styles.stepNumberHighlight}>3</div>
              <h3 className={styles.stepTitleHighlight}>Purchase Full Report (₦10,000)</h3>
            </div>
            <div className={styles.stepBoxHighlight}>
              <h4 className={styles.boxTitleHighlight}>Unlock:</h4>
              <ul className={styles.listHighlight}>
                <li>Full Compliance Report</li>
                <li>Cost Analysis</li>
                <li>Risk Analysis</li>
                <li>Launch Roadmap</li>
                <li>Compliance Timeline</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

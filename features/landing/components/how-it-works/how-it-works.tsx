import { CheckCircle2 } from "lucide-react";
import styles from "./how-it-works.module.css";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Assess",
      description: "Complete a profile to discover your exact compliance requirements, costs, and risks.",
    },
    {
      title: "Prepare",
      description: "Unlock your full report and launch roadmap to navigate regulatory hurdles.",
    },
    {
      title: "Automate",
      description: "Stay compliant post-launch with deadline tracking, notifications, and document generation.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>How LaunchSafe works</h2>
          <p className={styles.subtitle}>
            A streamlined process to guide you from idea to compliant operation.
          </p>

          <div className={styles.steps}>
            {steps.map((step, index) => (
              <div key={index} className={styles.step}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualCard}>
            <div className={styles.visualHeader}>
              <div className={styles.visualDot} />
              <div className={styles.visualDot} />
              <div className={styles.visualDot} />
            </div>
            <div className={styles.visualBody}>
              <div className={styles.mockItem}>
                <CheckCircle2 className={styles.mockIcon} size={24} />
                <div className={styles.mockLines}>
                  <div className={styles.mockLine} style={{ width: '80%' }} />
                  <div className={styles.mockLine} style={{ width: '60%' }} />
                </div>
              </div>
              <div className={styles.mockItem}>
                <CheckCircle2 className={styles.mockIcon} size={24} />
                <div className={styles.mockLines}>
                  <div className={styles.mockLine} style={{ width: '90%' }} />
                  <div className={styles.mockLine} style={{ width: '40%' }} />
                </div>
              </div>
              <div className={styles.mockItem}>
                <CheckCircle2 className={styles.mockIcon} size={24} />
                <div className={styles.mockLines}>
                  <div className={styles.mockLine} style={{ width: '70%' }} />
                  <div className={styles.mockLine} style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

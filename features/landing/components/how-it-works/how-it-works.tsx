import Image from "next/image";
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
          <div className={styles.imageContainer}>
            <Image
              src="/images/landing/how-it-works-report.png"
              alt="LaunchSafe Assessment Dashboard"
              width={600}
              height={400}
              className={styles.dashboardImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

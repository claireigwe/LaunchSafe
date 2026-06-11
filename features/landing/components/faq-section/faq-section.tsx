import { Plus } from "lucide-react";
import styles from "./faq-section.module.css";

export function FAQSection() {
  const faqs = [
    {
      question: "Do I need to pay to see my assessment?",
      answer: "You can see an assessment summary for free. The detailed report with exact costs and a launch roadmap requires a one-time purchase."
    },
    {
      question: "Is the compliance data accurate?",
      answer: "Yes, all our requirements are verified directly from official regulatory sources like CAC, FIRS, and NAFDAC."
    },
    {
      question: "What happens after I launch?",
      answer: "You can upgrade to our Compliance Autopilot subscription to track renewals, manage evidence, and get notified about regulatory changes."
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Common compliance questions</h2>
          <p className={styles.subtitle}>
            Everything you need to know about navigating regulatory requirements with LaunchSafe.
          </p>
        </div>

        <div className={styles.list}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.questionWrapper}>
                <h3 className={styles.question}>{faq.question}</h3>
                <Plus className={styles.icon} size={24} />
              </div>
              <p className={styles.answer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

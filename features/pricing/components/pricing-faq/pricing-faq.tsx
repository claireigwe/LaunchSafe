"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./pricing-faq.module.css";

const faqs = [
  {
    question: "Does the assessment purchase include a subscription?",
    answer: "No. The Pre-Launch Compliance Explorer is a one-time purchase. It provides a comprehensive report of everything you need to know before launching your business, with no recurring fees."
  },
  {
    question: "Can I upgrade to Compliance Autopilot later?",
    answer: "Yes. You can transition an assessed idea into a tracked business at any time. Once you launch, you can subscribe to Compliance Autopilot to manage your ongoing compliance obligations."
  },
  {
    question: "How does the free assessment work?",
    answer: "You answer questions about your intended business, and we show you a high-level summary of your requirements, including the number of agencies involved and a compliance complexity score—completely for free. You only pay if you decide to unlock the detailed report containing exact requirements, costs, and timelines."
  },
  {
    question: "Can I use Compliance Autopilot without an assessment?",
    answer: "Yes. If you already have an operating business and just want to manage your ongoing compliance, you can skip the assessment and sign up directly for a Compliance Autopilot subscription."
  },
  {
    question: "How are compliance costs calculated?",
    answer: "Our reports distinguish between verified official fees published by regulatory agencies, estimated costs derived from market research, and community-reported informal charges. We never present estimates as official fees."
  }
];

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Everything you need to know about LaunchSafe pricing.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${openIndex === index ? styles.faqItemOpen : ""}`}
            >
              <button 
                className={styles.faqButton}
                onClick={() => toggleFaq(index)}
                aria-expanded={openIndex === index}
              >
                <span className={styles.question}>{faq.question}</span>
                <ChevronDown 
                  className={`${styles.chevron} ${openIndex === index ? styles.chevronOpen : ""}`} 
                  size={20} 
                />
              </button>
              
              <div className={`${styles.answerWrapper} ${openIndex === index ? styles.answerOpen : ""}`}>
                <div className={styles.answerContent}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

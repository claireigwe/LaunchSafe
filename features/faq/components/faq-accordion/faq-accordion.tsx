"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./faq-accordion.module.css";
import { FAQItem } from "../../data/faq-data";

export function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.accordion} ${isOpen ? styles.open : ""}`}>
      <button 
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className={styles.question}>{item.question}</h3>
        <ChevronDown 
          size={20} 
          className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`} 
        />
      </button>
      
      <div 
        className={styles.content}
        aria-hidden={!isOpen}
      >
        <div className={styles.answerWrapper}>
          {Array.isArray(item.answer) ? (
            item.answer.map((paragraph, i) => (
              <p key={i} className={styles.answerParagraph}>{paragraph}</p>
            ))
          ) : (
            <p className={styles.answerParagraph}>{item.answer}</p>
          )}
        </div>
      </div>
    </div>
  );
}

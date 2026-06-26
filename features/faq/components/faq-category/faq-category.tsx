"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQCategory as CategoryType } from "../../data/faq-data";
import styles from "./faq-category.module.css";

export function FAQCategory({ category }: { category: CategoryType }) {
  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>{category.title}</h2>
      <div className={styles.accordionList}>
        {category.items.map((item, index) => (
          <AccordionItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function AccordionItem({ item }: { item: CategoryType["items"][number] }) {
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
      <div className={styles.content} aria-hidden={!isOpen}>
        <div className={styles.answerWrapper}>
          {Array.isArray(item.answer)
            ? item.answer.map((paragraph, i) => (
                <p key={i} className={styles.answerParagraph}>{paragraph}</p>
              ))
            : <p className={styles.answerParagraph}>{item.answer}</p>}
        </div>
      </div>
    </div>
  );
}

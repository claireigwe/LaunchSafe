import { FAQAccordion } from "../faq-accordion";
import { FAQCategory as CategoryType } from "../../data/faq-data";
import styles from "./faq-category.module.css";

export function FAQCategory({ category }: { category: CategoryType }) {
  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>{category.title}</h2>
      <div className={styles.accordionList}>
        {category.items.map((item, index) => (
          <FAQAccordion key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

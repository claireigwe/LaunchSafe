import clsx from "clsx";
import styles from "./card.module.css";
import { CardProps } from "./card.types";

export function Card({
  children,
  padding = "md",
  elevated = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        styles.card,
        styles[`padding-${padding}`],
        {
          [styles.elevated]: elevated,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

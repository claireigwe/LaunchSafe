import clsx from "clsx";
import styles from "./button.module.css";
import { ButtonProps } from "./button.types";

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const rootClassName = clsx(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.fullWidth]: fullWidth,
      [styles.isLoading]: isLoading,
    },
    className
  );

  return (
    <button className={rootClassName} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className={styles.spinner} /> : null}
      <span className={styles.content}>{children}</span>
    </button>
  );
}

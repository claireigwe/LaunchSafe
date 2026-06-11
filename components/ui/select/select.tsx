"use client";

import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes, ReactNode } from "react";
import styles from "./select.module.css";

interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: (Option | string)[];
  placeholder?: string;
}

function toOption(o: Option | string): Option {
  return typeof o === "string" ? { value: o, label: o } : o;
}

export function Select({ options, placeholder, className, value, ...props }: SelectProps) {
  return (
    <div className={styles.wrapper}>
      <select className={`${styles.select} ${className || ""}`} value={value} {...props}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => {
          const opt = toOption(o);
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
      <ChevronDown size={16} className={styles.chevron} />
    </div>
  );
}

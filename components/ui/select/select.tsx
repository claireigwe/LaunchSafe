"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./select.module.css";

interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  options: (Option | string)[];
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  name?: string;
}

function toOption(o: Option | string): Option {
  return typeof o === "string" ? { value: o, label: o } : o;
}

export function Select({ options, placeholder, value, onChange, disabled, id, className, name }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const all = options.map(toOption);
  const selected = all.find((o) => o.value === value);
  const display = selected?.label || placeholder || "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.wrapper} ${className || ""}`} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => { if (!disabled) setOpen(!open); }}
        disabled={disabled}
        id={id}
        name={name}
      >
        <span className={value ? styles.triggerText : styles.placeholder}>{display}</span>
        <ChevronDown size={16} className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} />
      </button>

      {open && (
        <div className={styles.menu}>
          {all.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.item} ${opt.value === value ? styles.itemActive : ""}`}
              onClick={() => {
                onChange?.({ target: { value: opt.value } } as any);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

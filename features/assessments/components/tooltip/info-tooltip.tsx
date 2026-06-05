"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import styles from "./info-tooltip.module.css";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="More information"
      >
        <Info size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className={styles.tooltip} role="tooltip">
          {text}
        </div>
      )}
    </div>
  );
}

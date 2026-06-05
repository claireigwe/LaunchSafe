"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./processing-profile.module.css";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  { label: "Reviewing business information", duration: 700 },
  { label: "Identifying compliance obligations", duration: 800 },
  { label: "Preparing dashboard setup", duration: 600 },
];

export function ProcessingProfile({ onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((s, i) => {
      const t = setTimeout(() => {
        setCurrentIdx(i);
        setCompleted((prev) => {
          const next = new Set(prev);
          next.add(i);
          if (next.size === STEPS.length) setTimeout(() => cbRef.current(), 400);
          return next;
        });
      }, elapsed);
      timers.push(t);
      elapsed += s.duration;
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const pct = Math.round((completed.size / STEPS.length) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <h2 className={styles.title}>Creating your compliance profile...</h2>
      <p className={styles.subtitle}>Setting up your workspace based on your business information.</p>
      <div className={styles.progressTrack}><div className={styles.progressBar} style={{ width: `${pct}%` }} /></div>
      <div className={styles.list}>
        {STEPS.map((s, i) => (
          <div key={i} className={cn(styles.item, completed.has(i) && styles.done, currentIdx === i && !completed.has(i) && styles.active)}>
            <span className={styles.icon}>
              {completed.has(i) ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="var(--color-role-light-success)" /><path d="M4.5 7L6 8.5L9.5 5" stroke="white" strokeWidth="1.2" strokeLinecap="round" /></svg>
              ) : currentIdx === i ? <span className={styles.pulse} /> : <span className={styles.dot} />}
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

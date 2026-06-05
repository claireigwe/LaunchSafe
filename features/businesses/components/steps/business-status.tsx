"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BusinessStatusData } from "../../types/onboarding.types";
import styles from "./business-status.module.css";

interface Props {
  data: BusinessStatusData;
  onUpdate: (v: Partial<BusinessStatusData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function Bool({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className={styles.boolField}>
      <p className={styles.boolLabel}>{label}</p>
      <div className={styles.boolGroup} role="radiogroup" aria-label={label}>
        <button type="button" className={`${styles.boolBtn} ${value === true ? styles.boolActive : ""}`} onClick={() => onChange(true)} role="radio" aria-checked={value === true}>Yes</button>
        <button type="button" className={`${styles.boolBtn} ${value === false ? styles.boolActive : ""}`} onClick={() => onChange(false)} role="radio" aria-checked={value === false}>No</button>
      </div>
    </div>
  );
}

export function BusinessStatus({ data, onUpdate, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (data.isRegistered === null) e.isRegistered = "Please answer this question";
    if (data.hasCAC === null) e.hasCAC = "Please answer this question";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (validate()) onNext();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>Registration Status</h2>
        <p className={styles.subtitle}>Help us understand your business registration status.</p>
      </div>

      {errors.isRegistered && <p className={styles.error} role="alert">{errors.isRegistered}</p>}
      <Bool label="Is your business registered?" value={data.isRegistered} onChange={(v) => onUpdate({ isRegistered: v })} />

      {errors.hasCAC && <p className={styles.error} role="alert">{errors.hasCAC}</p>}
      <Bool label="Do you have a CAC registration number?" value={data.hasCAC} onChange={(v) => onUpdate({ hasCAC: v })} />

      {data.hasCAC && (
        <div className={styles.field}>
          <label htmlFor="cac" className={styles.label}>CAC Registration Number <span className={styles.optional}>(optional)</span></label>
          <input id="cac" className={styles.input} placeholder="e.g. RC 1234567" value={data.cacNumber} onChange={(e) => onUpdate({ cacNumber: e.target.value })} />
        </div>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="md" onClick={onBack}>Back</Button>
        <Button type="submit" variant="primary" size="lg">Continue</Button>
      </div>
    </form>
  );
}

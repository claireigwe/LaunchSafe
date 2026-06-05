"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BusinessOperationsData } from "../../types/onboarding.types";
import styles from "./business-operations.module.css";

interface Props {
  data: BusinessOperationsData;
  onUpdate: (v: Partial<BusinessOperationsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const EMPLOYEE_RANGES = [
  { value: "1", label: "Just me (1)" },
  { value: "2-10", label: "Small team (2-10)" },
  { value: "11-50", label: "Growing team (11-50)" },
  { value: "51-200", label: "Medium team (51-200)" },
  { value: "201+", label: "Large team (201+)" },
];

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

export function BusinessOperations({ data, onUpdate, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.employeeCount) e.employeeCount = "Select employee count";
    if (data.hasPhysicalLocation === null) e.hasPhysicalLocation = "Please answer";
    if (data.hasOnlineOperations === null) e.hasOnlineOperations = "Please answer";
    if (data.hasCustomerLocation === null) e.hasCustomerLocation = "Please answer";
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
        <h2 className={styles.title}>Business Operations</h2>
        <p className={styles.subtitle}>Tell us how your business operates.</p>
      </div>

      <div className={styles.field}>
        <p className={styles.label}>Number of Employees</p>
        {errors.employeeCount && <p className={styles.error} role="alert">{errors.employeeCount}</p>}
        <div className={styles.rangeGrid} role="radiogroup" aria-label="Employees">
          {EMPLOYEE_RANGES.map((r) => (
            <button key={r.value} type="button" className={`${styles.rangeCard} ${data.employeeCount === r.value ? styles.rangeCardSelected : ""}`} onClick={() => onUpdate({ employeeCount: r.value })} role="radio" aria-checked={data.employeeCount === r.value}>{r.label}</button>
          ))}
        </div>
      </div>

      {errors.hasPhysicalLocation && <p className={styles.error} role="alert">{errors.hasPhysicalLocation}</p>}
      <Bool label="Do you operate from a physical location?" value={data.hasPhysicalLocation} onChange={(v) => onUpdate({ hasPhysicalLocation: v })} />

      {errors.hasOnlineOperations && <p className={styles.error} role="alert">{errors.hasOnlineOperations}</p>}
      <Bool label="Do you operate online?" value={data.hasOnlineOperations} onChange={(v) => onUpdate({ hasOnlineOperations: v })} />

      {errors.hasCustomerLocation && <p className={styles.error} role="alert">{errors.hasCustomerLocation}</p>}
      <Bool label="Do customers visit your location?" value={data.hasCustomerLocation} onChange={(v) => onUpdate({ hasCustomerLocation: v })} />

      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="md" onClick={onBack}>Back</Button>
        <Button type="submit" variant="primary" size="lg">Continue</Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "../tooltip";
import type { TeamStaffingData } from "../../types/wizard.types";
import styles from "./team-staffing.module.css";

interface TeamStaffingProps {
  data: TeamStaffingData;
  onUpdate: (values: Partial<TeamStaffingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function BooleanInput({
  value,
  onChange,
  label,
  tooltip,
}: {
  value: boolean | null;
  onChange: (v: boolean | null) => void;
  label: string;
  tooltip?: string;
}) {
  return (
    <div className={styles.booleanField}>
      <div className={styles.labelRow}>
        <p className={styles.booleanLabel}>{label}</p>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className={styles.booleanGroup} role="radiogroup" aria-label={label}>
        <button
          type="button"
          className={`${styles.booleanBtn} ${value === true ? styles.booleanBtnActive : ""}`}
          onClick={() => onChange(true)}
          role="radio"
          aria-checked={value === true}
        >
          Yes
        </button>
        <button
          type="button"
          className={`${styles.booleanBtn} ${value === false ? styles.booleanBtnActive : ""}`}
          onClick={() => onChange(false)}
          role="radio"
          aria-checked={value === false}
        >
          No
        </button>
      </div>
    </div>
  );
}

const EMPLOYEE_RANGES = [
  { value: "1", label: "Just me (1)" },
  { value: "2-10", label: "Small team (2-10)" },
  { value: "11-50", label: "Growing team (11-50)" },
  { value: "51-200", label: "Medium team (51-200)" },
  { value: "201+", label: "Large team (201+)" },
];

export function TeamStaffing({
  data,
  onUpdate,
  onNext,
  onBack,
}: TeamStaffingProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!data.employeeCount) newErrors.employeeCount = "Select expected team size";
    if (data.hireImmediately === null) newErrors.hireImmediately = "Please answer this question";
    if (data.useContractors === null) newErrors.useContractors = "Please answer this question";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>Team & Staffing</h2>
        <p className={styles.subtitle}>Tell us about your team. Staffing affects employment compliance requirements.</p>
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label}>How many employees do you expect to have?</label>
          <InfoTooltip text="The number of employees affects your obligations for payroll taxes, social contributions, workplace safety, and employment law compliance." />
        </div>
        {errors.employeeCount && <p className={styles.errorText} role="alert">{errors.employeeCount}</p>}
        <div className={styles.rangeGrid} role="radiogroup" aria-label="Expected employee count">
          {EMPLOYEE_RANGES.map((range) => (
            <button
              key={range.value}
              type="button"
              className={`${styles.rangeCard} ${data.employeeCount === range.value ? styles.rangeCardSelected : ""}`}
              onClick={() => onUpdate({ employeeCount: range.value })}
              role="radio"
              aria-checked={data.employeeCount === range.value}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div>
        {errors.hireImmediately && <p className={styles.errorText} role="alert">{errors.hireImmediately}</p>}
        <BooleanInput
          label="Will you hire staff immediately?"
          tooltip="Hiring employees creates obligations for employment contracts, tax registration, pension contributions, and workplace insurance."
          value={data.hireImmediately}
          onChange={(v) => onUpdate({ hireImmediately: v })}
        />
      </div>

      <div>
        {errors.useContractors && <p className={styles.errorText} role="alert">{errors.useContractors}</p>}
        <BooleanInput
          label="Will you use independent contractors or freelancers?"
          tooltip="Contractors are treated differently from employees for tax and legal purposes. Some countries have strict rules about who can be classified as a contractor."
          value={data.useContractors}
          onChange={(v) => onUpdate({ useContractors: v })}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="md" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Review Answers
        </Button>
      </div>
    </form>
  );
}

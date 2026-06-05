"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "../tooltip";
import type { BusinessActivitiesData } from "../../types/wizard.types";
import styles from "./business-activities.module.css";

interface BusinessActivitiesProps {
  data: BusinessActivitiesData;
  onUpdate: (values: Partial<BusinessActivitiesData>) => void;
  onNext: () => void;
  onBack: () => void;
}

type BooleanField = keyof {
  [K in keyof BusinessActivitiesData as BusinessActivitiesData[K] extends boolean | null ? K : never]: true;
};

interface YesNoQuestion {
  id: BooleanField;
  label: string;
  tooltip?: string;
}

const YES_NO_QUESTIONS: YesNoQuestion[] = [
  { id: "willManufacture", label: "Will you manufacture products?", tooltip: "Manufacturing refers to physically making, producing, or assembling products from raw materials or components." },
  { id: "willImport", label: "Will you import products or materials?", tooltip: "Importing means bringing goods or materials from another country into your country for commercial use or resale." },
  { id: "willExport", label: "Will you export products or services?", tooltip: "Exporting means sending goods or services to customers in another country." },
  { id: "willOperateOnline", label: "Will you operate an online platform?", tooltip: "An online platform includes e-commerce websites, mobile apps, SaaS products, or any digital service where customers interact with your business online." },
  { id: "hasPhysicalLocation", label: "Will you operate from a physical location?", tooltip: "A physical location includes retail stores, offices, warehouses, restaurants, or any premises where you conduct business in person." },
];

function BooleanInput({
  value,
  onChange,
  id,
  label,
  tooltip,
}: {
  value: boolean | null;
  onChange: (v: boolean | null) => void;
  id: string;
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

export function BusinessActivities({
  data,
  onUpdate,
  onNext,
  onBack,
}: BusinessActivitiesProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!data.productsServices.trim()) {
      newErrors.productsServices = "Describe what you will offer";
    }
    for (const q of YES_NO_QUESTIONS) {
      if (data[q.id] === null) {
        newErrors[q.id] = "Please answer this question";
      }
    }
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
        <h2 className={styles.title}>Business Activities</h2>
        <p className={styles.subtitle}>Help us understand what your business does so we can identify relevant requirements.</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="productsServices" className={styles.label}>
          What products or services will you provide?
        </label>
        {errors.productsServices && <p className={styles.errorText} role="alert">{errors.productsServices}</p>}
        <textarea
          id="productsServices"
          className={styles.textarea}
          placeholder="e.g. Fresh baked goods, Software consulting, Logistics services"
          value={data.productsServices}
          onChange={(e) => onUpdate({ productsServices: e.target.value })}
          rows={3}
        />
      </div>

      <div className={styles.divider} />

      {YES_NO_QUESTIONS.map((q) => (
        <div key={q.id}>
          {errors[q.id] && <p className={styles.errorText} role="alert">{errors[q.id]}</p>}
          <BooleanInput
            id={q.id}
            label={q.label}
            tooltip={q.tooltip}
            value={data[q.id]}
            onChange={(v) => onUpdate({ [q.id]: v } as any)}
          />
        </div>
      ))}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="md" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Continue
        </Button>
      </div>
    </form>
  );
}

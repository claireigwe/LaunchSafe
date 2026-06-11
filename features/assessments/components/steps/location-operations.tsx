"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { InfoTooltip } from "../tooltip";
import type { LocationOperationsData } from "../../types/wizard.types";
import { ASSESSMENT_COUNTRIES } from "../../data/countries-data";
import styles from "./location-operations.module.css";

interface LocationOperationsProps {
  data: LocationOperationsData;
  onUpdate: (values: Partial<LocationOperationsData>) => void;
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

export function LocationOperations({
  data,
  onUpdate,
  onNext,
  onBack,
}: LocationOperationsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const selectedCountry = ASSESSMENT_COUNTRIES.find((c) => c.id === data.country);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!data.country) newErrors.country = "Select your country";
    if (!data.state) newErrors.state = "Select your state";
    if (data.customersVisitLocation === null)
      newErrors.customersVisitLocation = "Please answer this question";
    if (data.requiresInspections === null)
      newErrors.requiresInspections = "Please answer this question";
    if (data.handlesRegulatedGoods === null)
      newErrors.handlesRegulatedGoods = "Please answer this question";
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
        <h2 className={styles.title}>Location & Operations</h2>
        <p className={styles.subtitle}>Where will your business operate? Location determines which regulations apply.</p>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="country" className={styles.label}>Country</label>
          {errors.country && <p className={styles.errorText} role="alert">{errors.country}</p>}
          <Select id="country" placeholder="Select country" value={data.country} onChange={(e) => { onUpdate({ country: e.target.value, state: "" }); }} options={ASSESSMENT_COUNTRIES.map((c) => ({ value: c.id, label: c.name }))} />
        </div>

        <div className={styles.field}>
          <label htmlFor="state" className={styles.label}>State</label>
          {errors.state && <p className={styles.errorText} role="alert">{errors.state}</p>}
          <Select id="state" placeholder="Select state" value={data.state} onChange={(e) => onUpdate({ state: e.target.value })} disabled={!data.country} options={selectedCountry?.states.map((s) => ({ value: s.id, label: s.name })) || []} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="city" className={styles.label}>
          City <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="city"
          type="text"
          className={styles.input}
          placeholder="e.g. Ikeja, Accra Central"
          value={data.city}
          onChange={(e) => onUpdate({ city: e.target.value })}
          autoComplete="address-level2"
        />
      </div>

      <div className={styles.divider} />

      <div>
        {errors.customersVisitLocation && <p className={styles.errorText} role="alert">{errors.customersVisitLocation}</p>}
        <BooleanInput
          label="Will customers visit your physical location?"
          tooltip="This affects requirements like signage permits, accessibility compliance, health and safety inspections, and public liability insurance."
          value={data.customersVisitLocation}
          onChange={(v) => onUpdate({ customersVisitLocation: v })}
        />
      </div>

      <div>
        {errors.requiresInspections && <p className={styles.errorText} role="alert">{errors.requiresInspections}</p>}
        <BooleanInput
          label="Will your business require regulatory inspections?"
          tooltip="Some businesses require regular inspections by regulatory agencies — for example, health inspections for restaurants, safety inspections for factories, or fire department inspections."
          value={data.requiresInspections}
          onChange={(v) => onUpdate({ requiresInspections: v })}
        />
      </div>

      <div>
        {errors.handlesRegulatedGoods && <p className={styles.errorText} role="alert">{errors.handlesRegulatedGoods}</p>}
        <BooleanInput
          label="Will you handle regulated goods or materials?"
          tooltip="Regulated goods include food, drugs, chemicals, alcohol, firearms, hazardous materials, agricultural products, and other items subject to government oversight."
          value={data.handlesRegulatedGoods}
          onChange={(v) => onUpdate({ handlesRegulatedGoods: v })}
        />
      </div>

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

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { InfoTooltip } from "../tooltip";
import type { LocationOperationsData } from "../../types/wizard.types";
import { ASSESSMENT_COUNTRIES, getStateById } from "../../data/countries-data";
import styles from "./location-operations.module.css";

interface LocationOperationsProps {
  data: LocationOperationsData;
  onUpdate: (values: Partial<LocationOperationsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface LgaOption {
  id: string;
  name: string;
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
        >Yes</button>
        <button
          type="button"
          className={`${styles.booleanBtn} ${value === false ? styles.booleanBtnActive : ""}`}
          onClick={() => onChange(false)}
          role="radio"
          aria-checked={value === false}
        >No</button>
      </div>
    </div>
  );
}

export function LocationOperations({ data, onUpdate, onNext, onBack }: LocationOperationsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lgas, setLgas] = useState<LgaOption[]>([]);

  const selectedCountry = ASSESSMENT_COUNTRIES.find((c) => c.id === data.country);
  const stateName = data.state ? getStateById(data.country, data.state) : null;

  // Fetch LGAs when state changes
  useEffect(() => {
    if (stateName) {
      fetch(`/api/lgas?state=${encodeURIComponent(stateName)}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success) setLgas(json.data || []);
        })
        .catch(() => {});
    } else {
      setLgas([]);
    }
  }, [stateName]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!data.country) errs.country = "Please select a country.";
    if (!data.state) errs.state = "Please select a state.";
    if (!data.lga) errs.lga = "Please select a Local Government Area.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Location & Operations</h2>
      <p className={styles.subtitle}>Where will your business operate? This helps identify local permits and regulatory requirements.</p>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="country" className={styles.label}>Country</label>
          {errors.country && <p className={styles.errorText} role="alert">{errors.country}</p>}
          <Select id="country" placeholder="Select country" value={data.country} onChange={(e) => { onUpdate({ country: e.target.value, state: "", lga: "" }); }} options={ASSESSMENT_COUNTRIES.map((c) => ({ value: c.id, label: c.name }))} />
        </div>

        <div className={styles.field}>
          <label htmlFor="state" className={styles.label}>State</label>
          {errors.state && <p className={styles.errorText} role="alert">{errors.state}</p>}
          <Select id="state" placeholder="Select state" value={data.state} onChange={(e) => { onUpdate({ state: e.target.value, lga: "" }); }} disabled={!data.country} options={selectedCountry?.states.map((s) => ({ value: s.id, label: s.name })) || []} />
        </div>
      </div>

      {data.state && (
        <div className={styles.field}>
          <label htmlFor="lga" className={styles.label}>Local Government Area (LGA)</label>
          {errors.lga && <p className={styles.errorText} role="alert">{errors.lga}</p>}
          <Select id="lga" placeholder="Select LGA..." value={data.lga} onChange={(e) => onUpdate({ lga: e.target.value })} options={lgas.map((l) => ({ value: l.id, label: l.name }))} />
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="city" className={styles.label}>
          City <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="city"
          type="text"
          className={styles.input}
          placeholder="e.g. Ikeja"
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
        <Button type="button" variant="ghost" size="md" onClick={onBack}>Back</Button>
        <Button type="button" variant="primary" size="md" onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}

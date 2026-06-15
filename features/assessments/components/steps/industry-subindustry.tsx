"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { InfoTooltip } from "../tooltip";
import { INDUSTRIES_WITH_SUB, getSubIndustriesByIndustry } from "../../data/sub-industries";
import type { BusinessBasicsData } from "../../types/wizard.types";
import styles from "./industry-subindustry.module.css";

interface Props {
  data: BusinessBasicsData;
  onUpdate: (values: Partial<BusinessBasicsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function IndustrySubIndustry({ data, onUpdate, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const subIndustries = data.industry ? getSubIndustriesByIndustry(data.industry) : [];

  function validate() {
    const errs: Record<string, string> = {};
    if (!data.industry) errs.industry = "Please select an industry.";
    if (!data.subIndustry) errs.subIndustry = "Please select a sub-industry.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Industry & Sub-Industry</h2>
      <p className={styles.subtitle}>Select your business industry and specific sub-industry to get accurate compliance recommendations.</p>

      <div className={styles.field}>
        <label className={styles.label}>
          Industry
          <InfoTooltip text="Choose the industry that best describes your business." />
        </label>
        <Select
          value={data.industry}
          onChange={(e) => {
            onUpdate({ industry: e.target.value, subIndustry: "" });
            setErrors({});
          }}
          options={[
            { value: "", label: "Select industry..." },
            ...INDUSTRIES_WITH_SUB.map((i) => ({ value: i.id, label: i.name })),
          ]}
        />
        {errors.industry && <p className={styles.error}>{errors.industry}</p>}
      </div>

      {data.industry && (
        <div className={styles.field}>
          <label className={styles.label}>
            Sub-Industry
            <InfoTooltip text="Select your specific business area within the chosen industry." />
          </label>
          <Select
            value={data.subIndustry}
            onChange={(e) => {
              onUpdate({ subIndustry: e.target.value });
              setErrors({});
            }}
            options={[
              { value: "", label: "Select sub-industry..." },
              ...subIndustries.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
          {data.subIndustry && (
            <p className={styles.hint}>
              {subIndustries.find((s) => s.id === data.subIndustry)?.description}
            </p>
          )}
          {errors.subIndustry && <p className={styles.error}>{errors.subIndustry}</p>}
        </div>
      )}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="md" onClick={onBack}>Back</Button>
        <Button type="button" variant="primary" size="md" onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}

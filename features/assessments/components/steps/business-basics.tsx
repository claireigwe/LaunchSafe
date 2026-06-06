"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "../tooltip";
import type { BusinessBasicsData } from "../../types/wizard.types";
import { getIndustries, getIndustriesSync, type IndustryOption } from "../../api/industries-api";
import styles from "./business-basics.module.css";

interface BusinessBasicsProps {
  data: BusinessBasicsData;
  onUpdate: (values: Partial<BusinessBasicsData>) => void;
  onNext: () => void;
}

const BUSINESS_STAGES = [
  { value: "idea", label: "Idea Stage", description: "Just exploring the concept" },
  { value: "planning", label: "Planning Stage", description: "Developing the business plan" },
  { value: "launching", label: "Launching Soon", description: "Getting ready to start operations" },
  { value: "existing", label: "Existing Business", description: "Already operating" },
];

export function BusinessBasics({ data, onUpdate, onNext }: BusinessBasicsProps) {
  const [industries, setIndustries] = useState<IndustryOption[]>(() => getIndustriesSync());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getIndustries().then(setIndustries).catch(() => {});
  }, []);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!data.businessType.trim()) {
      newErrors.businessType = "Tell us about your business idea";
    }
    if (!data.industry) {
      newErrors.industry = "Select an industry";
    }
    if (!data.businessStage) {
      newErrors.businessStage = "Select your business stage";
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
        <h2 className={styles.title}>Business Basics</h2>
        <p className={styles.subtitle}>Tell us about your business so we can find the right requirements.</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="businessName" className={styles.label}>
          Business Name <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="businessName"
          type="text"
          className={styles.input}
          placeholder="e.g. Tech Solutions Ltd"
          value={data.businessName}
          onChange={(e) => onUpdate({ businessName: e.target.value })}
          autoComplete="organization"
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="businessType" className={styles.label}>
            What best describes your business idea?
          </label>
          <InfoTooltip text="Describe your business in a sentence or two. For example: 'An online marketplace for handmade crafts' or 'A logistics company specializing in cold chain delivery'." />
        </div>
        {errors.businessType && <p className={styles.errorText} role="alert">{errors.businessType}</p>}
        <input
          id="businessType"
          type="text"
          className={styles.input}
          placeholder="e.g. Online bakery, Logistics company, Fashion brand"
          value={data.businessType}
          onChange={(e) => onUpdate({ businessType: e.target.value })}
          autoComplete="off"
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label htmlFor="industry" className={styles.label}>
            Industry
          </label>
          <InfoTooltip text="Select the industry that best matches your primary business activity. This helps us identify the right regulatory requirements for your business." />
        </div>
        {errors.industry && <p className={styles.errorText} role="alert">{errors.industry}</p>}
        <select
          id="industry"
          className={styles.select}
          value={data.industry}
          onChange={(e) => onUpdate({ industry: e.target.value })}
        >
            <option value="">Select your industry</option>
          {industries.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Business Stage</label>
        {errors.businessStage && <p className={styles.errorText} role="alert">{errors.businessStage}</p>}
        <div className={styles.stageGrid} role="radiogroup" aria-label="Business stage">
          {BUSINESS_STAGES.map((stage) => (
            <button
              key={stage.value}
              type="button"
              className={`${styles.stageCard} ${data.businessStage === stage.value ? styles.stageCardSelected : ""}`}
              onClick={() => onUpdate({ businessStage: stage.value as any })}
              role="radio"
              aria-checked={data.businessStage === stage.value}
            >
              <span className={styles.stageLabel}>{stage.label}</span>
              <span className={styles.stageDescription}>{stage.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" size="lg" fullWidth>
          Continue
        </Button>
      </div>
    </form>
  );
}

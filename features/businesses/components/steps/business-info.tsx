"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/features/assessments/data/industries";
import { ASSESSMENT_COUNTRIES } from "@/features/assessments/data/countries-data";
import type { BusinessInfoData } from "../../types/onboarding.types";
import styles from "./business-info.module.css";

interface BusinessInfoProps {
  data: BusinessInfoData;
  onUpdate: (v: Partial<BusinessInfoData>) => void;
  onNext: () => void;
}

export function BusinessInfo({ data, onUpdate, onNext }: BusinessInfoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!data.businessName.trim()) e.businessName = "Enter your business name";
    if (!data.industry) e.industry = "Select your industry";
    if (!data.businessType.trim()) e.businessType = "Enter your business type";
    if (!data.state) e.state = "Select your state";
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
        <h2 className={styles.title}>Business Information</h2>
        <p className={styles.subtitle}>Tell us about your business so we can set up your compliance workspace.</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="bn" className={styles.label}>Business Name</label>
        {errors.businessName && <p className={styles.error} role="alert">{errors.businessName}</p>}
        <input id="bn" className={styles.input} placeholder="e.g. Tech Solutions Ltd" value={data.businessName} onChange={(e) => onUpdate({ businessName: e.target.value })} autoComplete="organization" />
      </div>

      <div className={styles.field}>
        <label htmlFor="ind" className={styles.label}>Industry</label>
        {errors.industry && <p className={styles.error} role="alert">{errors.industry}</p>}
        <select id="ind" className={styles.select} value={data.industry} onChange={(e) => onUpdate({ industry: e.target.value })}>
          <option value="">Select your industry</option>
          {INDUSTRIES.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="bt" className={styles.label}>Business Type</label>
        {errors.businessType && <p className={styles.error} role="alert">{errors.businessType}</p>}
        <input id="bt" className={styles.input} placeholder="e.g. Private Limited Company, Sole Proprietorship" value={data.businessType} onChange={(e) => onUpdate({ businessType: e.target.value })} />
      </div>

      <div className={styles.field}>
        <label htmlFor="state" className={styles.label}>State of Operation</label>
        {errors.state && <p className={styles.error} role="alert">{errors.state}</p>}
        <select id="state" className={styles.select} value={data.state} onChange={(e) => onUpdate({ state: e.target.value })}>
          <option value="">Select state</option>
          {ASSESSMENT_COUNTRIES[0]?.states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="web" className={styles.label}>Website <span className={styles.optional}>(optional)</span></label>
        <input id="web" className={styles.input} placeholder="https://example.com" value={data.website} onChange={(e) => onUpdate({ website: e.target.value })} />
      </div>

      <div className={styles.field}>
        <label htmlFor="desc" className={styles.label}>Business Description <span className={styles.optional}>(optional)</span></label>
        <textarea id="desc" className={styles.textarea} placeholder="Briefly describe what your business does" value={data.description} onChange={(e) => onUpdate({ description: e.target.value })} rows={3} />
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" size="lg" fullWidth>Continue</Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ASSESSMENT_COUNTRIES, getStateById } from "@/features/assessments/data/countries-data";
import { INDUSTRIES_WITH_SUB, getSubIndustriesByIndustry } from "@/features/assessments/data/sub-industries";
import type { BusinessInfoData } from "../../types/onboarding.types";
import styles from "./business-info.module.css";

interface Props {
  data: BusinessInfoData;
  onUpdate: (v: Partial<BusinessInfoData>) => void;
  onNext: () => void;
}

export function BusinessInfo({ data, onUpdate, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lgas, setLgas] = useState<{ id: string; name: string }[]>([]);
  const [lgasLoading, setLgasLoading] = useState(false);
  const subIndustries = data.industry ? getSubIndustriesByIndustry(data.industry) : [];

  function validate() {
    const e: Record<string, string> = {};
    if (!data.businessName.trim()) e.businessName = "Enter your business name";
    if (!data.industry) e.industry = "Select your industry";
    if (!data.subIndustry) e.subIndustry = "Select your sub-industry";
    if (!data.businessType.trim()) e.businessType = "Enter your business type";
    if (!data.state) e.state = "Select your state";
    if (!data.lga) e.lga = "Select your LGA";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (validate()) onNext();
  }

  const selectedCountry = ASSESSMENT_COUNTRIES[0];

  function handleStateChange(newState: string) {
    onUpdate({ state: newState, lga: "" });
    setLgas([]);

    if (!newState) return;

    // Look up the state name from the slug to pass to the LGA API
    const stateName = getStateById(selectedCountry?.id || "", newState);
    if (!stateName) return;

    setLgasLoading(true);
    fetch(`/api/lgas?state=${encodeURIComponent(stateName)}`)
      .then(r => r.json())
      .then(j => { if (j.success) setLgas(j.data || []); })
      .catch(() => {})
      .finally(() => setLgasLoading(false));
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
        <Select id="ind" placeholder="Select your industry" value={data.industry} onChange={(e) => onUpdate({ industry: e.target.value, subIndustry: "" })} options={INDUSTRIES_WITH_SUB.map((i) => ({ value: i.id, label: i.name }))} />
      </div>

      {data.industry && (
        <div className={styles.field}>
          <label htmlFor="sub" className={styles.label}>Sub-Industry</label>
          {errors.subIndustry && <p className={styles.error} role="alert">{errors.subIndustry}</p>}
          <Select id="sub" placeholder="Select sub-industry" value={data.subIndustry} onChange={(e) => onUpdate({ subIndustry: e.target.value })} options={subIndustries.map((s) => ({ value: s.id, label: s.name }))} />
          {data.subIndustry && (
            <p className={styles.hint}>{subIndustries.find((s) => s.id === data.subIndustry)?.description}</p>
          )}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="bt" className={styles.label}>Business Type</label>
        {errors.businessType && <p className={styles.error} role="alert">{errors.businessType}</p>}
        <input id="bt" className={styles.input} placeholder="e.g. Private Limited Company" value={data.businessType} onChange={(e) => onUpdate({ businessType: e.target.value })} />
      </div>

      <div className={styles.field}>
        <label htmlFor="state" className={styles.label}>State of Operation</label>
        {errors.state && <p className={styles.error} role="alert">{errors.state}</p>}
        <Select id="state" placeholder="Select state" value={data.state} onChange={(e) => handleStateChange(e.target.value)} options={selectedCountry?.states.map((s) => ({ value: s.id, label: s.name })) || []} />
      </div>

      {data.state && (
        <div className={styles.field}>
          <label htmlFor="lga" className={styles.label}>Local Government Area (LGA)</label>
          {errors.lga && <p className={styles.error} role="alert">{errors.lga}</p>}
          {lgasLoading ? (
            <p style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)" }}>Loading LGAs...</p>
          ) : lgas.length > 0 ? (
            <Select id="lga" placeholder="Select LGA" value={data.lga} onChange={(e) => onUpdate({ lga: e.target.value })} options={lgas.map((l) => ({ value: l.id, label: l.name }))} />
          ) : (
            <p style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)" }}>No LGAs found for this state.</p>
          )}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="web" className={styles.label}>Website <span className={styles.optional}>(optional)</span></label>
        <input id="web" className={styles.input} placeholder="https://example.com" value={data.website} onChange={(e) => onUpdate({ website: e.target.value })} />
      </div>

      <div className={styles.field}>
        <label htmlFor="desc" className={styles.label}>Description <span className={styles.optional}>(optional)</span></label>
        <textarea id="desc" className={styles.textarea} placeholder="Briefly describe what your business does" value={data.description} onChange={(e) => onUpdate({ description: e.target.value })} rows={3} />
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" size="lg" fullWidth>Continue</Button>
      </div>
    </form>
  );
}

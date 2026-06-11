"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { getIndustries, getIndustriesSync, type IndustryOption } from "@/features/assessments/api/industries-api";
import { ASSESSMENT_COUNTRIES } from "@/features/assessments/data/countries-data";
import styles from "./edit-business-modal.module.css";

interface BusinessFormData {
  businessName: string;
  businessType: string;
  industry: string;
  state: string;
  website: string;
  description: string;
  employeeCount: string;
  isRegistered: boolean | null;
  hasCAC: boolean | null;
  cacNumber: string;
  hasPhysicalLocation: boolean | null;
  hasOnlineOperations: boolean | null;
}

interface Props {
  initial: BusinessFormData;
  onSave: (data: BusinessFormData) => void;
  onClose: () => void;
}

const EMPLOYEE_RANGES = [
  { value: "1", label: "Just me (1)" },
  { value: "2-10", label: "Small team (2-10)" },
  { value: "11-50", label: "Growing team (11-50)" },
  { value: "51-200", label: "Medium team (51-200)" },
  { value: "201+", label: "Large team (201+)" },
];

function BoolToggle({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean | null) => void }) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <div className={styles.toggleGroup}>
        <button type="button" className={`${styles.toggleBtn} ${value === true ? styles.toggleActive : ""}`} onClick={() => onChange(true)}>Yes</button>
        <button type="button" className={`${styles.toggleBtn} ${value === false ? styles.toggleActive : ""}`} onClick={() => onChange(false)}>No</button>
      </div>
    </div>
  );
}

export function EditBusinessModal({ initial, onSave, onClose }: Props) {
  const [industries, setIndustries] = useState<IndustryOption[]>(() => getIndustriesSync());
  const [form, setForm] = useState<BusinessFormData>(initial);

  useEffect(() => { getIndustries().then(setIndustries).catch(() => {}); }, []);

  function update(fields: Partial<BusinessFormData>) {
    setForm((prev) => ({ ...prev, ...fields }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName.trim()) return;
    onSave(form);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Business</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Business Name</label>
            <input className={styles.input} value={form.businessName} onChange={(e) => update({ businessName: e.target.value })} placeholder="Business name" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Industry</label>
            <Select placeholder="Select industry" value={form.industry} onChange={(e) => update({ industry: e.target.value })} options={industries.map((i) => ({ value: i.slug, label: i.name }))} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Business Type</label>
            <input className={styles.input} value={form.businessType} onChange={(e) => update({ businessType: e.target.value })} placeholder="e.g. Private Limited Company" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>State</label>
            <Select placeholder="Select state" value={form.state} onChange={(e) => update({ state: e.target.value })} options={ASSESSMENT_COUNTRIES[0]?.states.map((s) => ({ value: s.id, label: s.name })) || []} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Website <span className={styles.opt}>(optional)</span></label>
            <input className={styles.input} value={form.website} onChange={(e) => update({ website: e.target.value })} placeholder="https://example.com" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description <span className={styles.opt}>(optional)</span></label>
            <textarea className={styles.textarea} value={form.description} onChange={(e) => update({ description: e.target.value })} rows={2} placeholder="Brief description" />
          </div>

          <div className={styles.divider} />

          <div className={styles.field}>
            <label className={styles.label}>Employees</label>
            <Select placeholder="Select range" value={form.employeeCount} onChange={(e) => update({ employeeCount: e.target.value })} options={EMPLOYEE_RANGES.map((r) => ({ value: r.value, label: r.label }))} />
          </div>

          <BoolToggle label="Registered with CAC?" value={form.isRegistered} onChange={(v) => update({ isRegistered: v })} />
          <BoolToggle label="Has CAC Number?" value={form.hasCAC} onChange={(v) => update({ hasCAC: v })} />

          {(form.hasCAC || form.cacNumber) && (
            <div className={styles.field}>
              <label className={styles.label}>CAC Number <span className={styles.opt}>(optional)</span></label>
              <input className={styles.input} value={form.cacNumber} onChange={(e) => update({ cacNumber: e.target.value })} placeholder="e.g. RC 1234567" />
            </div>
          )}

          <BoolToggle label="Physical Location?" value={form.hasPhysicalLocation} onChange={(v) => update({ hasPhysicalLocation: v })} />
          <BoolToggle label="Online Operations?" value={form.hasOnlineOperations} onChange={(v) => update({ hasOnlineOperations: v })} />

          <div className={styles.actions}>
            <Button type="button" variant="ghost" size="md" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="md">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

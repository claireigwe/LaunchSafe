"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "../tooltip";
import type { IndustryQuestionsData } from "../../types/wizard.types";
import { getIndustryById } from "../../data/industries";
import styles from "./industry-questions.module.css";

interface IndustryQuestionsProps {
  industry: string;
  data: IndustryQuestionsData;
  onUpdate: (values: Partial<IndustryQuestionsData>) => void;
  onSubmit: () => void;
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

export function IndustryQuestions({
  industry,
  data,
  onUpdate,
  onSubmit,
  onBack,
}: IndustryQuestionsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const industryData = getIndustryById(industry);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (industryData) {
      for (const q of industryData.questions) {
        if (data.industryAnswers[q.id] === undefined || data.industryAnswers[q.id] === null) {
          newErrors[q.id] = "Please answer this question";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      setSubmitting(true);
      onSubmit();
    }
  }

  function setAnswer(questionId: string, value: boolean | null) {
    onUpdate({
      industryAnswers: { ...data.industryAnswers, [questionId]: value },
    });
  }

  if (!industryData || industryData.questions.length === 0) {
    return (
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.header}>
          <h2 className={styles.title}>Almost Done!</h2>
          <p className={styles.subtitle}>Your assessment is ready for review. Click below to see your results.</p>
        </div>
        <div className={styles.actions}>
          <Button type="button" variant="ghost" size="md" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
            {submitting ? "Analyzing..." : "Analyze My Business"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.header}>
        <h2 className={styles.title}>Industry Details</h2>
        <p className={styles.subtitle}>A few more questions about your {industryData.name} business.</p>
      </div>

      {industryData.questions.map((q) => (
        <div key={q.id}>
          {errors[q.id] && <p className={styles.errorText} role="alert">{errors[q.id]}</p>}
          <BooleanInput
            label={q.label}
            tooltip={q.tooltip}
            value={data.industryAnswers[q.id] ?? null}
            onChange={(v) => setAnswer(q.id, v)}
          />
        </div>
      ))}

      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="md" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg" isLoading={submitting}>
          {submitting ? "Analyzing..." : "Analyze My Business"}
        </Button>
      </div>
    </form>
  );
}

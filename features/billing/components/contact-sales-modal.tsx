"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./contact-sales-modal.module.css";

interface Props {
  onClose: () => void;
}

export function ContactSalesModal({ onClose }: Props) {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = "Full name is required.";
    if (!formData.email.trim()) next.email = "Email address is required.";
    if (!formData.message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFormStatus("submitting");
    try {
      const res = await fetch("/api/contact/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setFormStatus("success");
      } else {
        setFormStatus("idle");
      }
    } catch {
      setFormStatus("idle");
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <h2 className={styles.title}>Contact Sales</h2>
        <p className={styles.subtitle}>
          Interested in the Enterprise plan? Fill out this form and our team will get back to you.
        </p>

        {formStatus === "success" ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Message sent!</h3>
            <p className={styles.successText}>
              Thank you for reaching out. Our team will contact you within 1–2 business days.
            </p>
            <Button variant="primary" size="md" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cs-name">Full Name</label>
              <input
                id="cs-name"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                type="text"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cs-email">Email Address</label>
              <input
                id="cs-email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                type="email"
                placeholder="jane@company.com"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
              />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cs-company">Company Name</label>
              <input
                id="cs-company"
                className={styles.input}
                type="text"
                placeholder="Company Ltd."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cs-message">Message</label>
              <textarea
                id="cs-message"
                className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                rows={4}
                placeholder="Tell us about your business and what you need..."
                value={formData.message}
                onChange={(e) => { setFormData({ ...formData, message: e.target.value }); setErrors({ ...errors, message: "" }); }}
              />
              {errors.message && <span className={styles.fieldError}>{errors.message}</span>}
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={formStatus === "submitting"}>
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

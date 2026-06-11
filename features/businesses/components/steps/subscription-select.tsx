"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../../data/subscription-plans";
import { ContactSalesModal } from "@/features/billing/components/contact-sales-modal";
import styles from "./subscription-select.module.css";

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
  isAnnual: boolean;
  onToggleBilling: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function SubscriptionSelect({ selected, onSelect, isAnnual, onToggleBilling, onNext, onBack }: Props) {
  const [showContactSales, setShowContactSales] = useState(false);

  function handleSelect(planId: string) {
    onSelect(planId);
    setTimeout(() => onNext(), 0);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Choose Your Plan</h2>
        <p className={styles.subtitle}>
          Select the plan that fits your compliance needs.
        </p>

        <div className={styles.billingToggle}>
          <span className={`${styles.toggleLabel} ${!isAnnual ? styles.activeLabel : ""}`}>Monthly</span>
          <button className={styles.toggleTrack} onClick={onToggleBilling} aria-label="Toggle billing frequency">
            <div className={`${styles.toggleThumb} ${isAnnual ? styles.thumbAnnual : ""}`} />
          </button>
          <span className={`${styles.toggleLabel} ${isAnnual ? styles.activeLabel : ""}`}>
            Annually <span className={styles.saveBadge}>Save 15%</span>
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        {SUBSCRIPTION_PLANS.filter((p) => p.id !== "enterprise").map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          const isSelected = selected === plan.id;

          return (
            <div key={plan.id} className={`${styles.card} ${plan.badge ? styles.cardHighlight : ""} ${isSelected ? styles.cardSelected : ""}`}>
              {plan.badge && (
                <div className={styles.badgeWrapper}><span className={styles.badge}>{plan.badge}</span></div>
              )}

              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.priceValue}>₦{price.toLocaleString()}</span>
                  <span className={styles.pricePeriod}>/month</span>
                </div>
                {isAnnual && <div className={styles.billedNote}>₦{plan.annualTotal.toLocaleString()} billed annually</div>}
              </div>

              <div className={styles.bestFor}>
                <h4 className={styles.label}>Best for:</h4>
                <ul className={styles.list}>
                  {plan.bestFor.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>

              <div className={styles.features}>
                <h4 className={styles.label}>Includes:</h4>
                <ul className={styles.list}>
                  {plan.features.map((f) => (
                    <li key={f.text} className={!f.included ? styles.muted : ""}>
                      <Check size={15} className={`${styles.check} ${!f.included ? styles.checkMuted : ""}`} />
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardAction}>
                <button
                  type="button"
                  className={`${styles.cta} ${plan.badge ? styles.ctaPrimary : styles.ctaOutline}`}
                  onClick={() => handleSelect(plan.id)}
                >
                  {plan.id === "starter" ? "Select Starter" : "Choose Growth"}
                </button>
              </div>
            </div>
          );
        })}

        <div className={styles.card}>
          <div className={styles.badgeWrapper}><span className={styles.badge}>Enterprise</span></div>

          <div className={styles.cardHeader}>
            <h3 className={styles.planName}>Enterprise</h3>
            <div className={styles.priceRow}>
              <span className={styles.priceValue} style={{ fontSize: 20 }}>Contact Sales</span>
            </div>
          </div>

          <div className={styles.bestFor}>
            <h4 className={styles.label}>Best for:</h4>
            <ul className={styles.list}>
              <li>Larger organizations</li>
              <li>Compliance teams</li>
              <li>Business groups</li>
            </ul>
          </div>

          <div className={styles.features}>
            <h4 className={styles.label}>Includes:</h4>
            <ul className={styles.list}>
              {SUBSCRIPTION_PLANS.find((p) => p.id === "enterprise")?.features.filter((f) => f.included).map((f) => (
                <li key={f.text}>
                  <Check size={15} className={styles.check} />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.cardAction}>
            <button
              type="button"
              className={`${styles.cta} ${styles.ctaOutline}`}
              onClick={() => setShowContactSales(true)}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={onBack}>← Back</button>
      </div>

      {showContactSales && <ContactSalesModal onClose={() => setShowContactSales(false)} />}
    </div>
  );
}

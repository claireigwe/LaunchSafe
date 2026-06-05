"use client";

import { Check } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../../data/subscription-plans";
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
        {SUBSCRIPTION_PLANS.map((plan) => {
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
                  {plan.id === "starter" ? "Select Starter" : plan.id === "growth" ? "Choose Growth" : "Select Enterprise"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.backRow}>
        <button type="button" className={styles.backLink} onClick={onBack}>← Back</button>
      </div>
    </div>
  );
}

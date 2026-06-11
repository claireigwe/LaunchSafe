"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactSalesModal } from "@/features/billing/components/contact-sales-modal";
import styles from "./autopilot-plans.module.css";

interface PricingPlan {
  name: string;
  monthlyPrice?: string;
  annualPrice?: string;
  annualTotal?: string;
  bestFor: string[];
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlight: boolean;
}

export function AutopilotPlans() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [showContactSales, setShowContactSales] = useState(false);

  const plans: PricingPlan[] = [
    {
      name: "Starter",
      monthlyPrice: "₦10,000",
      annualPrice: "₦8,500",
      annualTotal: "₦102,000",
      bestFor: [
        "Small businesses",
        "Solo founders",
        "Early-stage companies"
      ],
      features: [
        "1 Business",
        "Generate up to 2 Compliance Documents/Month",
        "Compliance Dashboard",
        "Compliance Calendar",
        "Deadline Tracking",
        "Notifications",
        "Regulatory Updates",
        "Evidence Management"
      ],
      ctaText: "Start Starter Plan",
      ctaHref: "/signup?plan=starter",
      highlight: false
    },
    {
      name: "Growth",
      monthlyPrice: "₦20,000",
      annualPrice: "₦18,000",
      annualTotal: "₦216,000",
      bestFor: [
        "Growing businesses",
        "Agencies",
        "Operators managing multiple businesses"
      ],
      features: [
        "Up to 5 Businesses",
        "Generate up to 15 Compliance Documents/Month",
        "Everything in Starter",
        "Multi-Business Management",
        "Advanced Compliance Tracking",
        "Enhanced Reporting"
      ],
      ctaText: "Choose Growth",
      ctaHref: "/signup?plan=growth",
      highlight: true
    },
    {
      name: "Enterprise",
      bestFor: [
        "Larger organizations",
        "Compliance teams",
        "Business groups"
      ],
      features: [
        "Up to 20 Businesses",
        "Generate up to 100 Compliance Documents/Month",
        "Team Collaboration",
        "Advanced Reporting",
        "Priority Support",
        "AI Compliance Assistant",
        "Enterprise Features"
      ],
      ctaText: "Contact Sales",
      ctaHref: "",
      highlight: false
    }
  ];

  return (
    <section id="autopilot-plans" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Compliance Autopilot Plans</h2>
          <p className={styles.subtitle}>
            Simple, predictable pricing for ongoing compliance management.
          </p>
          
          <div className={styles.billingToggle}>
            <span className={`${styles.toggleLabel} ${!isAnnual ? styles.activeLabel : ""}`}>Monthly</span>
            <button 
              className={styles.toggleTrack} 
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle billing frequency"
            >
              <div className={`${styles.toggleThumb} ${isAnnual ? styles.thumbAnnual : ""}`} />
            </button>
            <span className={`${styles.toggleLabel} ${isAnnual ? styles.activeLabel : ""}`}>
              Annually <span className={styles.saveBadge}>Save 15%</span>
            </span>
          </div>
        </div>

        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <div key={index} className={`${styles.card} ${plan.highlight ? styles.cardHighlight : ""}`}>
              {plan.highlight && (
                <div className={styles.popularBadgeWrapper}>
                  <span className={styles.popularBadge}>Most Popular</span>
                </div>
              )}
              
              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                {plan.monthlyPrice ? (
                  <>
                    <div className={styles.priceContainer}>
                      <span className={styles.priceValue}>
                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className={styles.pricePeriod}>/month</span>
                    </div>
                    {isAnnual && (
                      <div className={styles.billedAnnually}>
                        {plan.annualTotal} billed annually
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.priceContainer}>
                    <span className={styles.priceValue} style={{ fontSize: 18 }}>Contact Sales</span>
                  </div>
                )}
              </div>

              <div className={styles.bestForSection}>
                <h4 className={styles.sectionTitle}>Best for:</h4>
                <ul className={styles.bestForList}>
                  {plan.bestFor.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.featuresSection}>
                <h4 className={styles.sectionTitle}>Includes:</h4>
                <ul className={styles.featuresList}>
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <Check size={16} className={styles.checkIcon} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardAction}>
                {plan.ctaHref ? (
                  <Link href={plan.ctaHref} tabIndex={-1} className={styles.fullWidth}>
                    <Button className={styles.fullWidth} variant={plan.highlight ? "primary" : "outline"} size="lg">
                      {plan.ctaText}
                    </Button>
                  </Link>
                ) : (
                  <Button className={styles.fullWidth} variant={plan.highlight ? "primary" : "outline"} size="lg" onClick={() => setShowContactSales(true)}>
                    {plan.ctaText}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showContactSales && <ContactSalesModal onClose={() => setShowContactSales(false)} />}
    </section>
  );
}

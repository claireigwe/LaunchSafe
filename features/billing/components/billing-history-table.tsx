"use client";

import { CreditCard } from "lucide-react";
import { formatCurrency } from "../api/billing-api";
import type { SavedPayment } from "@/types/domain/billing";
import pageStyles from "./billing-page.module.css";
import styles from "./billing-table.module.css";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export function BillingHistoryTable({ payments }: { payments: SavedPayment[] }) {
  const subs = payments.filter((p) => p.paymentType === "subscription");
  return (
    <section className={pageStyles.section}>
      <div className={pageStyles.sectionHeader}>
        <CreditCard size={16} className={pageStyles.sectionIcon} />
        <h2 className={pageStyles.sectionTitle}>Billing History</h2>
      </div>
      {subs.length > 0 ? (
        <div className={styles.table}>
          <div className={styles.tableHeader} style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr" }}>
            <span className={styles.th}>Date</span>
            <span className={styles.th}>Description</span>
            <span className={styles.th}>Amount</span>
            <span className={styles.th}>Status</span>
            <span className={styles.th}>Reference</span>
          </div>
          {subs.map((p) => (
            <div key={p.id} className={styles.tableRow} style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr" }}>
              <span className={styles.td}>{formatDate(p.createdAt)}</span>
              <span className={styles.td}>{p.description}</span>
              <span className={styles.td}>{formatCurrency(p.amount)}</span>
              <span className={styles.td}><span className={`${styles.payBadge} ${styles[`pay_${p.status}`]}`}>{p.status}</span></span>
              <span className={`${styles.td} ${styles.refCell}`}>{p.reference}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={pageStyles.emptyCard}>
          <p className={pageStyles.emptyText}>No payment history available.</p>
        </div>
      )}
    </section>
  );
}

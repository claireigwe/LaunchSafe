import Link from "next/link";
import { Bell } from "lucide-react";
import type { RegulatoryUpdate } from "@/types/domain/regulatory";
import styles from "./regulatory-updates.module.css";

interface Props {
  updates: RegulatoryUpdate[];
}

export function RegulatoryUpdates({ updates }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Bell size={16} className={styles.icon} />
        <h2 className={styles.title}>Regulatory Updates</h2>
        {updates.length > 0 && <Link href="/regulatory-updates" className={styles.viewAll}>View all</Link>}
      </div>
      {updates.length > 0 ? (
        <ul className={styles.list}>
          {updates.slice(0, 3).map((u) => (
            <li key={u.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={`${styles.impact} ${styles[`i_${u.impactLevel}`]}`}>{u.impactLevel}</span>
                <span className={styles.date}>Eff. {new Date(u.effectiveDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <h3 className={styles.itemTitle}>{u.title}</h3>
              <p className={styles.itemSummary}>{u.summary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No updates available at this time.</p>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Building2, ArrowUpDown } from "lucide-react";
import type { BusinessComparison } from "../types/reporting.types";
import styles from "./comparison-table.module.css";

interface Props {
  data: BusinessComparison[];
}

type SortKey = "score" | "overdueTasks" | "riskLevel";

export function ComparisonTable({ data }: Props) {
  const [sort, setSort] = useState<SortKey>("score");
  const [asc, setAsc] = useState(false);

  const sorted = [...data].sort((a, b) => {
    const val = sort === "score" ? a.score - b.score : sort === "overdueTasks" ? a.overdueTasks - b.overdueTasks : a.riskLevel.localeCompare(b.riskLevel);
    return asc ? val : -val;
  });

  function toggle(key: SortKey) {
    if (sort === key) setAsc(!asc);
    else { setSort(key); setAsc(false); }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Building2 size={16} className={styles.icon} />
        <h2 className={styles.title}>Multi-Business Comparison</h2>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span className={styles.th}>Business</span>
          <span className={styles.th} onClick={() => toggle("score")}>Score <ArrowUpDown size={12} /></span>
          <span className={styles.th}>Open</span>
          <span className={styles.th} onClick={() => toggle("overdueTasks")}>Overdue <ArrowUpDown size={12} /></span>
          <span className={styles.th} onClick={() => toggle("riskLevel")}>Risk <ArrowUpDown size={12} /></span>
        </div>
        {sorted.map((b) => (
          <div key={b.businessName} className={styles.tableRow}>
            <span className={styles.td}>{b.businessName}</span>
            <span className={styles.td}><span className={`${styles.scoreBadge} ${b.score >= 80 ? styles.scoreHigh : b.score >= 50 ? styles.scoreMid : styles.scoreLow}`}>{b.score}%</span></span>
            <span className={styles.td}>{b.openTasks}</span>
            <span className={styles.td}><span className={b.overdueTasks > 0 ? styles.overdueWarning : ""}>{b.overdueTasks}</span></span>
            <span className={styles.td}><span className={`${styles.riskBadge} ${b.riskLevel === "Low Risk" ? styles.riskLow : b.riskLevel === "Medium Risk" ? styles.riskMid : styles.riskHigh}`}>{b.riskLevel}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

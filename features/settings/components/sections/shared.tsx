import { cn } from "@/lib/utils/cn";
import styles from "../settings-page.module.css";

export function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionSubtitle}>{subtitle}</p>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

export function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: () => void }) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <span className={styles.toggleLabel}>{label}</span>
        <span className={styles.toggleDesc}>{description}</span>
      </div>
      <button type="button" className={cn(styles.toggle, value && styles.toggleOn)} onClick={onChange} role="switch" aria-checked={value} aria-label={label}>
        <div className={styles.toggleThumb} />
      </button>
    </div>
  );
}

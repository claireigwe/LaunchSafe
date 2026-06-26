"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./cancel-modal.module.css";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelSubscriptionModal({ onClose, onConfirm }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
        <AlertCircle size={24} className={styles.warnIcon} />
        <h3 className={styles.confirmTitle}>Cancel Subscription?</h3>
        <p className={styles.confirmText}>Your subscription will remain active until the end of the current billing period. After that, you will lose access to compliance management features.</p>
        <div className={styles.confirmActions}>
          <Button type="button" variant="ghost" size="md" onClick={onClose}>Keep Subscription</Button>
          <Button type="button" variant="destructive" size="md" onClick={onConfirm}>Cancel Anyway</Button>
        </div>
      </div>
    </div>
  );
}

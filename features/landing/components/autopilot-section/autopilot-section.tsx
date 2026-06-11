"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { saveUserIntent } from "@/features/businesses/api/onboarding-api";
import styles from "./autopilot-section.module.css";

export function AutopilotSection() {
  const router = useRouter();

  function handleAddExisting() {
    saveUserIntent("existing_business");
    router.push("/business-onboarding");
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Stay compliant after launch</h2>
          <p className={styles.subtitle}>
            Launch is only the beginning. Track deadlines, manage permits, monitor regulatory updates, store compliance records, and stay ahead of compliance risks from one dashboard.
          </p>
          <div className={styles.actions}>
            <Button variant="primary" size="lg" onClick={handleAddExisting}>
              Add Your Existing Business
            </Button>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.imageContainer}>
            <Image
              src="/images/landing/stay-compliant.png"
              alt="LaunchSafe Compliance Dashboard"
              width={800}
              height={500}
              className={styles.dashboardImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

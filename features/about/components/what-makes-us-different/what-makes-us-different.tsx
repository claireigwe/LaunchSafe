import { Database, Sparkles, XCircle } from "lucide-react";
import styles from "./what-makes-us-different.module.css";

export function WhatMakesUsDifferent() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Not just another AI tool.</h2>
          <p className={styles.subtitle}>
            LaunchSafe is a regulatory knowledge platform first. AI supports our platform, but it is never the primary source of truth.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <XCircle size={24} className={styles.iconRed} />
            </div>
            <h3 className={styles.cardTitle}>Generic AI Assistants</h3>
            <ul className={styles.list}>
              <li>Invent regulations when unsure</li>
              <li>Cannot verify sources</li>
              <li>Provide generic legal advice</li>
              <li>Cannot track compliance deadlines</li>
              <li>Blend estimated and official costs</li>
            </ul>
          </div>

          <div className={styles.cardHighlight}>
            <div className={styles.iconWrapperHighlight}>
              <Database size={24} className={styles.iconPrimary} />
            </div>
            <h3 className={styles.cardTitleHighlight}>LaunchSafe Platform</h3>
            <ul className={styles.listHighlight}>
              <li>Retrieves verified regulatory data</li>
              <li>Attaches sources to requirements</li>
              <li>Separates official and community costs</li>
              <li>Generates specific launch roadmaps</li>
              <li>Maintains ongoing compliance history</li>
            </ul>
            <div className={styles.sparkleTag}>
              <Sparkles size={14} />
              <span>AI-enhanced data processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

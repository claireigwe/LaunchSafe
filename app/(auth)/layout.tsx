/**
 * Auth layout — minimal shell for login, signup, and password reset screens.
 */
import styles from "./auth-layout.module.css";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      {/* Left Decorative Pane */}
      <div className={styles.leftPane}>
        <div className={styles.pattern}></div>
        
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          LaunchSafe
        </Link>

        <div className={styles.contentWrapper}>
          <div className={styles.floatingMock}>
            <div className={styles.mockHeader}>
              <div className={styles.mockIcon}>✓</div>
              <div className={styles.mockTitle}>Compliance Dashboard</div>
            </div>
            <div className={styles.mockText}>
              Discover regulatory requirements, estimate compliance costs, and track deadlines seamlessly before and after launching your business.
            </div>
          </div>

          <div className={styles.decorativeContent}>
            <h2 className={styles.decorativeTitle}>
              One Click Away from<br />Compliance Clarity
            </h2>
            <p className={styles.decorativeSubtitle}>
              Join thousands of businesses managing their compliance easily.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className={styles.rightPane}>
        {children}
      </div>
    </div>
  );
}

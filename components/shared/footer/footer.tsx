import Link from "next/link";
import styles from "./footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>⬡</span>
              LaunchSafe
            </Link>
            <p className={styles.description}>
              Compliance intelligence for African businesses. Discover, understand, and manage regulatory requirements.
            </p>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Platform</h3>
              <Link href="/assessment" className={styles.link}>
                Pre-Launch Assessment
              </Link>
              <Link href="/pricing" className={styles.link}>
                Pricing
              </Link>
              <Link href="/about" className={styles.link}>
                About Us
              </Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Resources</h3>
              <Link href="/faq" className={styles.link}>
                FAQ
              </Link>
              <Link href="/contact" className={styles.link}>
                Contact Support
              </Link>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Legal</h3>
              <Link href="/privacy" className={styles.link}>
                Privacy Policy
              </Link>
              <Link href="/terms" className={styles.link}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {currentYear} LaunchSafe. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            LaunchSafe provides compliance intelligence, not legal advice. Information should be verified before taking action.
          </p>
        </div>
      </div>
    </footer>
  );
}

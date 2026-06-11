import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileCheck, Building2, MapPin, Search, CheckCircle2 } from "lucide-react";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.glow} />
      </div>

      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>&lt;</span>
          <span className={styles.badgeText}>THE COMPLIANCE OPERATING SYSTEM</span>
        </div>

        <h1 className={styles.title}>
          Compliance intelligence<br />
          for <span className={styles.titleHighlight}>African businesses</span>
        </h1>
        
        <p className={styles.subtitle}>
          Discover your compliance requirements before launching, and stay compliant as you grow. Understand costs, track deadlines, and manage regulatory risks all in one place.
        </p>

        <div className={styles.actions}>
          <Link href="/assessment" tabIndex={-1}>
            <Button variant="primary" size="lg" className={styles.button}>
              Start Free Assessment
            </Button>
          </Link>
          <Link href="/pricing" tabIndex={-1}>
            <Button variant="outline" size="lg" className={styles.button}>
              View Plans
            </Button>
          </Link>
        </div>

        <div className={styles.previewWrapper}>
          <div className={`${styles.floatingIcon} ${styles.floatingLeft}`}>
            <MapPin size={20} className={styles.iconBlue} />
          </div>
          <div className={`${styles.floatingIcon} ${styles.floatingRight}`}>
            <ShieldCheck size={20} className={styles.iconBlue} />
          </div>
          
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewHeaderLeft}>
                <Search size={16} className={styles.previewIcon} />
                <span>Analyzing business profile...</span>
              </div>
              <div className={styles.previewHeaderRight}>
                <span className={`${styles.dot} ${styles.dotRed}`} />
                <span className={`${styles.dot} ${styles.dotYellow}`} />
                <span className={`${styles.dot} ${styles.dotGreen}`} />
              </div>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewItem}>
                <div className={styles.previewItemIconWrapper}>
                  <Building2 size={20} className={styles.previewItemIcon} />
                </div>
                <div className={styles.previewItemText}>
                  <strong>Requirements Found: 8</strong>
                  <span>Agencies Involved: 4</span>
                </div>
              </div>
              <div className={styles.previewItem}>
                <div className={styles.previewItemIconWrapper}>
                  <FileCheck size={20} className={styles.previewItemIcon} />
                </div>
                <div className={styles.previewItemText}>
                  <strong>Compliance Complexity: Medium</strong>
                  <span>Estimated Cost: ₦85,000 – ₦120,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.trustedBySection}>
        <div className={styles.trustedContainer}>
          <p className={styles.trustedText}>BUILT USING VERIFIED REGULATORY DATA FROM:</p>
          <div className={styles.trustedLogos}>
            <Image src="/images/regulators/cac.png" alt="CAC" width={120} height={48} className={styles.regulatorLogo} />
            <Image src="/images/regulators/firs.png" alt="FIRS" width={120} height={48} className={styles.regulatorLogo} />
            <Image src="/images/regulators/nafdac.png" alt="NAFDAC" width={120} height={48} className={styles.regulatorLogo} />
            <Image src="/images/regulators/son.png" alt="SON" width={120} height={48} className={styles.regulatorLogo} />
            <Image src="/images/regulators/ndpc.png" alt="NDPC" width={120} height={48} className={styles.regulatorLogo} />
          </div>
        </div>
      </div>
    </section>
  );
}

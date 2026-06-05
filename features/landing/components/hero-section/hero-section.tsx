import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileCheck, Building2, MapPin, Search, CheckCircle2 } from "lucide-react";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.glow} />
        {/* Orbital rings */}
        <div className={styles.ring} style={{ width: '800px', height: '800px' }} />
        <div className={styles.ring} style={{ width: '1200px', height: '1200px' }} />
        <div className={styles.ring} style={{ width: '1600px', height: '1600px' }} />

        {/* Floating Icons representing agencies, rules, businesses */}
        <div className={`${styles.floatingElement} ${styles.float1}`}>
          <div className={styles.iconContainer}><Building2 size={24} /></div>
        </div>
        <div className={`${styles.floatingElement} ${styles.float2}`}>
          <div className={styles.iconContainer}><FileCheck size={24} /></div>
        </div>
        <div className={`${styles.floatingElement} ${styles.float3}`}>
          <div className={styles.iconContainer}><ShieldCheck size={24} /></div>
        </div>
        <div className={`${styles.floatingElement} ${styles.float4}`}>
          <div className={styles.iconContainer}><MapPin size={24} /></div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>LaunchSafe</span>
          <span className={styles.badgeText}>The compliance operating system</span>
        </div>

        <h1 className={styles.title}>
          Compliance intelligence<br />for African businesses
        </h1>
        
        <p className={styles.subtitle}>
          Discover your compliance requirements before launching, and stay compliant as you grow. Understand costs, track deadlines, and manage regulatory risks all in one place.
        </p>

        <div className={styles.actions}>
          <Link href="/assessment" tabIndex={-1}>
            <Button variant="primary" size="lg">
              Start Free Assessment
            </Button>
          </Link>
          <Link href="/pricing" tabIndex={-1}>
            <Button variant="outline" size="lg">
              View Plans
            </Button>
          </Link>
        </div>

        {/* Abstract central UI preview (like the one in the reference image) */}
        <div className={styles.previewContainer}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <Search size={16} className={styles.previewIcon} />
              <span>Analyzing business profile...</span>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.previewItem}>
                <CheckCircle2 size={20} className={styles.previewItemIcon} />
                <div className={styles.previewItemText}>
                  <strong>Requirements Found: 8</strong>
                  <span>Agencies Involved: 4</span>
                </div>
              </div>
              <div className={styles.previewItem}>
                <CheckCircle2 size={20} className={styles.previewItemIcon} />
                <div className={styles.previewItemText}>
                  <strong>Compliance Complexity: Medium</strong>
                  <span>Estimated Cost: ₦85,000 – ₦120,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.trustedBy}>
          <p className={styles.trustedText}>Built using verified regulatory intelligence from:</p>
          <div className={styles.trustedLogos}>
            {/* These would be real logos, using text placeholders for now */}
            <span className={styles.logoPlaceholder}>CAC</span>
            <span className={styles.logoPlaceholder}>FIRS</span>
            <span className={styles.logoPlaceholder}>NAFDAC</span>
            <span className={styles.logoPlaceholder}>SON</span>
            <span className={styles.logoPlaceholder}>NDPC</span>
          </div>
        </div>
      </div>
    </section>
  );
}

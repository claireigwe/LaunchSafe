import styles from "./terms-content.module.css";

export function TermsContent() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last Updated: {currentDate}</p>
        </div>

        <div className={styles.content}>
          <p className={styles.intro}>
            These Terms of Service govern the use of LaunchSafe and its services. By accessing or using LaunchSafe, you agree to these terms. If you do not agree to these terms, you should not use the platform.
          </p>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>1. About LaunchSafe</h2>
            <p>LaunchSafe is a compliance intelligence platform that helps businesses:</p>
            <ul className={styles.list}>
              <li>Understand compliance requirements</li>
              <li>Prepare for regulatory obligations</li>
              <li>Track compliance activities</li>
              <li>Monitor regulatory updates</li>
              <li>Generate compliance-related documentation</li>
            </ul>
            <p>LaunchSafe provides informational and compliance management tools to support your business operations.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>2. Eligibility</h2>
            <p>To use LaunchSafe, you must:</p>
            <ul className={styles.list}>
              <li>Be legally capable of entering into agreements</li>
              <li>Use the platform for lawful purposes</li>
              <li>Provide accurate information</li>
            </ul>
            <p>Users are responsible for maintaining accurate account and business information at all times.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>3. User Accounts</h2>
            <p>You may be required to create an account to access certain features. You are responsible for:</p>
            <ul className={styles.list}>
              <li>Maintaining the security of your account</li>
              <li>Protecting your login credentials</li>
              <li>All activities occurring under your account</li>
            </ul>
            <p>LaunchSafe reserves the right to suspend or terminate accounts involved in abuse, fraud, or violations of these Terms.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>4. Services Provided</h2>
            <p>LaunchSafe offers two primary products. Features may evolve over time.</p>
            
            <h3 className={styles.subTitle}>Pre-Launch Compliance Explorer</h3>
            <p>This service allows users to:</p>
            <ul className={styles.list}>
              <li>Complete business compliance assessments</li>
              <li>Receive assessment summaries</li>
              <li>Purchase comprehensive compliance reports</li>
            </ul>

            <h3 className={styles.subTitle}>Compliance Autopilot</h3>
            <p>This service allows users to:</p>
            <ul className={styles.list}>
              <li>Track compliance obligations</li>
              <li>Manage ongoing compliance activities</li>
              <li>Monitor deadlines and receive notifications</li>
              <li>Store compliance records and evidence</li>
              <li>Generate compliance-related documents</li>
            </ul>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>5. Payments and Billing</h2>
            <p>LaunchSafe offers both one-time purchases and recurring subscriptions. Pricing is clearly displayed before any purchase is finalized.</p>
            
            <h3 className={styles.subTitle}>One-Time Purchases</h3>
            <p>These include specific deliverables, such as complete Compliance Reports.</p>

            <h3 className={styles.subTitle}>Recurring Subscriptions</h3>
            <p>These include ongoing access to Compliance Autopilot plans.</p>

            <p>Payments are processed securely through Paystack or other approved payment providers. By making a purchase, you authorize the processing of payments according to your selected plan. Subscription fees may renew automatically unless canceled prior to the renewal date. Additional billing terms may apply depending on your region and selected service tier.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>6. Refunds</h2>
            <p>Refund requests may be reviewed on a case-by-case basis. Approval of any refund is not guaranteed and remains at LaunchSafe&apos;s sole discretion.</p>
            <p>Refund eligibility may depend on your service usage, payment status, and applicable local laws.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>7. Acceptable Use</h2>
            <p>When using LaunchSafe, you must not:</p>
            <ul className={styles.list}>
              <li>Violate any applicable laws or regulations</li>
              <li>Commit fraud or misrepresent your identity</li>
              <li>Abuse platform functionality</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Interfere with platform operations</li>
              <li>Upload malicious software or harmful code</li>
              <li>Circumvent access controls or payment gateways</li>
            </ul>
            <p>Violations of these rules may result in immediate suspension or termination of your account.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>8. Regulatory Information Disclaimer</h2>
            <p><strong>Please read this section carefully.</strong></p>
            <p>LaunchSafe provides compliance intelligence, educational information, organizational tools, and compliance management features.</p>
            <p>LaunchSafe is <strong>not</strong>:</p>
            <ul className={styles.list}>
              <li>A law firm</li>
              <li>A regulatory authority</li>
              <li>A government agency</li>
            </ul>
            <p>LaunchSafe does <strong>not</strong> provide:</p>
            <ul className={styles.list}>
              <li>Legal representation</li>
              <li>Legal opinions</li>
              <li>Regulatory approvals</li>
              <li>Government-issued permits</li>
              <li>Government-issued licenses</li>
            </ul>
            <p>Users remain entirely responsible for their own compliance decisions, business operations, and regulatory obligations.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>9. No Guarantee of Compliance</h2>
            <p>Using LaunchSafe does not guarantee any specific regulatory outcomes, including but not limited to:</p>
            <ul className={styles.list}>
              <li>Regulatory approval</li>
              <li>Permit approval</li>
              <li>License approval</li>
              <li>Business registration approval</li>
              <li>Complete legal compliance</li>
            </ul>
            <p>Compliance outcomes may depend on business-specific factors, manual reviews, and other variables beyond our platform&apos;s control.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>10. Accuracy of Information</h2>
            <p>LaunchSafe strives to provide accurate, verified, and up-to-date compliance intelligence. However, regulations may change, agencies may update requirements without notice, and certain information may become outdated.</p>
            <p>Users should independently verify critical decisions and consult with legal professionals when appropriate.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>11. Community-Reported Information</h2>
            <p>Certain information on the platform may be explicitly identified as <strong>community-reported</strong>, <strong>estimated</strong>, or <strong>informational</strong>.</p>
            <p>Such information is based on user experiences or estimations and should not be treated as official regulatory requirements. LaunchSafe will clearly distinguish official, verified information from estimated or community-reported data.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>12. Intellectual Property</h2>
            <p>LaunchSafe owns or licenses all software, branding, content, design assets, reports, and platform functionality.</p>
            <p>Users may not copy, resell, redistribute, or reverse engineer any part of the platform or its generated reports without explicit written authorization.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>13. User Content</h2>
            <p>Users may upload documents, compliance records, evidence, and business information to the platform. You retain full ownership of your uploaded content.</p>
            <p>However, by uploading content, you grant LaunchSafe permission to process and store such content solely for the purpose of providing platform services to you.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>14. Service Availability</h2>
            <p>LaunchSafe aims to provide a reliable service but does not guarantee uninterrupted availability. Services may occasionally be affected by maintenance, technical issues, infrastructure failures, or third-party service outages.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>15. Third-Party Services</h2>
            <p>LaunchSafe may rely on third-party providers such as payment processors, hosting providers, analytics providers, and email providers. These third-party services operate under their own terms and policies, and LaunchSafe is not responsible for their conduct or availability.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>16. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, LaunchSafe shall not be liable for any indirect, incidental, or consequential damages, including but not limited to business losses, lost profits, missed opportunities, regulatory decisions, government actions, or fines resulting from the use or inability to use the platform.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>17. Indemnification</h2>
            <p>You agree to indemnify and hold LaunchSafe harmless from any claims, damages, or legal expenses arising from your misuse of the platform, violations of these Terms, or any unlawful business activities conducted under your account.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>18. Account Suspension and Termination</h2>
            <p>LaunchSafe may suspend or terminate your account without prior notice if we determine that you have engaged in fraud, abuse, security violations, or any other breach of these Terms. You may also choose to stop using the service and cancel your account at any time.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>19. Changes to the Service</h2>
            <p>As the platform evolves, LaunchSafe may add, modify, remove, or improve features and functionality without prior notice.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>20. Changes to These Terms</h2>
            <p>These Terms may be updated periodically. Material updates may be communicated through email, platform notifications, or website notices. The latest version will always display the current revision date at the top of this page.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>21. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction Placeholder]. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in [Location Placeholder].</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>22. Contact Information</h2>
            <p>If you have questions about these Terms of Service, please contact us:</p>
            <ul className={styles.list}>
              <li><strong>Email:</strong> [Support Email]</li>
              <li><strong>Contact Page:</strong> [Contact Page URL]</li>
              <li><strong>Address:</strong> [Business Address]</li>
            </ul>
          </section>

          <div className={styles.closing}>
            <p>LaunchSafe is committed to transparency, responsible platform operation, regulatory awareness, and maintaining user trust.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import styles from "./privacy-content.module.css";

export function PrivacyContent() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: {currentDate}</p>
        </div>

        <div className={styles.content}>
          <p className={styles.intro}>
            LaunchSafe is committed to protecting your privacy and safeguarding your personal and business information. This Privacy Policy explains what information we collect, how we use it, how it is stored and protected, and your rights regarding your information.
          </p>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            
            <h3 className={styles.subTitle}>Account Information</h3>
            <p>When you create an account, we may collect:</p>
            <ul className={styles.list}>
              <li>Name</li>
              <li>Email address</li>
              <li>Password credentials</li>
              <li>Account preferences</li>
            </ul>

            <h3 className={styles.subTitle}>Business Information</h3>
            <p>To provide our compliance services, we collect:</p>
            <ul className={styles.list}>
              <li>Business name</li>
              <li>Industry</li>
              <li>Business location</li>
              <li>Compliance-related information</li>
              <li>Regulatory information provided during assessments</li>
            </ul>

            <h3 className={styles.subTitle}>Assessment Information</h3>
            <p>When you use the Pre-Launch Compliance Explorer, we collect:</p>
            <ul className={styles.list}>
              <li>Assessment responses</li>
              <li>Assessment results</li>
              <li>Compliance summaries</li>
              <li>Generated reports</li>
            </ul>

            <h3 className={styles.subTitle}>Compliance Management Information</h3>
            <p>For users on Compliance Autopilot, we collect:</p>
            <ul className={styles.list}>
              <li>Compliance tasks</li>
              <li>Uploaded evidence</li>
              <li>Compliance records</li>
              <li>Generated documents</li>
              <li>Compliance history</li>
            </ul>

            <h3 className={styles.subTitle}>Payment Information</h3>
            <p>All payments are processed securely through our payment provider, Paystack. LaunchSafe does not store sensitive payment details such as card numbers, CVV values, or card expiry information. Payment processors handle these details directly.</p>

            <h3 className={styles.subTitle}>Technical Information</h3>
            <p>When you access our platform, we automatically collect:</p>
            <ul className={styles.list}>
              <li>Device information</li>
              <li>Browser information</li>
              <li>IP address</li>
              <li>Usage analytics</li>
              <li>Cookies</li>
            </ul>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>2. How We Use Information</h2>
            <p>We use your information only for legitimate business purposes, which include:</p>
            <ul className={styles.list}>
              <li>Creating and managing your account</li>
              <li>Delivering compliance assessments</li>
              <li>Generating compliance reports</li>
              <li>Providing ongoing compliance tracking</li>
              <li>Processing subscriptions and payments</li>
              <li>Improving platform functionality and user experience</li>
              <li>Providing customer support</li>
              <li>Communicating important regulatory or platform updates</li>
              <li>Monitoring and improving security</li>
            </ul>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>3. How We Share Information</h2>
            <p>LaunchSafe does not sell your personal or business information.</p>
            
            <h3 className={styles.subTitle}>Service Providers</h3>
            <p>We may share information with trusted third-party service providers only when necessary to operate our platform. These include:</p>
            <ul className={styles.list}>
              <li>Hosting providers</li>
              <li>Payment processors</li>
              <li>Analytics providers</li>
              <li>Email service providers</li>
            </ul>

            <h3 className={styles.subTitle}>Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law, court order, or valid legal requests from government authorities.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>4. Data Storage and Security</h2>
            <p>LaunchSafe implements reasonable, industry-standard security measures to protect your information, including access controls, authentication systems, encrypted connections, and security monitoring.</p>
            <p>However, no online system or electronic storage can be completely risk-free. While we strive to protect your personal and business information, we cannot guarantee its absolute security.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>5. Data Retention</h2>
            <p>We retain your information only as long as necessary to provide our services, meet legal obligations, resolve disputes, and enforce our agreements. Retention periods may vary depending on the type of information and applicable legal requirements.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>6. Cookies and Analytics</h2>
            <p>LaunchSafe uses cookies to enhance your experience. These may include:</p>
            <ul className={styles.list}>
              <li><strong>Essential cookies:</strong> Required for platform functionality, such as authentication and security.</li>
              <li><strong>Analytics cookies:</strong> Used to understand how visitors interact with our platform.</li>
              <li><strong>Performance cookies:</strong> Help us improve the speed and reliability of our services.</li>
            </ul>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>7. User Rights</h2>
            <p>You have the right to:</p>
            <ul className={styles.list}>
              <li>Request access to your information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information, where applicable</li>
              <li>Export your information from the platform</li>
            </ul>
            <p>Please note that certain information may be retained when required by law or for legitimate business purposes.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>8. Third-Party Services</h2>
            <p>LaunchSafe integrates with third-party providers such as Paystack (for payments), Supabase (for authentication and database), and various analytics and email providers. These third-party services may have their own privacy policies governing how they handle your data.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>9. Children&apos;s Privacy</h2>
            <p>LaunchSafe is intended for business users and founders. Our platform is not directed toward children, and we do not knowingly collect personal information from individuals under the applicable age of consent.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>10. International Users</h2>
            <p>Your information may be processed and stored in different jurisdictions depending on our infrastructure providers. By using LaunchSafe, you acknowledge that your information may be transferred to and processed in countries outside of your country of residence. We use reasonable safeguards to protect your information during such transfers.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or regulatory requirements. We will notify users of material changes when appropriate. The updated version will always display the latest revision date at the top of the page.</p>
          </section>

          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>12. Contact Information</h2>
            <p>If you have questions about this Privacy Policy or how we handle your information, please contact us:</p>
            <ul className={styles.list}>
              <li><strong>Email:</strong> support@launchsafe.africa</li>
              <li><strong>Contact Page:</strong> /contact</li>
              <li><strong>Address:</strong> LaunchSafe Operations, Lagos, Nigeria</li>
            </ul>
          </section>

          <div className={styles.closing}>
            <p>LaunchSafe is committed to transparency, privacy, security, and the responsible handling of your personal and business information.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

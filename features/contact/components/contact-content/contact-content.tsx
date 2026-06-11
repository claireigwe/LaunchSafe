"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./contact-content.module.css";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function ContactContent() {
  const router = useRouter();
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");
    }, 1000);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1 className={styles.title}>We&apos;re here to help.</h1>
          <p className={styles.subtitle}>
            Whether you have questions about compliance assessments, subscriptions, reports, or your compliance dashboard, our team is ready to assist.
          </p>
        </div>

        {/* Section 1: Quick Help Options */}
        <div>
          <h2 className={styles.sectionTitle}>How can we help?</h2>
          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Assessments & Reports</h3>
              <ul className={styles.cardList}>
                <li>Assessment questions</li>
                <li>Report access</li>
                <li>Report purchases</li>
                <li>Assessment results</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Billing & Subscriptions</h3>
              <ul className={styles.cardList}>
                <li>Subscription plans</li>
                <li>Payment issues</li>
                <li>Billing questions</li>
                <li>Account upgrades</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Compliance Dashboard</h3>
              <ul className={styles.cardList}>
                <li>Compliance tracking</li>
                <li>Deadline management</li>
                <li>Regulatory updates</li>
                <li>Notifications</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Technical Support</h3>
              <ul className={styles.cardList}>
                <li>Login issues</li>
                <li>Account access</li>
                <li>Platform errors</li>
                <li>General troubleshooting</li>
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Partnerships & Inquiries</h3>
              <ul className={styles.cardList}>
                <li>Partnerships</li>
                <li>Enterprise inquiries</li>
                <li>Collaboration opportunities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2 & 3: Contact Form and Preferred Support Channels */}
        <div className={styles.twoColLayout}>
          <div className={styles.formContainer}>
            <h2 className={styles.sectionTitle} style={{ textAlign: "left" }}>Send us a message</h2>
            
            {formStatus === "success" ? (
              <div className={styles.submitSuccess}>
                Thank you for your message. Our support team will get back to you shortly.
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Full Name</label>
                  <input type="text" id="name" required className={styles.input} placeholder="Jane Doe" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input type="email" id="email" required className={styles.input} placeholder="jane@company.com" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>Company Name (Optional)</label>
                  <input type="text" id="company" className={styles.input} placeholder="Company Ltd." />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>Subject</label>
                  <input type="text" id="subject" required className={styles.input} placeholder="How can we help?" />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="category" className={styles.label}>Category</label>
                  <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)} options={[{value:"", label:"Select a category"}, {value:"assessments", label:"Assessments & Reports"}, {value:"billing", label:"Billing & Subscriptions"}, {value:"dashboard", label:"Compliance Dashboard"}, {value:"technical", label:"Technical Support"}, {value:"partnerships", label:"Partnerships"}, {value:"general", label:"General Question"}]} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Message</label>
                  <textarea id="message" required className={styles.textarea} placeholder="Please provide as much detail as possible..." />
                </div>
                <Button type="submit" isLoading={formStatus === "submitting"}>
                  Send Message
                </Button>
              </form>
            )}
          </div>

          <div className={styles.channelsContainer}>
            <h2 className={styles.sectionTitle} style={{ textAlign: "left" }}>Other ways to reach us</h2>
            <div className={styles.channelCard}>
              <h3 className={styles.channelTitle}>Email Support</h3>
              <a href="mailto:support@launchsafe.com" className={styles.channelLink}>[support@launchsafe.com]</a>
            </div>
            <div className={styles.channelCard}>
              <h3 className={styles.channelTitle}>Business Inquiries</h3>
              <a href="mailto:business@launchsafe.com" className={styles.channelLink}>[business@launchsafe.com]</a>
            </div>
            <div className={styles.responseTime}>
              Typical response time:<br/>
              <strong>Within 1–2 business days</strong>
            </div>
          </div>
        </div>

        {/* Section 4: Frequently Asked Questions */}
        <div className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is the assessment free?</h3>
              <p className={styles.faqAnswer}>Yes. Users can complete the assessment and receive a summary at no cost.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How do I access my report?</h3>
              <p className={styles.faqAnswer}>Reports become available after successful payment verification.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I subscribe without taking an assessment?</h3>
              <p className={styles.faqAnswer}>Yes. Existing businesses can subscribe directly to Compliance Autopilot.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How do I update my business information?</h3>
              <p className={styles.faqAnswer}>Business information can be updated from the account dashboard.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How do I cancel a subscription?</h3>
              <p className={styles.faqAnswer}>Subscriptions can be managed from the billing section of the platform.</p>
            </div>
          </div>
          <Link href="/faq" className={styles.faqLink}>Read full FAQ →</Link>
        </div>

        {/* Section 5: Trust & Transparency */}
        <div className={styles.trustSection}>
          <h2 className={styles.sectionTitle}>Built to support growing businesses.</h2>
          <p className={styles.sectionSubtitle} style={{ maxWidth: "600px", margin: "0 auto" }}>
            LaunchSafe exists to help businesses make informed compliance decisions with confidence. Our goal is to provide clear guidance, practical tools, and responsive support whenever you need assistance.
          </p>
          <div className={styles.trustIndicators}>
            <span className={styles.trustTag}>Compliance Intelligence Platform</span>
            <span className={styles.trustTag}>Regulatory Knowledge Driven</span>
            <span className={styles.trustTag}>Secure Payment Processing</span>
            <span className={styles.trustTag}>Ongoing Compliance Monitoring</span>
          </div>
        </div>

        {/* Section 6: Support Expectations */}
        <div>
          <h2 className={styles.sectionTitle}>Support Expectations</h2>
          <div className={styles.expectationsGrid}>
            <div className={styles.expectationCard}>
              <h3 className={styles.expectationTitle}>
                <span className={styles.iconSuccess}>✓</span> What we can help with
              </h3>
              <ul className={styles.cardList}>
                <li>Understanding LaunchSafe features</li>
                <li>Assessment questions</li>
                <li>Billing assistance</li>
                <li>Account management</li>
                <li>Platform troubleshooting</li>
                <li>Compliance workflow guidance</li>
              </ul>
            </div>
            <div className={styles.expectationCard}>
              <h3 className={styles.expectationTitle}>
                <span className={styles.iconDanger}>✕</span> What we cannot provide
              </h3>
              <ul className={styles.cardList}>
                <li>Legal representation</li>
                <li>Legal opinions</li>
                <li>Regulatory approvals</li>
                <li>Government-issued permits</li>
                <li>Government-issued licenses</li>
              </ul>
              <div className={styles.reminder}>
                LaunchSafe is an intelligence platform, not a law firm. We do not provide legal advice or guarantee specific regulatory outcomes.
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className={styles.cta}>
          <h2 className={styles.title} style={{ marginBottom: "16px" }}>Need help getting started?</h2>
          <p className={styles.subtitle}>
            Start with a free compliance assessment and discover the requirements that may apply to your business.
          </p>
          <div className={styles.ctaActions}>
            <Button variant="primary" onClick={() => router.push("/assessment")}>
              Start Free Assessment
            </Button>
            <Button variant="secondary" onClick={() => router.push("/pricing")}>
              View Pricing
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}

export interface FAQItem {
  question: string;
  answer: string | string[];
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export const faqData: FAQCategory[] = [
  {
    title: "General Questions",
    items: [
      {
        question: "What is LaunchSafe?",
        answer: "LaunchSafe is a compliance intelligence platform that helps entrepreneurs and businesses understand, prepare for, and manage regulatory requirements."
      },
      {
        question: "Who is LaunchSafe for?",
        answer: "LaunchSafe is designed for entrepreneurs, startup founders, small businesses, SMEs, and growing businesses."
      },
      {
        question: "Which countries does LaunchSafe support?",
        answer: "LaunchSafe is initially focused on Nigeria while being designed for future expansion across Africa."
      },
      {
        question: "Is LaunchSafe a law firm?",
        answer: "No. LaunchSafe provides compliance intelligence and educational guidance but does not provide legal representation or legal advice."
      },
      {
        question: "Is LaunchSafe an AI chatbot?",
        answer: "No. LaunchSafe is a compliance platform that uses AI behind the scenes to simplify regulatory information and improve user experience."
      }
    ]
  },
  {
    title: "Pre-Launch Compliance Explorer",
    items: [
      {
        question: "What is the Pre-Launch Compliance Explorer?",
        answer: "It is an assessment tool that helps users understand regulatory requirements before launching a business, minimizing unexpected costs and risks."
      },
      {
        question: "What happens during the assessment?",
        answer: "Users answer questions about their intended business and receive a compliance assessment summary."
      },
      {
        question: "Is the assessment free?",
        answer: "Yes. Users can complete the assessment and receive a summary at no cost."
      },
      {
        question: "What information is included in the free summary?",
        answer: [
          "Requirement count",
          "Agency count",
          "Compliance categories",
          "Compliance complexity score"
        ]
      },
      {
        question: "What requires payment?",
        answer: [
          "Payment unlocks:",
          "Full Compliance Report",
          "Requirement Breakdown",
          "Cost Analysis",
          "Risk Analysis",
          "Launch Roadmap",
          "Compliance Timeline"
        ]
      },
      {
        question: "Is the report a subscription?",
        answer: "No. The report is a one-time purchase."
      }
    ]
  },
  {
    title: "Compliance Autopilot",
    items: [
      {
        question: "What is Compliance Autopilot?",
        answer: "It is an ongoing subscription that helps businesses manage compliance after launch."
      },
      {
        question: "Can I use Compliance Autopilot without taking an assessment?",
        answer: "Yes. Users can create an account, add an existing business, and subscribe directly."
      },
      {
        question: "What features are included?",
        answer: [
          "Compliance Dashboard",
          "Compliance Calendar",
          "Notifications",
          "Regulatory Updates",
          "Document Generation",
          "Evidence Management"
        ]
      },
      {
        question: "How does deadline tracking work?",
        answer: "LaunchSafe tracks your compliance obligations and provides automated reminders so you never miss a deadline."
      },
      {
        question: "Will LaunchSafe notify me when regulations change?",
        answer: "Yes. Relevant regulatory updates are surfaced when they become available, helping you stay compliant."
      }
    ]
  },
  {
    title: "Pricing & Payments",
    items: [
      {
        question: "How does pricing work?",
        answer: [
          "LaunchSafe offers two options:",
          "1. One-time report purchases for pre-launch founders",
          "2. Recurring compliance subscriptions for existing businesses"
        ]
      },
      {
        question: "Do I need a subscription to buy a report?",
        answer: "No. Report purchases and subscriptions are entirely independent."
      },
      {
        question: "Which payment methods are supported?",
        answer: "Payments are processed securely through Paystack, supporting a wide range of local and international payment methods."
      },
      {
        question: "How do I know my payment was successful?",
        answer: "LaunchSafe verifies payments securely on the server side before granting access to your report or subscription."
      },
      {
        question: "Do you store card information?",
        answer: "No. LaunchSafe does not store card numbers or payment credentials."
      }
    ]
  },
  {
    title: "Compliance & Regulatory Data",
    items: [
      {
        question: "Where does LaunchSafe get its information?",
        answer: "Regulatory intelligence is sourced directly from verified regulatory information and agency data."
      },
      {
        question: "How accurate is the information?",
        answer: "LaunchSafe prioritizes verified information and transparency above all else to ensure accuracy."
      },
      {
        question: "Are all costs official?",
        answer: [
          "We clearly separate our data into three categories:",
          "• Official Costs: Published directly by regulatory agencies.",
          "• Estimated Costs: Reasonable, data-backed estimates.",
          "• Community-Reported Costs: Real experiences shared by other founders."
        ]
      },
      {
        question: "What are Community-Reported Costs?",
        answer: "They represent costs that businesses commonly report experiencing, but are not official government fees."
      },
      {
        question: "How often is information updated?",
        answer: "Regulatory information is continually reviewed and updated as new information becomes available from official sources."
      }
    ]
  },
  {
    title: "Trust & Security",
    items: [
      {
        question: "Is my business information secure?",
        answer: "Yes. LaunchSafe uses modern security practices and strict database rules to protect all user data."
      },
      {
        question: "Can other users see my information?",
        answer: "No. Users can only access their own businesses and records. Your data is isolated and protected."
      },
      {
        question: "Does LaunchSafe guarantee compliance?",
        answer: "No. LaunchSafe helps businesses understand and manage compliance obligations, but cannot guarantee regulatory outcomes or act as your legal representative."
      },
      {
        question: "Can LaunchSafe obtain permits or approvals on my behalf?",
        answer: "No. LaunchSafe helps users prepare and manage compliance requirements, but does not act as a government authority or submit filings on your behalf."
      }
    ]
  },
  {
    title: "Getting Started",
    items: [
      {
        question: "I have not launched my business yet. Where should I start?",
        answer: "Start with the free Pre-Launch Compliance Assessment to understand your requirements."
      },
      {
        question: "My business already exists. Where should I start?",
        answer: "Create an account, add your business, and subscribe to Compliance Autopilot."
      },
      {
        question: "How long does the assessment take?",
        answer: "Approximately a few minutes depending on your business complexity."
      },
      {
        question: "How quickly can I access my report after payment?",
        answer: "Your full report becomes available immediately after your payment verification is successfully completed."
      }
    ]
  }
];

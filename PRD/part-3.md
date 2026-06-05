LaunchSafe Product Requirements Document (PRD)
Part 3: Database Schema, Regulatory Knowledge Architecture, AI Architecture & System Design

28. Data Architecture Overview
LaunchSafe is fundamentally a data platform before it is a software platform.
The quality of the compliance intelligence experience depends on how regulatory information is structured, maintained, and retrieved.
The architecture should separate:
User Data
Businesses, documents, assessments, and compliance records.
Regulatory Data
Requirements, agencies, costs, deadlines, renewals, penalties, and sources.
AI Knowledge Data
Embeddings, regulatory documents, summaries, explanations, and generated content.

29. Core Database Design Principles
Normalized Regulatory Data
Requirements should not be duplicated unnecessarily.

Source Traceability
Every requirement must be linked to a source.

Geographic Flexibility
The schema must support:
Countries
States
Cities
Local Government Areas
without major redesigns.

Industry Flexibility
Requirements should be reusable across industries where applicable.

Auditability
All compliance actions should be traceable.

30. Entity Relationship Overview
Users
 ├── Businesses
 │     ├── Assessments
 │     ├── Compliance Tasks
 │     ├── Documents
 │     ├── Evidence
 │     ├── Compliance Scores
 │     └── Notifications
 │
 ├── Assessment Purchases
 │
 ├── Subscriptions
 │
 └── Payments


Requirements
 ├── Agencies
 ├── Sources
 ├── Industries
 ├── Locations
 ├── Costs
 ├── Deadlines
 └── Document Templates

Regulatory Updates
 ├── Sources
 ├── Industries
 └── Impact Analysis


31. Database Schema
Users
Stores platform users.
Fields:
id
full_name
email
password_hash
role
created_at
updated_at


Businesses
Stores business profiles.
Fields:
id
user_id
business_name
industry_id
country_id
state_id
city
business_size
employee_count
launch_stage
created_at
updated_at


Assessments
Stores completed compliance assessments.
Fields:
id
business_id
assessment_version
industry_id
state_id
country_id
results_json
Created_at
summary_json
Full_report_unlocked
summary_json
full_report_unlocked


AssessmentPurchases
Stores one-time assessment purchases.

Fields:

id
assessment_id
user_id
payment_id
purchase_status
purchased_at 


SubscriptionPlans
Stores available subscription plans.

Fields:

id
name
description
price
billing_cycle
is_active
created_at


Subscriptions
Stores active subscriptions.

Fields:

id
user_id
business_id
plan_id
status
start_date
end_date
paystack_subscription_id
created_at
updated_at 


Payments
Stores payment records.

Fields:

id
user_id
amount
currency
payment_type
payment_reference
provider
status
paid_at
created_at

Payment Types:

Assessment
Subscription

Status Values:

Pending
Paid
Failed
Refunded 



BillingEvents

Stores billing lifecycle events.

Fields:

id
subscription_id
event_type
event_data
created_at


ComplianceTasks
Represents obligations assigned to businesses.
Fields:
id
business_id
requirement_id
status
priority
due_date
completed_date
created_at
updated_at


ComplianceScores
Stores compliance health scores.
Fields:
id
business_id
score
completed_tasks
overdue_tasks
missing_documents
last_calculated_at


Notifications
Stores alerts and reminders.
Fields:
id
user_id
business_id
title
message
type
read_status
scheduled_at
created_at


Documents
Stores generated documents.
Fields:
id
business_id
requirement_id
document_type
document_name
file_url
generated_by_ai
created_at


Evidence
Stores uploaded proof.
Fields:
id
business_id
requirement_id
evidence_type
file_url
notes
uploaded_at


32. Regulatory Knowledge Base Schema
This is the heart of LaunchSafe.

Countries
id
name
code


States
id
country_id
name


LGAs
id
state_id
name


Industries
id
name
description

Examples:
Restaurant
Pharmacy
Fintech
Food Processing
E-commerce

Agencies
id
name
description
website
jurisdiction

Examples:
CAC
FIRS
NAFDAC
SON
NDPC

Requirements
Stores regulatory obligations.
Fields:
id
title
description
agency_id
industry_id
requirement_type
confidence_level
verification_status
active_status
created_at
updated_at


RequirementCosts
id
requirement_id
cost_type
amount
currency
cost_notes

Cost Types:
Registration
Renewal
Inspection
Filing
Estimated
Community Reported

RequirementDeadlines
id
requirement_id
deadline_type
frequency
due_rule

Examples:
Annual
Quarterly
Monthly
One-time

RequirementDocuments
Documents required by regulators.
id
requirement_id
document_name
required_status


RequirementSources
id
requirement_id
source_name
source_url
verification_status
last_verified_at


33. Regulatory Knowledge Architecture
Regulatory information should follow a hierarchical structure.
Country

└── State

      └── Industry

            └── Requirement

                  ├── Agency

                  ├── Cost

                  ├── Deadline

                  ├── Required Documents

                  ├── Penalties

                  ├── Source

                  └── Confidence Level

This structure allows LaunchSafe to scale across countries without redesigning the platform.

34. Compliance Timeline Engine
The Timeline Engine determines:
Upcoming obligations
Renewal schedules
Missed deadlines
Future compliance events

Inputs
Business profile
Industry
State
Requirements
Existing compliance history

Outputs
Compliance calendar
Upcoming deadlines
Reminder schedule

35. Compliance Recommendation Engine
Generates business-specific recommendations.

Inputs
Industry
Location
Compliance status
Risk profile
Missing requirements

Outputs
Examples:
Obtain fire safety permit
Renew NAFDAC registration
Upload missing documentation

36. Compliance Scoring Engine
Calculates compliance health.

Inputs
Completed tasks
Overdue tasks
Missing evidence
Expired permits

Outputs
0-49     High Risk
50-69    Needs Attention
70-89    Good
90-100   Excellent


37. Regulatory Update Architecture
Tracks regulatory changes.

Regulatory Updates
id
title
summary
source
effective_date
created_at


Regulatory Impacts
id
update_id
industry_id
requirement_id
impact_level
recommended_action

Impact Levels:
Low
Medium
High

38. AI Architecture Overview
AI should support the platform rather than define it.
LaunchSafe is a compliance platform with AI capabilities.
Not an AI chatbot.

39. Assessment Access Architecture
LaunchSafe supports two assessment states.
Assessment Summary
Available before payment.
Contains:
- Business type
- Location
- Requirement count
- Agency count
- Compliance complexity score
- Compliance categories

Full Compliance Report
Available only after successful payment verification.
Contains:
- Exact requirements
- Agency obligations
- Cost breakdowns
- Permit requirements
- Licensing requirements
- Compliance timelines
- Risk analysis
- Launch roadmap

Report access must always be controlled server-side.

40. AI Responsibilities
AI should be used for:
Compliance Explanation
Convert regulatory language into plain English.

Regulatory Summarization
Summarize:
Laws
Circulars
Guidelines
Directives

Risk Detection
Identify:
Missing requirements
Potential penalties
Compliance gaps

Document Generation
Generate:
Application letters
Compliance plans
Checklists
Policies
Internal compliance documents

Recommendation Generation
Suggest next actions.

41. AI System Architecture
User Request

↓

Application Layer

↓

Compliance Engine

↓

Knowledge Retrieval

↓

LLM

↓

Structured Response

↓

User Interface


42. Retrieval-Augmented Generation (RAG)
LaunchSafe should use RAG rather than relying on model memory.

Why
Regulations change frequently.
The platform must retrieve verified information before generating responses.

RAG Flow
User Query

↓

Knowledge Search

↓

Relevant Sources

↓

Context Assembly

↓

LLM Processing

↓

Response Generation


43. Vector Database Architecture
Stores regulatory knowledge embeddings.
Possible options:
pgvector
Pinecone
Weaviate
Recommended:
pgvector
Reasons:
Cost effective
PostgreSQL integration
Simpler architecture

44. Knowledge Base Content Types
The vector database should store:
Regulatory Documents
Laws
Regulations
Circulars
Guidelines
Agency Publications
Notices
Advisories
FAQs
Compliance Templates
Policies
Checklists
Application examples
Regulatory Updates
Amendments
New directives

45. AI Document Generation Engine
Generates supporting compliance documents.

Inputs
Business information
Industry
Location
Requirement

Outputs
Examples:
Application Documents
Cover letters
Request letters
Compliance Documents
Compliance plans
Submission checklists
Privacy Documents
Data protection policies
Employee privacy notices
Internal Records
Compliance logs
Compliance declarations

46. AI Guardrails
The AI must never:
Invent regulatory requirements
Invent costs
Invent deadlines
Invent penalties
Invent legal obligations
Expose locked assessment content before payment verification.

AI Confidence Labels
Every AI-generated response should indicate:
Verified
Supported by trusted sources.
Estimated
Based on available information.
Community Reported
Based on user-reported experiences.

47. Search Architecture
Users should be able to search:
Agencies
Requirements
Industries
Documents
Regulatory updates

Search Filters
Country
State
Industry
Agency
Requirement type

48. Audit & Activity Logs
All important actions should be recorded.

Logged Events
Assessment creation
Document generation
Evidence upload
Task completion
Compliance score changes

Audit Log Schema
id
user_id
business_id
action_type
action_details
timestamp

Payment Audit Logs
All billing actions must be recorded.

Logged Events:

Assessment purchased
Subscription created
Subscription renewed
Subscription cancelled
Payment failed
Payment refunded
Payment verified

Fields:

id
user_id
payment_id
event_type
event_data
timestamp



49. Future Data Expansion Strategy
Phase 1:
Nigeria

Phase 2:
Ghana

Phase 3:
Kenya

Phase 4:
South Africa

Because the architecture is location-driven rather than country-specific, expansion should require mostly data additions rather than structural redesign.


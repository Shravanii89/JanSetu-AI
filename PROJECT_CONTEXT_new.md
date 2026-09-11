# JanSetu AI - Project Context

## 1. Project Identity

-   **Project:** JanSetu AI
-   **Hackathon Problem:** PS02 --- AI-Powered Citizen Complaint
    Understanding & Resolution Assistant
-   **Tagline:** From Citizen Voice to Government Action
-   **Product:** AI-Powered Citizen Grievance Intelligence & Resolution
    Platform
-   **Implementation context:** Pune City
-   **Architecture:** Modular monolith

JanSetu AI is an AI-powered civic operations platform. It is **not a
generic chatbot** and is not intended to replace every existing
municipal grievance portal.

Its purpose is to convert messy citizen complaints into validated,
prioritized, routed and SLA-aware service tickets and assist government
staff through clarification, resolution recommendations, escalation and
citizen communication.

## 2. Exact PS02 Requirements

Citizen complaints may be free-form and incomplete. Government staff
need to understand, categorize, prioritize, route and respond to them.

JanSetu AI must address: - Complaint type extraction - Location
detection - Urgency identification - Responsible department
determination - Missing information detection - Clarification question
generation - Resolution action recommendation - Citizen response
generation - SLA tracking

## 3. Core Product Principle

> **AI decides what the complaint means. Rules decide what the system is
> allowed to do. Humans decide consequential operational actions.**

The LLM must never directly: - Mutate critical database state - Bypass
RBAC - Calculate authoritative SLA deadlines - Invent departments -
Invent locations - Mark unverified actions as completed - Perform
consequential government actions without appropriate human control

## 4. Final Role Model

There are exactly **four roles**.

### 4.1 Citizen

Public-facing user.

Capabilities: - Submit complaint - Use text input - Optionally use
voice - Optionally upload image/evidence - Answer clarification
questions - Track complaint - View status - View citizen-facing updates

### 4.2 Municipal Admin

City-wide municipal operations role.

Capabilities: - View all complaints - Monitor all departments - Open
department-specific filtered views - Monitor workload - Monitor SLA -
View escalations - View incidents - View analytics - View geographic
hotspots

The Municipal Admin does **not** require eight separate department login
choices.

### 4.3 Department Officer

Operational role assigned to exactly one allowed department.

Account concept:

``` text
role = DEPARTMENT_OFFICER
department_id = ROAD
```

or:

``` text
role = DEPARTMENT_OFFICER
department_id = WATER_SUPPLY
```

The department is determined by backend RBAC. The officer does not
choose a department after login and cannot see other department tickets
unless explicitly authorized by backend policy.

Build **one reusable Department Dashboard** whose data is filtered by
the authenticated `department_id`.

### 4.4 Collector

Senior municipal oversight and intelligence role.

Capabilities: - Monitor P0/P1 cases - Monitor escalations - Monitor SLA
breaches - View major incidents - Compare department performance - View
hotspots - View recurring/systemic issues - Review cross-department
intelligence

The Collector should be an intelligence/oversight dashboard, not another
ordinary ticket queue.

### 4.5 Removed Role

**Super Admin is removed.**

Do not create: - Super Admin role - Super Admin dashboard - Super Admin
login - Super Admin navigation - Super Admin database enum

## 5. Controlled Departments

Use only these eight operational departments:

1.  Water Supply Department
2.  Electricity Department
3.  Public Health Department
4.  Waste Management Department
5.  Public Property Management Department
6.  Garden Department
7.  Road Department
8.  Encroachment Department

Internal fallback:

`OTHER_HUMAN_REVIEW`

The AI must map to this controlled list. It must not create arbitrary
departments.

## 6. Public Landing Page

The public website should be inspired by the provided **Sewa Setu**
reference only at the level of civic-portal familiarity. Do not copy it.

JanSetu should be cleaner, more modern, more AI-led and more focused on
complaint-to-action workflow.

### Header

Recommended navigation:

``` text
JANSETU AI
From Citizen Voice to Government Action

Home
How It Works
Track Complaint
About

                         Official Access
```

Do not display: - Department Login - Municipal Login - Collector Login -
Role selection - Super Admin - Multiple official login buttons

### Hero

Primary message:

**From Citizen Voice to Government Action**

Supporting message:

> Report civic problems in your own words. JanSetu AI understands your
> complaint, identifies what matters, routes it to the right department
> and helps track resolution.

Primary CTA:

**Report a Complaint**

Secondary CTA:

**Track Complaint**

### Complaint Input

The complaint input is the visual centerpiece.

Example:

``` text
┌─────────────────────────────────────────────────────┐
│ Describe your civic problem...                      │
│                                                     │
│ "There has been no water supply in our area..."     │
│                                      🎙       📷     │
└─────────────────────────────────────────────────────┘

                 [ Report Complaint → ]
```

Supported input modes: - Text - Voice - Optional image/evidence

Language options: - English - मराठी - हिन्दी

### Landing Page Sections

Recommended order:

1.  Hero + complaint input
2.  AI understanding demonstration
3.  Metrics/trust indicators
4.  How JanSetu works
5.  Department coverage
6.  Complaint tracking
7.  Civic intelligence preview
8.  Final CTA
9.  Footer

### AI Demonstration

Show the transformation:

``` text
Citizen:
"There has been no water supply in our area
for three days and nobody is responding."

JanSetu AI:
✓ Water Supply Issue
✓ Duration: 3 days
⚠ Location: Missing
✓ Priority: P1 High
✓ Department: Water Supply

[ Add Location ]
```

The homepage should demonstrate the product rather than merely saying
"AI-powered".

## 7. Official Access and Login

There is **one unified official login**.

Public landing page contains one subtle:

**Official Access**

Clicking it routes to:

`/login`

### Login UI

``` text
JANSETU AI

Official Government Access

Employee ID / Official Email
[________________________]

Password
[________________________]

[ Sign In ]

Forgot Password?
```

Do **not** show a role selector.

Do **not** show: - Citizen - Municipal Admin - Road Department - Water
Department - Collector

as separate login choices.

### Authentication Flow

``` text
/login
   ↓
Authenticate credentials
   ↓
Backend retrieves role
   ↓
Backend retrieves department_id if applicable
   ↓
Create authenticated session/JWT
   ↓
Route according to RBAC
```

Routing:

``` text
MUNICIPAL_ADMIN
      → /admin

DEPARTMENT_OFFICER
      → /department

COLLECTOR
      → /collector
```

Citizen experience is public-facing. If citizen authentication is later
added, it must not expose internal government roles.

## 8. RBAC Security Rule

Frontend hiding is not security.

Backend must enforce: - Role - Department - Resource access - API
permissions

Example:

``` text
DEPARTMENT_OFFICER + ROAD
→ can access Road tickets

DEPARTMENT_OFFICER + WATER_SUPPLY
→ can access Water Supply tickets
```

A malicious frontend request must not allow an officer to access another
department.

## 9. Official Dashboard Hierarchy

``` text
Official Access
      │
      ├── Municipal Admin
      │     └── All department views
      │
      ├── Department Officer
      │     └── One department via department_id
      │
      └── Collector
            └── Municipal intelligence
```

Municipal Admin's department list is a **view/filter**, not a list of
public login options.

## 10. Complaint Workflow

``` text
Citizen Complaint
      ↓
AI Understanding
      ↓
Structured Extraction
      ↓
Validation
      ↓
Missing Information?
      ↓
Clarification if needed
      ↓
Priority
      ↓
Controlled Department Routing
      ↓
Officer Review
      ↓
Assignment
      ↓
In Progress
      ↓
Resolution
      ↓
Citizen Update
      ↓
Closure
```

## 11. AI Responsibilities

AI handles: - Natural-language understanding - Complaint
classification - Entity extraction - Location extraction -
Multilingual/code-mixed understanding - Missing information detection -
Clarification generation - Ambiguity detection - Contradiction
detection - Severity/urgency/priority recommendation - Department
recommendation - Resolution recommendation - Citizen response
generation - Duplicate/similarity assistance - Incident clustering
assistance - Summarization - Trend/recurring issue intelligence -
Optional image/evidence understanding

## 12. Deterministic Responsibilities

Application code handles: - Authentication - Authorization - Database
writes - State transitions - SLA calculations - Escalation triggers -
Controlled department enum - Audit log integrity

## 13. Priority Model

Keep severity, urgency, sentiment and priority separate.

### P0 Critical/Emergency

Immediate safety risk.

Examples: - Live exposed electrical wire - Collapsed road/bridge - Open
manhole in dangerous/crowded location - Severe flooding with safety risk

### P1 High

Major service disruption/public impact.

Examples: - No water for multiple days - Sewage overflow - Major
electricity outage

### P2 Medium

Important but non-immediate.

Examples: - Broken streetlight - Missed garbage pickup - Moderate
pothole

### P3 Low

Routine maintenance/cosmetic issue.

### Emergency Rule

A critical safety case must not be blocked because location information
is incomplete.

Escalate/flag the safety risk and request location in parallel where
appropriate.

## 14. Missing Information

Missing information is category-aware.

Examples: - Water outage → location + duration - Pothole → exact
location/landmark - Streetlight/electrical → pole/location - Electrical
hazard → exact location + safety context

Ask only what is necessary.

## 15. Confidence and Uncertainty

Possible confidence behavior: - High → proceed - Medium → proceed +
flag - Low → clarification/human review

Never invent missing information.

Represent fields conceptually as: - KNOWN - INFERRED - MISSING -
RECOMMENDED - CONFIRMED

## 16. SLA

SLA is a deterministic workflow engine, not a visual countdown.

Demo policy:

  Priority      Response                     Resolution
  ---------- ----------- ------------------------------
  P0           Immediate   Immediate/Emergency handling
  P1             2 hours                       24 hours
  P2             8 hours                       48 hours
  P3            24 hours                         5 days

These are **demo policy values**, not claims about official municipal
policy.

Statuses: - Within SLA - Approaching / At Risk - Breached - Paused /
Awaiting Citizen - Resolved

## 17. Incident Intelligence

Multiple complaints can represent one underlying incident.

Example:

``` text
37 similar complaints
        ↓
Sector 5 Water Outage
        ↓
One incident
        ↓
37 linked complaints
```

Do not silently merge records. Use related/duplicate suggestions and
appropriate human confirmation for consequential merge decisions.

## 18. Multilingual Support

Support: - English - Hindi - Marathi - Hinglish - Marathi-English -
Hindi-English

Internal ticket data remains structured. Citizen responses should use
the citizen's preferred language when possible.

## 19. Image Processing

Image processing is optional.

If implemented: - Extract relevant evidence - Compare evidence with
text - Increase confidence when aligned - Flag contradictions when
evidence conflicts

Do not make image processing a hard dependency for the core complaint
workflow.

## 20. Security and Privacy

Required: - Backend RBAC - Authentication - Input validation - Audit
logging - PII minimization - Prompt injection resistance - Internal
dashboard protection

Citizen complaint text is untrusted input.

## 21. Architecture

Use a modular monolith:

``` text
Citizen Portal + Official Portal
             ↓
          FastAPI
             ↓
       AI Orchestrator
             ↓
 Understanding / Extraction / Validation
             ↓
 Priority / Routing / Resolution
             ↓
 Workflow + SLA
             ↓
 PostgreSQL / Supabase
             ↓
 Citizen / Department / Admin / Collector UIs
```

Do not introduce microservices unless explicitly approved.

## 22. Technology Stack

-   Frontend: Next.js + TypeScript
-   Styling: Tailwind CSS
-   Components: shadcn/ui
-   Backend: FastAPI + Python
-   AI: Gemini API
-   Database: PostgreSQL + Supabase
-   Maps: Leaflet + OpenStreetMap
-   Charts: Recharts
-   Auth: JWT/session + RBAC
-   Testing: Pytest + Playwright
-   Frontend deployment: Vercel
-   Backend deployment: Render
-   Version control: GitHub

## 23. Recommended Routes

Public:

``` text
/
/report
/track
/complaint/[id]
/how-it-works
/about
/login
```

Municipal Admin:

``` text
/admin
/admin/complaints
/admin/departments
/admin/departments/[department]
/admin/incidents
/admin/sla
/admin/analytics
/admin/map
/admin/escalations
```

Department:

``` text
/department
/department/complaints
/department/incidents
/department/sla
```

Collector:

``` text
/collector
/collector/critical
/collector/escalations
/collector/incidents
/collector/departments
/collector/analytics
/collector/map
```

## 24. Branding

Use **JanSetu AI** consistently everywhere: - Navbar - Login - Browser
title - Dashboards - README - Documentation - API docs - Demo data -
Presentation - Screenshots

Do not use old project names.

## 25. Primary Demo

Golden scenario:

Input: \> "There has been no water supply in our area for three days and
nobody is responding."

AI: - Water Supply - P1 High - Duration: 3 days - Location: Missing -
Partial actionability - Clarification required

Citizen: \> "Sector 5 near City Mall."

Then: - Location becomes actionable - Ticket routes to Water Supply -
SLA starts - Officer reviews - Officer acts - Citizen receives truthful
update - Related complaints form an incident - Collector can see the
incident if significant

## 26. Development Priority

Build in this order:

1.  Foundation
2.  Authentication/RBAC
3.  Complaint/ticket CRUD
4.  Gemini structured analysis
5.  Missing information + clarification
6.  Priority + routing
7.  SLA + escalation
8.  Department dashboard
9.  Municipal Admin dashboard
10. Collector dashboard
11. Duplicate/incident intelligence
12. Multilingual support
13. Map/analytics
14. Testing/polish/demo

The first complete vertical slice is more important than advanced
features.

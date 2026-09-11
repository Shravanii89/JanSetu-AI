# JanSetu AI — Design System & Visual Specification

## 1. Design Philosophy & Brand Identity

- **Brand Name**: JanSetu AI
- **Tagline**: *From Citizen Voice to Government Action*
- **Aesthetic Tone**: Modern Civic AI — Trustworthy, authoritative, clear, and technologically advanced. It combines the reassuring gravitas of an official municipal service with the responsive elegance of a modern AI SaaS platform.
- **Reference Clarification**: The provided Sewa Setu screenshot is used solely as a civic familiarity baseline (service clarity, multi-channel reach). JanSetu AI does *not* replicate its dense layout, legacy styling, or visual clutter. Instead, it features generous whitespace, modern typography, semantic color tokens, and AI-first visual indicators.

---

## 2. Typography System

Modern, highly legible typography designed for multilingual clarity (English, Marathi, Hindi).

- **Primary Heading Font**: `Inter` / `Outfit` (sans-serif, geometric-humanist, crisp rendering at display sizes).
- **Body & Data Font**: `Inter` / system-ui (balanced metrics, tabular numeral support for timestamps and metrics).
- **Type Scale**:
  - `Display (Hero)`: 48px / 1.15 line-height / Bold (700)
  - `H1`: 36px / 1.2 line-height / Semi-bold (600)
  - `H2`: 28px / 1.25 line-height / Semi-bold (600)
  - `H3`: 20px / 1.3 line-height / Medium (500)
  - `Body Large`: 18px / 1.5 line-height / Regular (400)
  - `Body Base`: 15px / 1.5 line-height / Regular (400)
  - `Caption / Meta`: 13px / 1.4 line-height / Medium (500)
  - `Micro / Badge`: 11px / 1.2 line-height / Semi-bold (600)

---

## 3. Color Palette & Semantic System

A curated, harmonious palette using HSL color tokens that reflect civic responsibility, urgency, and operational status.

### 3.1 Primary Brand Tokens
- **Civic Navy (Primary)**: `hsl(222, 47%, 18%)` — Deep authoritative navy representing government stability.
- **Setu Indigo (Accent)**: `hsl(224, 76%, 48%)` — Modern digital blue representing the AI bridge.
- **Civic Slate (Surface Dark)**: `hsl(215, 25%, 27%)` — Supporting text and structural borders.
- **Canvas White (Background)**: `hsl(0, 0%, 100%)` — Clean, open background.
- **Surface Muted (Card Fill)**: `hsl(210, 40%, 98%)` — Soft contrast for content cards.

### 3.2 Semantic Status & Priority Tokens
| Semantic Role | Token Name | Hex / HSL | Usage Context |
| :--- | :--- | :--- | :--- |
| **Emergency / P0** | `priority-p0` | `hsl(0, 84%, 60%)` / Crimson | Live wires, collapsed structures, flash flood warnings |
| **High / P1** | `priority-p1` | `hsl(24, 95%, 53%)` / Vibrant Orange | Major water outage, power blackout, sewage overflow |
| **Medium / P2** | `priority-p2` | `hsl(45, 93%, 47%)` / Amber | Potholes, broken streetlights, missed garbage pickup |
| **Low / P3** | `priority-p3` | `hsl(199, 89%, 48%)` / Sky Blue | Cosmetic maintenance, tree trimming |
| **Success / Resolved** | `status-resolved` | `hsl(142, 71%, 45%)` / Forest Green | Closed/resolved complaints, healthy SLA |
| **At Risk / Warning** | `sla-at-risk` | `hsl(38, 92%, 50%)` / Warning Yellow | SLA $\ge 75\%$ elapsed without action |
| **Breached / Danger** | `sla-breached` | `hsl(350, 89%, 60%)` / Rose Red | SLA deadline exceeded |

*Design Rule: Color is never used in isolation; all status badges pair semantic colors with clear text labels and explicit iconography.*

---

## 4. Spacing & Grid System

- **Base Grid Unit**: 4px.
- **Standard Scale**: `space-1 (4px)`, `space-2 (8px)`, `space-3 (12px)`, `space-4 (16px)`, `space-6 (24px)`, `space-8 (32px)`, `space-12 (48px)`, `space-16 (64px)`.
- **Layout Max-Widths**:
  - Public Citizen Portal: `max-w-6xl` (1152px) centered.
  - Official Dashboards: `max-w-[1600px]` with fluid responsive grids.
- **Border Radius**:
  - Cards & Panels: `rounded-xl` (12px).
  - Buttons & Inputs: `rounded-lg` (8px).
  - Badges & Pills: `rounded-full` (9999px).

---

## 5. Screen-by-Screen Layout Specifications

### 5.1 Public Citizen Landing Page (`/`)
1. **Header Navigation**:
   - Brand lockup: **JanSetu AI** + subtle state emblem / civic indicator.
   - Links: *Home*, *How It Works*, *Track Complaint*, *About*.
   - Right Control: Subtle, understated button: **Official Access** (navigates to `/login`).
2. **Hero Section**:
   - Headline: *"From Citizen Voice to Government Action"*.
   - Subtitle: *"Report civic problems in your own words. JanSetu AI understands your complaint, identifies what matters, routes it to the right department, and tracks resolution."*
   - Central Visual CTA: **Interactive Complaint Console** featuring a large multi-line input box, microphone button (voice input), camera button (photo evidence), and language selector (`English` | `मराठी` | `हिन्दी`).
3. **Live AI Transformation Demonstration**:
   - Interactive Before/After demonstration showing free-form input being parsed into:
     - Issue: Water Outage (Known)
     - Duration: 3 Days (Known)
     - Location: Missing (Actionable Prompt)
     - Priority: P1 High (Deterministic Rule)
     - Department: Water Supply Department
4. **Key Platform Metrics**: Transparent demo counters: *Grievances Processed*, *Average Resolution Time*, *SLA Compliance Rate*, *Active Civic Clusters*.
5. **How It Works (The 7-Step Civic Journey)**:
   `01 Report` $\rightarrow$ `02 Understand` $\rightarrow$ `03 Clarify` $\rightarrow$ `04 Route` $\rightarrow$ `05 Act` $\rightarrow$ `06 Track` $\rightarrow$ `07 Inform`.
6. **Controlled Department Coverage**: Visual grid of the 8 PMC operational departments (service showcases, *not* login links).
7. **Footer**: Accessibility statement, privacy policy, Pune civic disclaimer, Official Access link.

### 5.2 Unified Official Access (`/login`)
- **Visual Design**: Centered, distraction-free security card on a subtle geometric background.
- **Form Controls**:
  - Title: **Official Government Access**
  - Subtitle: *Pune Municipal Grievance & Resolution Infrastructure*
  - Input 1: **Employee ID / Official Email**
  - Input 2: **Password**
  - Primary Button: **Sign In to Portal**
  - Secondary Link: *Forgot Password / Contact IT Administrator*
- **Strict Rule**: **NO ROLE SELECTOR**. Zero buttons for "Admin", "Collector", or individual departments. The backend determines access.

### 5.3 Department Officer Dashboard (`/department`)
- **Header**: Displays the officer's verified department badge (e.g., *"Road Department — Ward 14"*).
- **Metric Ribbons**: Open Tickets, At Risk, Breached, Critical Cases, Resolved Today.
- **Split-View Ticket Console**:
  - *Left Pane*: Prioritized ticket queue with color-coded SLA countdowns and priority badges.
  - *Right Action Studio*:
    - Raw Citizen Grievance (with original audio playback if submitted via voice).
    - AI Reasoning Breakdown (extracted entities, confidence score, certainties).
    - Recommended Next Actions (standard operating procedures).
    - Officer Action Center: Status update dropdown, priority override dialog (requires reason), official citizen note box, and "Escalate" button.

### 5.4 Municipal Admin Command Center (`/admin`)
- **Navigation Bar**: Overview, Complaints, Departments, Incidents, SLA Monitor, Escalations, Analytics, Map.
- **City-Wide KPI Grid**: Total Complaints, Backlog Distribution, Breached SLAs, Critical Emergencies.
- **8-Department Workload Grid**: Cards showing each of the 8 departments with real-time open counts, average resolution times, and SLA health indicators. Clicking any card filters the view to `/admin/departments/[dept]`.
- **Re-Routing Interface**: Safe manual override for misclassified complaints with an mandatory audit logging modal.

### 5.5 Collector Intelligence Dashboard (`/collector`)
- **Visual Focus**: High-level strategic intelligence, systemic risk detection, and emergency oversight.
- **Executive Alert Banner**: Real-time counter of P0 emergencies and active SLA breaches.
- **Active Incident Clusters**: High-impact regional incidents (e.g., *"Sector 5 Water Outage — 37 linked complaints"*).
- **Inter-Department SLA Scorecard**: Comparative matrix ranking departments by compliance percentage and recurring backlog.
- **Systemic Failure Intelligence**: AI-detected recurring bottlenecks (e.g., recurring pipeline ruptures in Kothrud).

---

## 6. Feedback & State Architecture

- **Loading States**: Skeleton screens with shimmering pulse animation for cards and data tables; never unstyled blank screens.
- **Error States**: Clear, human-readable error messages with suggested remediation (e.g., *"Unable to reach JanSetu servers. Please check your internet connection or retry in a few moments."*).
- **Empty States**: Encouraging, clean illustrations for zero-ticket queues (e.g., *"No tickets awaiting action in Road Department. All SLAs are currently healthy."*).

# 03 — Proposed Solution: JanSetu AI Architecture & Workflow

## 1. Product Concept
JanSetu AI is an AI-powered civic operations platform designed around the foundational principle:
> **"AI decides what the complaint means. Rules decide what the system is allowed to do. Humans decide consequential operational actions."**

## 2. Core Pillars of the Solution
1. **Intelligent Multimodal Intake**: Citizens articulate grievances in their own words via text, voice recording, or photos in their preferred language.
2. **Deterministic Governance & Controlled Routing**: The AI classifies complaints strictly into eight allowed PMC departments (`WATER_SUPPLY`, `ELECTRICITY`, `PUBLIC_HEALTH`, `WASTE_MANAGEMENT`, `PUBLIC_PROPERTY_MANAGEMENT`, `GARDEN`, `ROAD`, `ENCROACHMENT`) or `OTHER_HUMAN_REVIEW`.
3. **Safety-First Priority Engine**: Decouples citizen sentiment from operational priority. Imminent safety hazards (e.g., exposed live electrical wires) trigger immediate **P0 Emergency** escalation without waiting for complete location data.
4. **Transparent SLA Engine**: Deterministic calculation of response and resolution deadlines per priority tier with automated escalation triggers.
5. **Unified Official Access**: Single entry point `/login` with zero role selectors. Post-login routing is determined cryptographically by the backend.

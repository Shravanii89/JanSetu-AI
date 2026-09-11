# 02 — Research & Existing Systems Review

## 1. Analysis of Current Civic Portals
Existing grievance portals in India (such as CPGRAMS, PMC Care, Sewa Setu, and municipal WhatsApp bots) reveal consistent trade-offs:
- **Traditional Form-Heavy Portals (e.g., CPGRAMS, State Grievance Portals)**:
  - Require citizens to select complex department hierarchies, ward numbers, and scheme categories before submitting.
  - Suffer from high drop-off rates due to cognitive burden and terminology confusion.
- **Conversational Chatbots (e.g., Municipal WhatsApp Bots)**:
  - Often operate as rigid decision trees ("Press 1 for Water, Press 2 for Tax").
  - Fail when a complaint does not match rigid keywords or involves multiple overlapping issues.
  - Cannot extract contextual certainty or detect missing information interactively.

## 2. JanSetu AI Differentiator
JanSetu AI bridges form rigidity and conversational ambiguity:
- Free-form multimodal intake (natural voice/text in Marathi, Hindi, English).
- Structured entity extraction with certainty tracking (`KNOWN`, `INFERRED`, `MISSING`).
- Minimal, category-aware clarification dialogue asking only what is needed.
- Deterministic routing to strictly controlled departments with zero hallucinated categories.

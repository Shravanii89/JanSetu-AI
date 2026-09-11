# JanSetu AI — Technical Specification & Coding Standards

## 1. Technology Stack & Framework Matrix

| Layer | Technology | Version / Standard | Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | 15.x / React 19 | Server-side rendering, SEO, native routing, modern API handling |
| **Frontend Language** | TypeScript | 5.x (Strict mode) | Type safety, eliminated runtime null references |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first, semantic design token support, zero CSS bloat |
| **UI Primitives** | shadcn/ui (Radix UI) | Latest | Accessible, headless, fully customizable component base |
| **Visualizations** | Recharts | 2.x | High-performance React charting with clean SVG rendering |
| **Mapping** | Leaflet / react-leaflet | 1.9+ | Lightweight, open-source mapping without proprietary API lock-in |
| **Backend Framework** | FastAPI | 0.115+ | High performance, native async, automatic OpenAPI documentation |
| **Backend Language** | Python | 3.11+ / 3.14 compatible | Clean ecosystem for AI orchestration and data processing |
| **ORM / Database** | SQLAlchemy | 2.0+ (async) | Mature declarative mapping, migration support via Alembic |
| **Schema Validation** | Pydantic | 2.x | Blazing-fast Rust-based data validation and JSON schema export |
| **AI Model API** | Google Gemini API | `gemini-1.5-flash` | Multimodal, multilingual, high speed, native structured outputs |
| **Database** | PostgreSQL | 15+ (Supabase) | ACID compliance, JSONB querying, spatial indexing support |

---

## 2. Coding & Architectural Standards

### 2.1 Backend Conventions (Python)
- **Formatting & Linting**: Follow PEP 8 style guidelines.
- **Type Annotations**: All function signatures must include explicit type hints (`def process_ticket(ticket_id: UUID) -> TicketResponse:`).
- **Async Execution**: I/O operations (database queries, external API calls) must be `async/await`.
- **Pure Business Rules**: Business rules in `app/rules/` must be pure functions with zero database or network side-effects.

### 2.2 Frontend Conventions (TypeScript / React)
- **Strict TypeScript**: `noImplicitAny: true`, `strictNullChecks: true`.
- **Component Architecture**: Prefer Server Components by default; use `"use client"` only for interactive components with local state or browser APIs.
- **Naming Conventions**:
  - Components: PascalCase (`TicketCard.tsx`)
  - Utilities & hooks: camelCase (`useAuth.ts`, `formatDate.ts`)
  - Constants: UPPER_SNAKE_CASE (`DEMO_SLA_POLICY`)

---

## 3. API Conventions & Standards

### 3.1 URI Design
- All REST endpoints are prefixed with `/api/v1`.
- Plural nouns for resource collections: `/api/v1/officer/tickets`, `/api/v1/admin/departments`.
- Sub-resources for associated actions: `/api/v1/public/complaints/{id}/clarify`.

### 3.2 Standard Envelope & Error Structure
Successful responses return directly or wrapped in data payloads. Error responses follow RFC 7807 problem details:

```json
{
  "error": {
    "code": "DEPARTMENT_ACCESS_DENIED",
    "message": "Officer is not authorized to access tickets from WATER_SUPPLY",
    "details": {
      "user_department": "ROAD",
      "target_department": "WATER_SUPPLY"
    },
    "timestamp": "2026-09-11T13:40:00Z"
  }
}
```

---

## 4. Error Handling & Logging

- **Centralized Exception Handlers**: Global FastAPI exception handlers intercept `HTTPException`, `RequestValidationError`, and custom domain exceptions (`TicketStateError`, `RBACPermissionDenied`).
- **Structured Logging**: Logs are output in structured format (timestamp, level, module, correlation_id, message).
- **Zero Logged Secrets**: PII and secrets (passwords, tokens, Gemini API keys) are strictly redacted before output.

---

## 5. Security & Validation Directives

1. **Untrusted Input**: All citizen input is treated as hostile. Text is sanitized against cross-site scripting (XSS) and SQL injection (handled via SQLAlchemy parameterized queries).
2. **Prompt Injection Defense**: Citizen text is passed to Gemini enclosed in `<citizen_text>` delimiters with rigid instructions preventing prompt override.
3. **No Frontend Security Reliance**: Route guards on Next.js provide UX navigation convenience only; every protected API call re-validates JWT signature, role, and department authorization.
4. **Environment Hygiene**: No production credentials in `.env.example`. Real secrets exist only in runtime environments or local untracked `.env` files.

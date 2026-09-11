# 05 — Technology Stack & Selection Justification

| Layer | Component | Choice | Justification |
| :--- | :--- | :--- | :--- |
| **Frontend** | Framework | Next.js 15 (App Router) | Server-side rendering, SEO, nested layouts, rapid UI development |
| **Frontend** | Language | TypeScript 5 (Strict) | Compile-time type safety, eliminated null pointer runtime errors |
| **Frontend** | Styling | Tailwind CSS | Utility-first, zero runtime CSS bloat, semantic design token support |
| **Frontend** | Components | shadcn/ui (Radix UI) | Headless, accessible, customizable UI primitives |
| **Frontend** | Visualization | Recharts | Performant SVG-based charting for municipal analytics |
| **Frontend** | Maps | Leaflet / react-leaflet | Open-source, lightweight mapping with OpenStreetMap tiles |
| **Backend** | Framework | FastAPI | Asynchronous performance, native OpenAPI documentation, Pydantic v2 |
| **Backend** | Language | Python 3.11+ / 3.14 | Rich ecosystem for AI orchestration and data processing |
| **Backend** | ORM | SQLAlchemy 2.0 (async) | Mature declarative relational mapping, transactional integrity |
| **Database** | RDBMS | PostgreSQL (Supabase) | Robust relational modeling, JSONB document querying, spatial support |
| **AI** | Foundation LLM | Google Gemini API | Multimodal, multilingual, high-speed, native structured outputs |
| **Testing** | Automated Suites | Pytest & Playwright | Full test pyramid coverage from pure unit logic to end-to-end user flows |

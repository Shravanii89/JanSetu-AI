# JanSetu AI — Database Schema Specification

This document details the PostgreSQL schema for JanSetu AI. All primary keys utilize UUIDs (or standard VARCHAR identifiers for fixed reference tables like departments).

---

## 1. Custom PostgreSQL Enums

```sql
CREATE TYPE user_role AS ENUM (
    'CITIZEN',
    'MUNICIPAL_ADMIN',
    'DEPARTMENT_OFFICER',
    'COLLECTOR'
);

CREATE TYPE department_code AS ENUM (
    'WATER_SUPPLY',
    'ELECTRICITY',
    'PUBLIC_HEALTH',
    'WASTE_MANAGEMENT',
    'PUBLIC_PROPERTY_MANAGEMENT',
    'GARDEN',
    'ROAD',
    'ENCROACHMENT',
    'OTHER_HUMAN_REVIEW'
);

CREATE TYPE ticket_priority AS ENUM ('P0', 'P1', 'P2', 'P3');

CREATE TYPE ticket_status AS ENUM (
    'NEW',
    'AI_ANALYZED',
    'NEEDS_CLARIFICATION',
    'READY_FOR_ROUTING',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED',
    'DUPLICATE',
    'SPAM',
    'REJECTED',
    'ESCALATED',
    'SLA_BREACHED',
    'AWAITING_CITIZEN'
);

CREATE TYPE sla_status AS ENUM (
    'WITHIN_SLA',
    'AT_RISK',
    'BREACHED',
    'PAUSED',
    'RESOLVED'
);

CREATE TYPE confidence_level AS ENUM ('HIGH', 'MEDIUM', 'LOW');

CREATE TYPE data_certainty AS ENUM (
    'KNOWN',
    'INFERRED',
    'MISSING',
    'RECOMMENDED',
    'CONFIRMED'
);

CREATE TYPE actor_type AS ENUM (
    'CITIZEN',
    'OFFICER',
    'MUNICIPAL_ADMIN',
    'COLLECTOR',
    'AI',
    'SYSTEM'
);
```

---

## 2. Table Definitions & Constraints

### 2.1 `departments` (Controlled Taxonomy)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PRIMARY KEY | Department code enum value (e.g., `WATER_SUPPLY`) |
| `name` | VARCHAR(150) | NOT NULL | Official name (e.g., "Water Supply Department") |
| `description` | TEXT | NULL | Operational mandate and jurisdiction |
| `contact_email`| VARCHAR(150)| NULL | Administrative contact address |
| `is_active` | BOOLEAN | NOT NULL DEFAULT TRUE | Soft-disable switch |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Record creation timestamp |

### 2.2 `users` (Official Staff Accounts)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Unique user identifier |
| `employee_id` | VARCHAR(50) | UNIQUE, NULL | Government ID (e.g., `PMC-WAT-104`) |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Official municipal email |
| `password_hash`| VARCHAR(255)| NOT NULL | Bcrypt hash |
| `full_name` | VARCHAR(150) | NOT NULL | Full name of official |
| `role` | `user_role` | NOT NULL | One of: `MUNICIPAL_ADMIN`, `DEPARTMENT_OFFICER`, `COLLECTOR` |
| `department_id`| VARCHAR(50) | REFERENCES departments(id), NULL | Assigned department (mandatory for `DEPARTMENT_OFFICER`) |
| `phone` | VARCHAR(20) | NULL | Contact phone number |
| `is_active` | BOOLEAN | NOT NULL DEFAULT TRUE | Account status flag |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Last update timestamp |

*Indexes*: `CREATE INDEX idx_users_email ON users(email);`  
`CREATE INDEX idx_users_role_dept ON users(role, department_id);`

### 2.3 `complaints` (Citizen Ingestion Record)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Internal complaint UUID |
| `tracking_number`| VARCHAR(30) | UNIQUE, NOT NULL | Public tracking ID (`JS-YYYY-LOC-XXXXX`) |
| `citizen_name` | VARCHAR(150) | NULL | Optional citizen name |
| `citizen_phone`| VARCHAR(20) | NULL | Optional citizen contact |
| `preferred_language`| VARCHAR(10)| NOT NULL DEFAULT 'en' | 'en', 'mr', 'hi' |
| `raw_text` | TEXT | NOT NULL | Untrusted citizen input |
| `input_channel`| VARCHAR(20) | NOT NULL DEFAULT 'WEB' | 'WEB', 'VOICE', 'IMAGE' |
| `audio_url` | VARCHAR(500) | NULL | Link to voice recording blob |
| `image_url` | VARCHAR(500) | NULL | Link to uploaded photographic evidence |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Timestamp of submission |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Timestamp of last update |

*Indexes*: `CREATE UNIQUE INDEX idx_complaints_tracking ON complaints(tracking_number);`

### 2.4 `incidents` (Clustered Civic Events)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Incident UUID |
| `incident_number`| VARCHAR(30)| UNIQUE, NOT NULL | Incident code (`INC-YYYY-XXXX`) |
| `title` | VARCHAR(255) | NOT NULL | Human-readable title (e.g., "Sector 5 Water Outage") |
| `description` | TEXT | NULL | Synthesized incident description |
| `department_id`| VARCHAR(50) | REFERENCES departments(id) | Assigned department |
| `severity` | `ticket_priority`| NOT NULL | Highest severity among clustered complaints |
| `status` | VARCHAR(50) | NOT NULL DEFAULT 'DETECTED'| 'DETECTED', 'VERIFIED', 'RESOLVED' |
| `location_name`| VARCHAR(255) | NOT NULL | Normalized location / ward |
| `latitude` | NUMERIC(9,6)| NULL | Geocoded centroid |
| `longitude` | NUMERIC(9,6)| NULL | Geocoded centroid |
| `complaint_count`| INT | NOT NULL DEFAULT 1 | Total linked complaints |
| `first_reported_at`| TIMESTAMPTZ| NOT NULL | Oldest linked complaint time |
| `last_activity_at`| TIMESTAMPTZ| NOT NULL | Most recent linked complaint time |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Detection timestamp |

### 2.5 `tickets` (Operational Service Unit)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Unique ticket UUID |
| `complaint_id` | UUID | UNIQUE, NOT NULL REFERENCES complaints(id) ON DELETE CASCADE | Associated grievance |
| `department_id`| VARCHAR(50) | NOT NULL REFERENCES departments(id) | Controlled department |
| `assigned_officer_id`| UUID | REFERENCES users(id), NULL | Operational assignee |
| `incident_id` | UUID | REFERENCES incidents(id), NULL | Clustered incident parent |
| `status` | `ticket_status`| NOT NULL DEFAULT 'NEW' | Current lifecycle status |
| `priority` | `ticket_priority`| NOT NULL DEFAULT 'P2' | Enforced operational priority |
| `severity` | `ticket_priority`| NOT NULL | Inherent hazard score |
| `urgency` | `ticket_priority`| NOT NULL | Time sensitivity score |
| `sentiment_score`| FLOAT | NOT NULL DEFAULT 0.0 | Sentiment (-1.0 to 1.0) |
| `issue_summary`| VARCHAR(255) | NOT NULL | Structured issue title |
| `category` | VARCHAR(100) | NOT NULL | Normalized category |
| `location_name`| VARCHAR(255) | NULL | Normalized location |
| `ward` | VARCHAR(100) | NULL | Pune ward name / number |
| `latitude` | NUMERIC(9,6)| NULL | Verified latitude |
| `longitude` | NUMERIC(9,6)| NULL | Verified longitude |
| `is_emergency` | BOOLEAN | NOT NULL DEFAULT FALSE | P0 bypass flag |
| `is_escalated` | BOOLEAN | NOT NULL DEFAULT FALSE | True if escalated to Admin/Collector |
| `escalation_reason`| TEXT | NULL | Reason for escalation |
| `resolution_notes`| TEXT | NULL | Officer closure comments |
| `resolved_at` | TIMESTAMPTZ | NULL | Timestamp of resolution |
| `closed_at` | TIMESTAMPTZ | NULL | Timestamp of formal closure |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Timestamp of creation |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Timestamp of update |

*Indexes*:  
`CREATE INDEX idx_tickets_dept_status ON tickets(department_id, status);`  
`CREATE INDEX idx_tickets_priority ON tickets(priority);`  
`CREATE INDEX idx_tickets_incident ON tickets(incident_id);`

### 2.6 `ai_analyses` (AI Extraction Snapshot)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Analysis UUID |
| `complaint_id` | UUID | UNIQUE, NOT NULL REFERENCES complaints(id) ON DELETE CASCADE | Target complaint |
| `detected_language`| VARCHAR(20)| NOT NULL | Detected language |
| `extracted_issue`| VARCHAR(255)| NOT NULL | Extracted problem summary |
| `extracted_location`| VARCHAR(255)| NULL | Extracted landmark/area |
| `extracted_duration`| VARCHAR(100)| NULL | Extracted duration |
| `recommended_department`| VARCHAR(50)| NOT NULL REFERENCES departments(id) | Suggested department |
| `recommended_priority`| `ticket_priority`| NOT NULL | Suggested priority |
| `recommended_actions`| JSONB | NOT NULL DEFAULT '[]' | SOP recommendation steps |
| `actionability_score`| FLOAT | NOT NULL | 0.0 to 1.0 readiness |
| `missing_fields`| JSONB | NOT NULL DEFAULT '[]' | Missing essential entities |
| `clarification_questions`| JSONB| NOT NULL DEFAULT '[]' | Suggested clarification prompts |
| `confidence_score`| FLOAT | NOT NULL | 0.0 to 1.0 confidence |
| `confidence_level`| `confidence_level`| NOT NULL | HIGH, MEDIUM, LOW |
| `field_certainties`| JSONB | NOT NULL DEFAULT '{}' | Certainty per entity map |
| `citizen_response_draft`| TEXT | NOT NULL | Polite draft in citizen's language |
| `image_analysis`| JSONB | NULL | Visual evidence verification notes |
| `raw_model_response`| JSONB | NOT NULL | Immutable raw Gemini payload |
| `model_version`| VARCHAR(50) | NOT NULL | Model identifier |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Timestamp |

### 2.7 `slas` (Deterministic SLA Tracking)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | SLA tracking UUID |
| `ticket_id` | UUID | UNIQUE, NOT NULL REFERENCES tickets(id) ON DELETE CASCADE | Associated ticket |
| `priority` | `ticket_priority`| NOT NULL | Inherited ticket priority |
| `response_deadline`| TIMESTAMPTZ| NOT NULL | Calculated response time |
| `resolution_deadline`| TIMESTAMPTZ| NOT NULL | Calculated resolution time |
| `responded_at` | TIMESTAMPTZ | NULL | Timestamp of first official action |
| `resolved_at` | TIMESTAMPTZ | NULL | Timestamp of resolution |
| `status` | `sla_status` | NOT NULL DEFAULT 'WITHIN_SLA' | Current SLA status |
| `is_paused` | BOOLEAN | NOT NULL DEFAULT FALSE | True if awaiting citizen clarification |
| `paused_at` | TIMESTAMPTZ | NULL | Timestamp when paused |
| `total_paused_minutes`| INT | NOT NULL DEFAULT 0 | Accumulated pause duration |
| `breached_at` | TIMESTAMPTZ | NULL | Timestamp of deadline breach |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | SLA creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Last evaluation timestamp |

### 2.8 `clarification_messages` (Interactive Intake Loop)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Message UUID |
| `complaint_id` | UUID | NOT NULL REFERENCES complaints(id) ON DELETE CASCADE | Associated complaint |
| `sender_type` | `actor_type`| NOT NULL | AI, OFFICER, or CITIZEN |
| `question` | TEXT | NOT NULL | Clarification request |
| `answer` | TEXT | NULL | Citizen's response |
| `requested_field`| VARCHAR(100)| NULL | Missing entity (e.g., 'location') |
| `answered_at` | TIMESTAMPTZ | NULL | Timestamp of citizen answer |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Question timestamp |

### 2.9 `status_histories` (State Machine Log)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | History record UUID |
| `ticket_id` | UUID | NOT NULL REFERENCES tickets(id) ON DELETE CASCADE | Associated ticket |
| `from_status` | `ticket_status`| NULL | Previous status |
| `to_status` | `ticket_status`| NOT NULL | New status |
| `changed_by_user_id`| UUID | REFERENCES users(id), NULL | Actor user ID |
| `changed_by_role`| `user_role`| NULL | Actor role |
| `reason` | VARCHAR(255)| NULL | Status transition justification |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Timestamp |

### 2.10 `audit_logs` (Immutable Regulatory Audit Trail)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Audit record UUID |
| `entity_name` | VARCHAR(50) | NOT NULL | 'ticket', 'complaint', 'incident', 'sla' |
| `entity_id` | VARCHAR(50) | NOT NULL | Target entity UUID string |
| `action` | VARCHAR(100)| NOT NULL | E.g., 'CREATED', 'REROUTED', 'PRIORITY_CHANGED' |
| `actor_type` | `actor_type`| NOT NULL | CITIZEN, OFFICER, MUNICIPAL_ADMIN, COLLECTOR, AI, SYSTEM |
| `actor_id` | VARCHAR(50) | NULL | Actor ID |
| `previous_state`| JSONB | NULL | State snapshot before change |
| `new_state` | JSONB | NULL | State snapshot after change |
| `ip_address` | VARCHAR(45) | NULL | Client IP |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Immutable timestamp |

# WTI Labour Mobility System — Full Implementation & Windsurf Execution Document (Markdown)

## Table of contents
1. [Introduction & Scope](#introduction--scope)
2. [SRS Compliance Rules (non-negotiable)](#srs-compliance-rules-non-negotiable)
3. [Preservation Notice — Auth & Login](#preservation-notice--auth--login)
4. [Landing Page — PIXEL-PERFECT Implementation (NON-NEGOTIABLE)](#landing-page--pixel-perfect-implementation-non-negotiable)
5. [Dashboard Updates (All Roles) — visual & data requirements](#dashboard-updates-all-roles--visual--data-requirements)
6. [Frontend Structure & Routing (React + MUI)](#frontend-structure--routing-react--mui)
7. [Backend Requirements (Node/Express) — summary](#backend-requirements-nodeexpress--summary)
8. [Database Schema (Suggested)](#database-schema-suggested)
9. [API Endpoints (RESTful) — /api/v1 prefix](#api-endpoints-restful--apiv1-prefix)
10. [Modules & Workflows from the SRS](#modules--workflows-from-the-srs)
11. [Notifications, Payments & Scheduled Jobs](#notifications-payments--scheduled-jobs)
12. [Tests & QA Requirements](#tests--qa-requirements)
13. [Deliverables & PR Standards](#deliverables--pr-standards)
14. [Non-Negotiable UI Text & Copy Rules](#non-negotiable-ui-text--copy-rules)
15. [Full Windsurf Prompt (COPY-PASTE READY)](#full-windsurf-prompt-copy-paste-ready)
16. [Final Notes & Acceptance Criteria](#final-notes--acceptance-criteria)

---

## Introduction & Scope
This document instructs Windsurf (or developers) to integrate the WTI Labour Mobility SRS into the existing codebase with the following constraints:

- The app uses React frontend and Node/Express backend.
- Passport.js + Google OAuth are implemented — do not change them.
- Use MUI (Material UI) for all new frontend components, pages, and dashboards.
- Implement a pixel-perfect landing page as defined in the SRS and update dashboards for all roles to the SRS design and fields.
- The landing page primary CTA must navigate directly to `/apply` (no intermediate mini-form).
- Provide DB migrations, API endpoints, frontend pages, tests, screenshots, and PR-ready artifacts.

## SRS Compliance Rules (NON-NEGOTIABLE)
- **Exact copy:** All UI labels, button text, checkbox text, section headings and declaration text must match the SRS letter-for-letter. Do not paraphrase.
- **Landing page pixel-copy:** Landing page layout, section order and copy must match SRS exactly.
- **Tenant scoping:** Add `tenant_id` on all tenant-scoped tables and enforce tenant isolation in business logic.
- **Auth preserved:** Do not modify or remove existing Passport/Google auth files or flows. Add role mapping hooks only.
- **Migrations are safe:** Use ALTER ADD COLUMN; do not drop existing auth tables. Provide rollback scripts.
- **Deliver PR notes:** If any deviation is necessary, document it clearly in the PR description — do not change SRS copy without approval.

## Preservation Notice — Auth & Login
- Do not edit existing login and registration pages.
- Add an endpoint `/api/v1/users/ensure-role` to map social login users to users table and assign roles/tenant if missing. This call must not change existing auth behavior for active users.
- Implement middleware but ensure the existing Passport.js strategies and Google OAuth callbacks remain intact and fully functional.

## Landing Page — PIXEL-PERFECT Implementation (NON-NEGOTIABLE)
**Route:** `/` (public)

**Primary CTA behavior:** `Apply Now` navigates directly to `/apply`. No mini-form.

### Design & Copy Rules (MUI components)
- Implement with MUI components: `AppBar`, `Container`, `Grid`, `Card`, `Typography`, `Button`, `Avatar`, `Box`.
- Use `ThemeProvider` and support tenant branding via theme overrides (`palette.primary.main = tenant_brand_color`).
- Follow SRS section order exactly. All text must be verbatim from SRS.

### Landing sections (in order, verbatim content from SRS)
1. **Hero**
   - Headline: `[Use exact SRS headline]`
   - Subheadline: `[SRS subheading]`
   - Buttons: Primary `Apply Now`; Secondary `Sign In`
   - Hero image: placeholder `landing_hero_wti.png` if no asset; include alt text matching SRS
   - Quick bullets: exact SRS bullets under hero
2. **How It Works / Features** — recreate step boxes (titles + descriptions) exactly.
3. **Pilot / About** — include the pilot paragraph verbatim and a card: `"Pilot Partner: Waterfront Training Institute — trains up to 500 per intake"`
4. **Modules Overview** — cards for Candidate Registration, Course Management, Vetting & Placement, Agent/Broker Management, Analytics (use SRS one-line descriptions verbatim).
5. **Callouts & Metrics** — numeric cards including at least:
   - `150 trainees per intake` (verbatim)
   - `Up to 500 capacity` (verbatim)
   - `Placement rate` — placeholder %
6. **Testimonials / Acknowledgement** — include SRS acknowledgment text verbatim.
7. **Footer** — Contact details & quick links (About, Contact, Apply, Sign In) using SRS copy.

### Accessibility & SEO
- Semantic HTML, `aria-label`s for interactive elements, keyboard navigable, descriptive alt text.
- Meta tags: title, description, `og:title`, `og:description`, `og:image`, canonical.
- JSON-LD structured data for Organization & WebSite using tenant values.

### Analytics
- Placeholder analytics events: `landing_view` (page load), `apply_click` (CTA). Use console hooks if no real analytics key.

### QA & Screenshots
- Add Cypress tests to confirm hero headline presence and CTA navigation to `/apply`.
- Save screenshots under `/docs/screenshots/landing/`:
  - `landing_desktop.png` (1280×720)
  - `landing_tablet.png` (768×1024)
  - `landing_mobile.png` (375×812)
- Add `landing-copy.txt` in repo root containing landing copy verbatim from SRS.

## Dashboard Updates (All Roles) — visual & data requirements
Use MUI `DataGrid`, Cards, Charts (e.g., Recharts or chart library of choice), `AppBar` + `Drawer`.

### 5.1 Admin Dashboard (`/admin/dashboard`)
- Cards: Total Registered Candidates, Active Courses, Agents & Brokers Summary, Placement Rate (%), Revenue Summary.
- Quick Links: Add User, Manage Courses, Reports.
- Charts: placements by month, trainees per intake.
- Notifications / Tasks widget: show items like `“3 candidates pending vetting”`.
- Buttons: `"Add New Agent"`, `"Add Broker"`, `"View Statement"`.
- Admin pages: `/admin/users`, `/admin/settings`, `/admin/tenants`, `/admin/audit`, `/admin/reports`.

### 5.2 Trainer Dashboard (`/trainer/*`)
- Course list, ability to open attendance for each course.
- Attendance tracker: table (Name, ID, Status, Comments) with mark present/absent/late.
- Assessments: mark tests, add trainer comments, set pass/fail.
- Certificate generator: generate PDF with QR and download option.

### 5.3 Candidate Dashboard (`/candidate/dashboard`)
- My Courses with progress bars (e.g., `"10/14 days complete"`).
- Upcoming classes, next class date/time.
- Placement overview page: progress bar (Training → Vetting → Interview → Visa → Travel).
- Buttons to download Offer Letter, Visa Copy, Training Certificate (if available).
- Profile & document upload page exactly per SRS wording.

### 5.4 Agent Dashboard (`/agent/dashboard`)
- Profile summary with Agent Code and joined date.
- `"My Candidates"` list with pipeline statuses.
- Fee summary (Paid / Pending), Downloadable receipts/invoices.
- Intake calendar / timeline, quick add candidate.

### 5.5 Broker Dashboard (`/broker/dashboard`)
- Referred Candidates list with statuses and commission tracker (Paid / Pending).
- Notifications panel and total commissions earned summary.

### 5.6 Recruiter Dashboard (`/recruiter/*`)
- Employer view of candidate pipeline, interview scheduling, and placement offers.

## Frontend Structure & Routing (React + MUI)
- Top-level routing (React Router v6 suggested):
  - `/` — Landing (public)
  - `/apply` — Candidate Application (public)
  - `/about` — About UMA-APP
  - `/contact` — Contact page
  - `/auth/login` — existing login (do not change)
  - `/admin/*` — Admin routes
  - `/trainer/*` — Trainer routes
  - `/candidate/*` — Candidate routes
  - `/agent/*` — Agent routes
  - `/broker/*` — Broker routes
  - `/recruiter/*` — Recruiter routes

### Shared layout components
- `TopNav` (MUI `AppBar`): notifications bell, user menu
- `SideNav` (MUI `Drawer`): tenant branding, navigation links
- `PageContainer` (MUI `Container`/`Box`): page spacing
- `DataGrid` wrappers for lists
- `FileUploader` component with progress bar and preview
- `QRCode` generator component for certificates
- `PDFViewer` page/component for certificates/offers

### Theme & Branding
- Use MUI `ThemeProvider` and read tenant branding from `/api/v1/tenants` or a settings endpoint. Theme should apply primary color and logo.

### Form & Validation
- Use `react-hook-form` (recommended) with client-side validation matching backend rules. Ensure declaration checkbox is required.

## Backend Requirements (Node/Express) — summary
- Preserve existing Passport.js and Google OAuth routes and strategies.
- Add middleware:
  - `ensureAuthenticated`
  - `ensureTenant`
  - `ensureRole(role)`
  - `checkPermission(permission)`
- Implement RESTful controllers for candidates, courses, enrollments, attendance, assessments, certificates, vetting, placements, agents, brokers, payments, notifications, audit logs.
- Use `multer` (or equivalent) for file uploads. Store files in object storage or local `uploads/` (configurable via env).
- Implement certificate PDF generation (e.g., `pdfkit`, `Puppeteer`, or similar) and generate QR code linking to `/api/v1/certificates/verify/:code`.
- Implement export endpoints for CSV / XLSX (use `exceljs` or `papaparse`).
- Use transactions around multi-step operations (e.g., placing a candidate and computing commissions).
- Safety in DB changes:
  - Use safe ALTER TABLE migrations (do not drop or rename existing auth columns).
  - Add new columns only as necessary (`role_id`, `tenant_id`, `auth_provider`, `auth_id`).

## Database Schema (Suggested)
All tables that hold tenant data must include `tenant_id`. Use appropriate data types for your DB (UUID or serial).
A compact table list (columns shown are representative; include `created_at` and `updated_at` where applicable):

- **users**
  - `id`, `tenant_id`, `name`, `email`, `phone`, `auth_provider`, `auth_id`, `role_id`, `status`, `last_login`, `two_factor_enabled`, `created_at`, `updated_at`
- **roles**
  - `id`, `tenant_id`, `name`, `permissions` (json), `created_at`, `updated_at`
- **tenants**
  - `id`, `name`, `code`, `branding` (json), `contact_info` (json), `created_at`
- **candidates**
  - `id`, `tenant_id`, `user_id`, `full_name`, `gender`, `dob`, `national_id_passport`, `county`, `marital_status`, `highest_education`, `languages` (json), `relevant_skills`, `profile_photo_url`, `passport_copy_url`, `id_copy_url`, `supporting_certificates` (json), `previous_employer`, `previous_role`, `previous_duration`, `reference_contact` (json), `applying_via_agent` (bool), `agent_id`, `referred_by_broker` (bool), `broker_id`, `fee_agreement_confirmed` (bool), `medical_clearance_url`, `police_clearance_url`, `language_test_score`, `interview_status`, `preferred_country`, `job_type_preference`, `willing_to_relocate` (bool), `declaration_confirmed` (bool)
- **courses**
  - `id`, `tenant_id`, `title`, `code`, `category`, `description`, `duration_days`, `start_date`, `end_date`, `trainers` (json array of user ids), `capacity`, `location`, `status`
- **enrollments**
  - `id`, `tenant_id`, `course_id`, `candidate_id`, `application_id`, `enrollment_date`, `payment_status`, `agent_id`, `admission_status`
- **attendance_records**
  - `id`, `tenant_id`, `course_id`, `enrollment_id`, `date`, `session_number`, `status`, `remarks`, `recorded_by_user_id`
- **assessments**
  - `id`, `tenant_id`, `course_id`, `enrollment_id`, `assessment_type`, `score`, `result_category`, `trainer_comments`, `date`
- **certificates**
  - `id`, `tenant_id`, `certificate_no`, `enrollment_id`, `trainee_name`, `course_title`, `completion_date`, `trainer_name`, `signature_data`, `pdf_url`, `verification_code`
- **vetting_records**
  - `id`, `tenant_id`, `candidate_id`, `police_clearance_no`, `police_document_url`, `medical_report_no`, `medical_report_url`, `medical_status`, `vaccination_proof_url`, `language_test_passed`, `interview_readiness_checklist`, `verification_officer_user_id`, `vetting_status`, `reviewed_by`, `review_date`, `comments`
- **placements**
  - `id`, `tenant_id`, `candidate_id`, `recruiting_agency`, `job_role_offered`, `country`, `employer_name`, `interview_date`, `interview_result`, `offer_letter_url`, `visa_application_no`, `visa_status`, `travel_date`, `flight_details`, `recruitment_officer_id`, `training_fee_balance`, `agent_commission`, `broker_fee`, `contract_uploaded`, `placement_status`, `placement_completed_date`
- **agents**
  - `id`, `tenant_id`, `name`, `agent_code`, `contact_person`, `email`, `phone`, `address`, `country`, `id_or_business_cert_url`, `date_joined`, `fee_per_candidate`, `payment_terms`, `discount_rate`, `payment_method`
- **brokers**
  - `id`, `tenant_id`, `name`, `broker_code`, `contact_details`, `referrer_type`, `date_joined`, `commission_type`, `commission_amount`, `payment_terms`
- **payments**
  - `id`, `tenant_id`, `reference_no`, `payer_id`, `type`, `amount`, `currency`, `method`, `status`, `metadata` (json), `invoice_pdf_url`, `created_at`
- **audit_logs**
  - `id`, `tenant_id`, `user_id`, `action`, `module`, `details` (json), `ip_address`, `timestamp`
- **notifications**
  - `id`, `tenant_id`, `user_id`, `channel`, `template_key`, `payload` (json), `status`, `sent_at`
- **settings**
  - `id`, `tenant_id`, `key`, `value` (json)

## API Endpoints (RESTful) — /api/v1 prefix
**Note:** Preserve existing auth routes for Google OAuth and Passport.

### Auth (do not change)
- `GET /api/v1/auth/status` — returns current user & roles
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/google` — existing Google OAuth flow (PRESERVE)
- `GET /api/v1/auth/google/callback` — existing callback (PRESERVE)
- `POST /api/v1/users/ensure-role` — assign role/tenant after social login

### Users & Roles
- `GET /api/v1/users`
- `GET /api/v1/users/:id`
- `POST /api/v1/users`
- `PUT /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `GET /api/v1/roles`
- `POST /api/v1/roles`
- `PUT /api/v1/roles/:id`

### Tenants
- `GET /api/v1/tenants`
- `POST /api/v1/tenants`

### Candidates & Applications
- `POST /api/v1/candidates`
- `GET /api/v1/candidates/:id`
- `PUT /api/v1/candidates/:id`
- `POST /api/v1/candidates/:id/upload`
- `GET /api/v1/candidates/:id/status`

### Courses & Enrollments
- `GET /api/v1/courses`
- `POST /api/v1/courses`
- `GET /api/v1/courses/:id`
- `PUT /api/v1/courses/:id`
- `POST /api/v1/courses/:id/enroll`
- `GET /api/v1/enrollments`
- `PUT /api/v1/enrollments/:id`

### Attendance
- `POST /api/v1/attendance`
- `GET /api/v1/attendance?course_id=&date=`
- `PUT /api/v1/attendance/:id`

### Assessments & Certificates
- `POST /api/v1/assessments`
- `GET /api/v1/assessments?course_id=`
- `POST /api/v1/certificates/generate`
- `GET /api/v1/certificates/verify/:code`

### Vetting & Placement
- `POST /api/v1/vetting/:candidate_id`
- `GET /api/v1/vetting?status=`
- `POST /api/v1/placements`
- `GET /api/v1/placements?status=`

### Agents & Brokers
- `GET /api/v1/agents`
- `POST /api/v1/agents`
- `PUT /api/v1/agents/:id`
- `GET /api/v1/brokers`
- `POST /api/v1/brokers`
- `PUT /api/v1/brokers/:id`

### Finance & Payments
- `POST /api/v1/payments`
- `GET /api/v1/payments?type=&status=`
- `GET /api/v1/reports/finance?start=&end=&partner=agent|broker`

### Reports & Export
- `GET /api/v1/reports/summary`
- `GET /api/v1/reports/courses`
- `GET /api/v1/reports/placements`
- `GET /api/v1/reports/export?type=csv|pdf&module=`

### Notifications & Audit
- `POST /api/v1/notifications/send`
- `GET /api/v1/notifications`
- `GET /api/v1/audit-logs?module=&user=&from=&to=`

### Landing copy verification
- `GET /api/v1/landing/copy` — returns JSON of landing copy strings (used for QA)

## Modules & Workflows from the SRS
Each module must mirror the SRS fields, workflows, and UI wording exactly.

### Candidate Application
- Public form: fields per SRS, file uploads, declaration checkbox `"I confirm that the information provided above is true and accurate."` — required.
- Submit button text: `"Submit Application"`.

### Course Management
- Create course (title, code, category, description, duration, start/end dates, trainers, capacity, location, status).
- Enrollment management, payment status, agent link, admission status, attendance tracking, assessments, certificate generation.

### Vetting
- Police clearance, medical reports, vaccination proof, language test, interview readiness checklist, vetting status transitions, vetting comments and reviewer fields.

### Placement
- Track recruiting agency, job role, country, employer, interview date & result, offer letter, visa status, travel date, flight details, agent commission & broker fee, placement status, follow-up.

### Agent & Broker Management
- Registration, unique codes, payment terms, dashboards showing candidate lists, payments, invoices, commission trackers, and exportable reports.

### Finance & Payments
- Payment records for training fees, commission payouts, invoices, receipts, export to Excel/PDF. MPesa/Flutterwave placeholders (env vars) to be used.

### Reports & Analytics
- Dashboard visualizations: placements by month, trainees per intake, revenue trends, agent performance ranking, top destination countries.

### Audit Logs & Compliance
- Logging of key actions with timestamps, user, role, IP. Export logs.

### Profile Management
- Upload documents, view status, communication preferences (email, SMS, WhatsApp), security settings.

## Notifications, Payments & Scheduled Jobs
- **Notifications:** queue system using table `notifications` and worker to process email/SMS/push (placeholder console logs acceptable). Create templates keys per SRS events (`vetting_complete`, `interview_scheduled`, `visa_approved`, `travel_reminder`).
- **Payment stubs:** MPesa/Flutterwave connectors as stubs — accept test inputs and create payments records. Env var placeholders only.
- **Scheduled jobs:** daily cron (or worker queue) to:
  - check document expiries (passport, police, medical) and create reminder notifications 30 days prior.
  - generate periodic reports or email digests (if enabled).

## Tests & QA Requirements
- **Backend tests** (Jest + Supertest):
  - Candidate application POST flow
  - Course creation (admin)
  - Enrollment
  - Vetting update
  - Placement creation
  - Certificate generate & verify
- **Frontend tests** (Cypress):
  - Landing page loads and hero headline matches SRS text
  - Apply Now navigates to `/apply`
  - Candidate application completes with declaration checked
- **Lint & type checks:** ESLint + Prettier. TypeScript optional but recommended.
- **Accessibility:** run Axe or Lighthouse accessibility checks: aim for Accessibility >= 90.

## Deliverables & PR Standards
When the work is complete produce a single PR branch:

- Branch name: `feature/wti-srs-integration`
- PR content:
  - Summary of changes and modules added.
  - Migrations + rollback scripts.
  - Seeders: sample tenant Waterfront Training Institute, sample admin user, sample course, candidate, agent, broker.
  - Screenshots in `/docs/screenshots/`:
    - `landing_desktop.png`, `landing_tablet.png`, `landing_mobile.png`
    - `admin_dashboard.png`, `course_page.png`, `attendance_tracker.png`, `candidate_placement.png`, `agent_dashboard.png`, `broker_dashboard.png`, `certificate_page.png`
  - `landing-copy.txt` — verbatim landing copy used.
  - `README-wti-integration.md` — how to run migrations, seed data, run tests, and notes about preserved auth.
  - Tests (basic) and instructions to run them.
  - PR notes listing any deviations and compatibility decisions.
- **Commit strategy:** atomic commits per module (landing, candidates, courses, vetting, placements, agents, brokers, finance, reports, tests).

## Non-Negotiable UI Text & Copy Rules
- All buttons, form labels, headings, declarations and status text must match the SRS exactly.
- Example required strings (must be present verbatim):
  - `"Apply Now"` (primary CTA on landing)
  - `"Sign In"` (secondary CTA)
  - `"Submit Application"`
  - Declaration: `"I confirm that the information provided above is true and accurate."`
  - Placement progress stages: `Training → Vetting → Interview → Visa → Travel`
  - Candidate statuses: `Enrolled`, `Waitlisted`, `Cancelled`
  - Vetting statuses: `Pending`, `Cleared`, `Rejected`
  - Payment statuses: `Paid`, `Pending`, `Exempt`, `Overdue`

## Full Windsurf Prompt (COPY-PASTE READY)
```
PROJECT CONTEXT
You are given an existing web application built with React frontend + Node/Express backend. The application already uses Passport.js and Google OAuth for authentication — these must NOT be changed or removed. Your task is to integrate the "WTI Labour Mobility SRS" requirements into this project exactly, using Material UI (MUI) for all new UI components and pages.

SCOPE & PRIORITY
1. Create a pixel-perfect Landing Page (public route `/`) that matches the SRS exactly (copy, section order, layout, headings, CTAs). Primary CTA "Apply Now" must navigate to `/apply`.
2. Update dashboards (Admin, Candidate, Trainer, Agent, Broker, Recruiter) to match SRS layout and fields, using MUI components.
3. Implement backend models, migrations, controllers, and REST APIs for candidates, courses, enrollments, attendance, assessments, certificates, vetting, placements, agents, brokers, payments, notifications, reports and audit logs — but DO NOT change or remove any existing auth code.
4. Enforce tenant scoping via `tenant_id` on tenant-scoped tables. Add seed data for "Waterfront Training Institute" and a sample admin user.
5. Ensure all UI copy matches the SRS verbatim. Do not paraphrase.

NON-NEGOTIABLE RULES
- Preserve Passport.js + Google OAuth — DO NOT edit or remove any existing auth strategy files.
- Landing page copy & order must be identical to SRS.
- Candidate declaration checkbox text must be exact: "I confirm that the information provided above is true and accurate."
- Implement `GET /api/v1/landing/copy` returning the landing copy JSON for QA.
- Use MUI for all new frontend pages/components and MUI Theme Provider to support tenant branding.
- Create migrations that do safe ALTERs (do not drop existing auth tables).
- Provide rollback scripts, seeders, and PR instructions listing all changes.

DB MODELS (create migrations)
- users: extend safely (role_id, tenant_id, auth_provider, auth_id)
- roles, tenants, candidates, courses, enrollments, attendance_records, assessments, certificates, vetting_records, placements, agents, brokers, payments, audit_logs, notifications, settings

API ENDPOINTS (prefix /api/v1)
- Auth: preserve existing Google flows; add POST /api/v1/users/ensure-role
- Candidates: POST /api/v1/candidates, GET/PUT /api/v1/candidates/:id, POST /api/v1/candidates/:id/upload
- Courses/Enrollments: GET/POST courses, POST /api/v1/courses/:id/enroll, GET/PUT enrollments
- Attendance: POST/GET/PUT /api/v1/attendance
- Assessments/Certificates: POST/GET assessments, POST /api/v1/certificates/generate, GET /api/v1/certificates/verify/:code
- Vetting/Placement: POST /api/v1/vetting/:candidate_id, GET /api/v1/vetting, POST /api/v1/placements, GET /api/v1/placements
- Agents/Brokers: GET/POST/PUT /api/v1/agents and /api/v1/brokers
- Payments: POST /api/v1/payments, GET /api/v1/payments, GET /api/v1/reports/finance
- Reports: GET /api/v1/reports/summary, GET /api/v1/reports/export
- Notifications/Audit: POST /api/v1/notifications/send, GET /api/v1/audit-logs

FRONTEND (React + MUI)
- Public routes: / (Landing), /apply (Candidate Application), /about, /contact
- Auth routes: leave /auth/login and /auth/register intact
- Role dashboards: /admin/*, /trainer/*, /candidate/*, /agent/*, /broker/*, /recruiter/*
- Reusable MUI components: TopNav, SideNav, DataGrid wrappers, FileUploader with progress, ProgressBar (Training → Vetting → Interview → Visa → Travel), QRCode generator, PDF viewer
- Landing "Apply Now" navigates to /apply directly.

CERTIFICATES
- Generate certificate PDF and a verification QR code. Store `pdf_url` and `verification_code`. Implement GET /api/v1/certificates/verify/:code to return certificate details for public verification.

NOTIFICATIONS & SCHEDULED JOBS
- Implement notifications table and worker skeleton. Create scheduled job to check document expiry (passport, police, medical) and create reminders 30 days before expiry.

TESTS & QA
- Add backend tests (Jest + Supertest) for candidate POST, course create, enroll, vetting update, placement create, certificate generate & verify.
- Add Cypress tests for landing headline, Apply Now CTA navigation, and candidate application flow.
- Provide screenshots under /docs/screenshots (landing and dashboards).

DELIVERABLES
- Single PR branch `feature/wti-srs-integration` with migrations, seeds, code, tests.
- README-wti-integration.md with migration & seed instructions and notes about preserving auth.
- landing-copy.txt with verbatim landing text from SRS.
- screenshots as specified.

END OF JOB
```

## Final Notes & Acceptance Criteria
**Acceptance Criteria (what reviewers must verify):**
- Landing page at `/` matches SRS copy, order and layout (desktop/tablet/mobile screenshots present).
- `Apply Now` navigates directly to `/apply` and the candidate form posts to `POST /api/v1/candidates`. Declaration boolean required.
- Dashboards updated (Admin, Candidate, Trainer, Agent, Broker, Recruiter) and show the fields/cards described in SRS.
- Backend migrations added with `tenant_id` on tenant-scoped tables, safe ALTERs and rollback scripts.
- Certificate generation produces a PDF and a verification endpoint returning certificate details for a given code.
- Tests: basic backend & Cypress frontend smoke tests present.
- PR includes `landing-copy.txt`, screenshots, `README-wti-integration.md`, seeds and a clear summary of changes — especially any conflicts/resolutions with existing tables.
- Auth flows (Passport & Google) remain fully intact and functional, with post-login mapping to roles handled through the new ensure-role endpoint.

**END OF IMPLEMENTATION DOCUMENT**

# Backend Data Model & Migration Plan

## Overview
This document captures the proposed Prisma schema extensions and SQL migration order required to satisfy the WTI Labour Mobility SRS. All tables are multi-tenant; each tenant-scoped table includes `tenantId`, `createdBy`, and `updatedBy` columns (nullable until data is wired).

## Existing Tables (context)
- `roles`
- `users`
- `sessions`
- `activity_logs`

## New / Updated Tables

### 1. `tenants`
| Column | Type | Notes |
| --- | --- | --- |
| `id` | Int @id | autoincrement |
| `name` | String | unique |
| `code` | String | unique |
| `branding` | Json | `{ "logoUrl": string, "colorHex": string }` |
| `contactInfo` | Json | contact details |
| `createdAt` | DateTime | default now |
| `updatedAt` | DateTime | updatedAt |

### 2. `roles` (alter)
Add:
- `tenantId` (Int?, references `tenants.id`, null for global roles)
- `systemRole` (Boolean, default false) to mark built-in roles

### 3. `users` (alter)
Add:
- `tenantId` (Int?, references `tenants.id`)
- `authProvider` (String, default "local")
- `authId` (String?)
- `status` (String, default "active")
- `twoFactorEnabled` (Boolean, default false)
- `createdBy` / `updatedBy` (Int?, self reference)
Add indexes on (`tenantId`, `email`).

### 4. `user_tenants` (junction)
Handles multi-tenant membership if user belongs to multiple tenants.
- `id` Int @id
- `userId` Int FK `users`
- `tenantId` Int FK `tenants`
- `roleId` Int FK `roles`
- `isPrimary` Boolean default false

### 5. `candidates`
Columns per SRS including file URLs and JSON fields. Key foreign keys: `tenantId`, `agentId`, `brokerId`, `createdBy`, `updatedBy`.

### 6. `candidate_documents`
Normalize uploaded documents.

### 7. `courses`, `enrollments`, `attendance_records`, `assessments`, `certificates`
Per SRS specification with tenant scoping and auditing columns.

### 8. `vetting_records`, `placements`
Track vetting pipeline and placement outcomes, commissions, statuses.

### 9. `agents`, `brokers`
Store partner metadata, payment terms, codes.

### 10. `payments`, `invoices`
Record finance events, references to agents/brokers/candidates.

### 11. `notifications`, `audit_logs`
Notifications queue and audit trail.

### 12. `settings`
Tenant-level configuration key/value JSON.

## Migration Order
1. **Create `tenants` table.** Seed default tenant (WTI) later.
2. **Alter `roles` table** — add tenant & system columns.
3. **Alter `users` table** — add tenant metadata, auth fields, audit references.
4. **Create `user_tenants` table** for multi-tenant user membership.
5. **Create core domain tables** in dependency order:
   1. `agents`
   2. `brokers`
   3. `candidates`
   4. `courses`
   5. `enrollments`
   6. `attendance_records`
   7. `assessments`
   8. `certificates`
   9. `vetting_records`
   10. `placements`
6. **Create auxiliary tables**:
   - `payments`
   - `invoices`
   - `notifications`
   - `settings`
   - `audit_logs`
   - `candidate_documents`
7. **Add indexes & constraints** (unique codes, composite indexes for reporting).

## Prisma Schema Notes
- Use `@@map` to align with snake_case table names as in existing schema.
- Represent JSON columns with Prisma `Json` type.
- Represent enumerations (`PaymentStatus`, `VettingStatus`, `PlacementStatus`, etc.) using Prisma `enum` definitions.
- All relations should cascade on delete only when appropriate (e.g., deleting a candidate removes dependent documents but not audit logs).

## Rollback Strategy
For each migration:
1. Provide a paired SQL script that drops newly added tables (if safe) or removes columns added during the migration. Because dropping tenant columns from existing tables could destroy data, ensure rollback scripts are idempotent and confirm existing data backups.
2. Document manual steps when automated rollback cannot safely reverse aggregated data.

## Seeding Plan
- Insert tenant `Waterfront Training Institute` with branding.
- Create roles per SRS (`System Admin`, `Admin`, `Trainer`, `Candidate`, `Agent`, `Broker`, `Recruiter`).
- Create admin user associated with WTI tenant.
- Seed sample course, candidate, agent, broker, placement, vetting, payment records demonstrating workflow.

## Next Steps
1. Translate this blueprint into Prisma schema changes (`schema.prisma`).
2. Craft SQL migration files or use `prisma migrate dev` with generated SQL.
3. Implement services/controllers once schema is ready.

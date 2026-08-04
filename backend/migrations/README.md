# Database change policy

This project separates structural database evolution, repeatable bootstrap data,
and one-time production repairs. Do not put patient records, account credentials,
facility-specific rows, or dashboard content in this directory.

## `migrations/`

Only schema changes belong here:

- `CREATE TABLE`
- `ALTER TABLE`, columns, indexes, foreign keys, and constraints
- structural compatibility changes required by an application feature

Migration files are ordered by their numeric prefix and executed by
`npm run db:migrate`. Applied versions and SHA-256 checksums are stored in the
`schema_migration` table. Never edit, delete, or rename an applied migration
without a compatibility entry in `legacy-aliases.json`.

Every migration filename must use `NNN_feature_schema_name.sql`. The automatic
validator rejects data-oriented names, emails, and SQL containing `INSERT`,
`UPDATE`, `DELETE`, `REPLACE`, or `TRUNCATE`. Run it directly with:

```bash
npm run db:migrations:check
```

The alias file maps the former migration name and checksum to its new
schema-only replacement. On an existing database, the runner validates the old
checksum and safely skips the replacement because that structure was already
applied. On a fresh database, only the new schema-only file runs.

## `seeds/`

Repeatable initial or demo data belongs in `../seeds/`, including default
catalogs, system sequence rows, demo users, default availability, and initial bed
inventory. Seed SQL must be idempotent (`INSERT IGNORE`, upsert, or an equivalent
guard).

Run all SQL seeds after migrations:

```bash
npm run db:migrate
npm run db:seed:sql
```

The existing JavaScript application seed remains available as `npm run db:seed`.
Use it only when that complete demo dataset is wanted.

## `scripts/data-fixes/`

One-time repairs and historical backfills belong in
`../scripts/data-fixes/`. These scripts may contain record IDs, legacy emails,
historical patient data, or tenant corrections and are intentionally excluded
from automatic migration execution.

Before running a data fix:

1. Back up the target database.
2. Read the complete SQL and confirm its tenant and record scope.
3. Verify that it has not already been applied.
4. Run one explicitly named file:

```bash
npm run db:data-fix -- --file 004_user_facility_link_backfill.sql --confirm-data-fix
```

Data fixes are not tracked as schema versions. Record their execution in the
deployment/change ticket for the target environment.

## Application data changes

New patients, account updates, password/login fixes, facility records, report
uploads, notifications, appointments, and dashboard data must be created or
updated through backend APIs. Use an idempotent seed only for deliberate
bootstrap/demo data, and a reviewed data-fix only for a one-time repair. Never
create a schema migration for an individual person, account, email, phone number,
facility, or uploaded report.

## Refactor history

The pre-refactor folder was copied to
`../backups/migrations-before-refactor-20260803-120000/` before any relocation.
The backup contains all 27 original SQL files with identical SHA-256 content.

Mixed migrations were split as follows:

- Former `004_dashboard_integrity.sql`: table creation remains in migration
  `004`; user/facility row matching moved to data-fix `004`.
- Former `009_upgrade_legacy_lab_workflow.sql`: column changes remain in
  migration `009`; sample barcode updates moved to data-fix `009`.
- The technical prescription sequence row moved from migration `001` to seed
  `001_system_sequences.sql`.

Historical identity, tenant ownership, login repair, and notification backfill
files were moved out of automatic migrations without changing their SQL logic.

# Legacy one-time utilities

These files are preserved for historical/manual maintenance only. They are not
part of the NestJS runtime, the versioned migration runner, or any npm script.

- `database/`: superseded database inspection, creation, and migration helpers.
- `seeds/`: legacy JavaScript/TypeScript seed scripts. Active SQL seeds live in
  `backend/seeds/` and run through `npm run db:seed`.
- `tests/`: ad-hoc diagnostic scripts. Maintained automated tests live in
  `backend/test/`.

Run a legacy utility only after reviewing its hard-coded assumptions and taking
a database backup. New schema changes belong in `backend/migrations/`; new demo
records belong in `backend/seeds/`; one-time record repairs belong in
`backend/scripts/data-fixes/`.

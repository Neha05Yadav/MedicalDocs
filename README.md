# MediDoc

MediDoc is a healthcare management application with a Next.js frontend and a NestJS API.

## Project structure

```text
.
|-- frontend/          # Next.js 16 application
|   |-- public/        # Static assets
|   |-- scripts/       # Preserved one-time frontend maintenance utilities
|   `-- src/
|       |-- app/       # App Router pages and layouts
|       |-- components/
|       |-- hooks/
|       |-- integrations/
|       `-- lib/
|-- backend/           # NestJS API
|   |-- migrations/    # Versioned schema-only SQL migrations
|   |-- seeds/         # Optional repeatable/demo seed data
|   |-- scripts/       # Migration tooling, data fixes, and legacy utilities
|   |-- src/           # Feature modules, controllers, and services
|   |-- test/          # End-to-end tests
|   `-- uploads/       # Local runtime uploads (git-ignored)
|-- docs/
|   `-- screenshots/   # UI review and documentation captures
`-- package.json       # Commands for both applications
```

## Setup

Requirements: Node.js 20+ and MySQL.

1. Install both applications:

   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

2. Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env.local`, then enter local credentials.

3. Create the versioned MySQL schema and optional demo data:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

   `db:migrate` is safe to run repeatedly and records checksums in `schema_migration`.
   Demo accounts all use the password `Demo@123`:

   - `patient@demo.com`
   - `hospital@demo.com`
   - `clinic@demo.com`
   - `lab@demo.com`

4. Start the API and frontend in separate terminals:

   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

The frontend runs at `http://localhost:3000`; the API runs at `http://localhost:4000`.

## Validation

```bash
npm run build
npm test
```

## Integrated clinical workflows

- Appointment availability, booking, rescheduling, cancellation, reminders, clinician calendar and consultation billing
- Laboratory test/rate catalogue, discounted packages, home collection, QR sample labels, sample tracking, abnormal result flags and automatic report billing
- Hospital IPD rooms/beds, admissions, deposits, itemized clinical charges, insurance adjustments, discharge summaries and final bills
- Insurance policies, cashless/reimbursement claims, TPA decisions, claim documents and patient-payable calculations
- Professionally generated invoice, prescription, lab report and discharge PDF documents with digital signer metadata, SHA-256 integrity hashes and public QR verification

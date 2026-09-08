# SIH DoCA Verification

**Smart India Hackathon 2026 — Problem Statement PS-26036**

A full-stack digital platform for the verification, certification, and lifecycle tracking of weighing & measuring instruments under Legal Metrology / Department of Consumer Affairs (DoCA) processes. It connects traders/businesses, Legal Metrology Officers (LMOs), Government Approved Test Centres (GATC), administrators, and the public in a single verification workflow — from instrument registration to certificate issuance and public verification lookup.

## Overview

The platform digitizes the end-to-end journey of an instrument verification:

1. A business registers an instrument and applies for verification.
2. The application is scheduled and assigned to an LMO for inspection.
3. The LMO submits an inspection form; where required, GATC performs lab testing.
4. On approval, a certificate is issued and tracked through its lifecycle (including revocation if needed).
5. Anyone can publicly verify a certificate's authenticity via QR code or certificate ID.

Every step is logged for audit purposes, with dashboards and analytics for administrators to monitor zone performance, instrument distribution, and verification timelines.

## Features

- **Role-based dashboards** for Admin, Business, LMO (Legal Metrology Officer), and GATC users
- **Instrument registration & management** for businesses
- **Verification application workflow** — apply, schedule, inspect, approve/reject
- **Digital certificates** with QR-code-based public verification
- **Public verification portal** — look up and validate certificates without logging in
- **Lab test integration** via the GATC module
- **Audit logs** for compliance and traceability
- **Notifications** for stakeholders at each workflow stage
- **Analytics & reporting** — instrument distribution, verification timelines, and zone performance charts
- **Stakeholder registry** and scheduling panel for admins

## Tech Stack

**Frontend**
- React (Vite)
- Recharts-style chart components for analytics
- Context API for authentication state (`AuthContext`)

**Backend**
- Node.js — dependency-free REST API (no framework overhead)
- MongoDB (via `MONGODB_URI`) for persistence, with a local `db.json` data store for the demo/seed data
- JWT-based authentication middleware

## Project Structure

```
sih-doca-verification/
├── backend/
│   ├── server.js               # API entry point
│   ├── devFull.js              # Runs frontend + backend together
│   ├── dataStore.js            # Data access layer
│   ├── db.json                 # Seeded demo data
│   └── src/
│       ├── config/db.js        # Database connection
│       ├── middleware/auth.js  # JWT auth middleware
│       ├── models/             # Application, Certificate, Instrument,
│       │                       # Notification, User, Verification
│       ├── routes/             # applications, auth, certificates,
│       │                       # instruments, notifications, stats, verifications
│       ├── services/verificationService.js
│       ├── utils/               # ApiError, ids
│       └── seed.js
├── src/
│   ├── components/
│   │   ├── charts/              # InstrumentDistributionChart, VerificationTimelineChart, ZonePerformanceChart
│   │   ├── common/               # CertificateModal, Header, Footer, QRScannerModal, StatusBadge, DemoWalkthroughBar
│   │   └── lifecycle/LifecycleTracker.jsx
│   ├── context/AuthContext.jsx
│   ├── data/mockData.js
│   ├── pages/
│   │   ├── admin/                # AdminDashboard, AnalyticsPage, AuditLogsPage, CertificatesRegistryPage,
│   │   │                         # InstrumentsRegistryPage, SchedulingPanelPage, StakeholdersPage, VerificationDeskPage
│   │   ├── business/             # BusinessDashboard, RegisterInstrumentPage, ApplyVerificationPage,
│   │   │                         # MyInstrumentsPage, InstrumentDetailsPage, CertificatesPage,
│   │   │                         # VerificationApplicationsPage, TraderProfilePage
│   │   ├── gatc/                 # GatcDashboard, LabTestPage
│   │   ├── lmo/                  # LmoDashboard, LmoSchedulePage, AssignedVerificationsPage, InspectionFormPage
│   │   └── public/               # LandingPage, LoginPage, PublicVerifyPage, CertificateResultPage
│   ├── services/storageService.js
│   ├── App.jsx
│   └── main.jsx
├── test_complete_workflow.js
├── test_workflow.js
├── vite.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (with npm)
- A MongoDB instance (local or Atlas)

### Installation

```bash
git clone https://github.com/saumyacodes-725/sih-doca-verification.git
cd sih-doca-verification
npm install
```

### Environment Setup

Copy the example environment file in the `backend/` folder and fill in your values:

```bash
cp backend/.env.example backend/.env
```

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sih-doca-verification
JWT_SECRET=replace-with-a-long-random-string
PORT=5000
HOST=127.0.0.1
```

### Running the App

Run the backend only:

```bash
npm run server
```
Backend will be available at `http://127.0.0.1:5000`.

Run the frontend only (Vite dev server):

```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`.

Run both frontend and backend together:

```bash
npm run dev:full
```

## API Reference

All endpoints are served under `http://127.0.0.1:5000/api`.

```
GET   /api/health
GET   /api/db
POST  /api/reset

GET   /api/stats

GET   /api/instruments
POST  /api/instruments
GET   /api/instruments/:id

GET   /api/applications
POST  /api/applications
PATCH /api/applications/:id/schedule
POST  /api/applications/:id/inspection

GET   /api/certificates
GET   /api/certificates/:id
PATCH /api/certificates/:id/revoke

GET   /api/stakeholders

GET   /api/notifications?userId=USR-BIZ-01
PATCH /api/notifications/:id/read

GET   /api/gatc-reports
POST  /api/gatc-reports

GET   /api/audit-logs
```

The backend stores demo data in `backend/db.json`, seeded from `src/data/mockData.js`.

## User Roles

| Role | Description |
|------|-------------|
| **Admin** | Oversees the full system — verification desk, certificate & instrument registries, scheduling, stakeholders, audit logs, and analytics |
| **Business** | Registers instruments, applies for verification, tracks applications and certificates |
| **LMO** | Legal Metrology Officer — handles assigned verifications, scheduling, and inspection forms |
| **GATC** | Government Approved Test Centre — conducts lab tests and submits reports |
| **Public** | Verifies certificates via QR code or certificate lookup, no login required |



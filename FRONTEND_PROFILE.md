# Frontend Profile — Trust Scale Portal

## Overview

Vite + React SPA for the Legal Metrology instrument verification portal. Five role-based experiences (public/citizen, business trader, LMO field officer, GATC lab, national admin) share one Bootstrap-styled shell, routed with React Router.

## Stack

- **Build tool**: Vite 6
- **UI**: React 18, Bootstrap 5 + Bootstrap Icons (via CSS classes, no component library)
- **Routing**: `react-router-dom` v6
- **Charts**: `chart.js` / `react-chartjs-2`
- **QR codes**: `qrcode.react` (rendering), `jsqr` (camera decoding)
- **State**: React Context (`AuthContext`) + local component state — no Redux/Zustand

## Project layout

```
src/
  main.jsx              # ReactDOM root, wraps App in AuthProvider + BrowserRouter
  App.jsx                # Route table (see Routing below)
  index.css              # Global styles, QR scanner viewfinder, print/certificate styles
  context/
    AuthContext.jsx       # Auth/session state — see Auth section
  services/
    storageService.js     # The data layer every page calls — see Data layer
  data/
    mockData.js           # Original seed shape (still used to seed backend/db.json's legacy collections)
  components/
    common/                # Header, Footer, DemoWalkthroughBar, StatusBadge, CertificateModal, QRScannerModal
    charts/                 # Three chart.js wrappers (used by AnalyticsPage, currently static demo data)
    lifecycle/              # LifecycleTracker — the application-status stepper
  pages/
    public/    LandingPage, LoginPage, PublicVerifyPage, CertificateResultPage
    business/  BusinessDashboard, MyInstrumentsPage, RegisterInstrumentPage, InstrumentDetailsPage,
               VerificationApplicationsPage, ApplyVerificationPage, CertificatesPage, TraderProfilePage
    lmo/       LmoDashboard, AssignedVerificationsPage, InspectionFormPage, LmoSchedulePage
    gatc/      GatcDashboard, LabTestPage
    admin/     AdminDashboard, VerificationDeskPage, InstrumentsRegistryPage, SchedulingPanelPage,
               CertificatesRegistryPage, AnalyticsPage, AuditLogsPage, StakeholdersPage
```

## Routing (`App.jsx`)

| Path | Page | Access |
|---|---|---|
| `/` | LandingPage | public |
| `/verify` | PublicVerifyPage | public |
| `/certificate/:id` | CertificateResultPage | public — the QR-scan destination |
| `/login` | LoginPage | public |
| `/business/*` (dashboard, instruments, register, apply, applications, certificates, profile) | Business pages | business |
| `/lmo/*` (dashboard, assigned, inspect/:appId, schedule) | LMO pages | lmo |
| `/gatc/*` (dashboard, test/:appId) | GATC pages | gatc |
| `/admin/*` (dashboard, applications, instruments, stakeholders, scheduling, certificates, analytics, logs) | Admin pages | admin |

Routes are not access-guarded by role at the router level — any page can be navigated to directly; role-appropriate UI/data comes from `AuthContext` and what the backend authorizes.

## Auth (`context/AuthContext.jsx`)

- `currentUser` / `currentRole` — the active session; defaults to a static `public` profile when logged out
- `login(email, password)` / `register(payload)` — real calls to `POST /api/auth/login` / `/register`, store the returned JWT in `localStorage` (`emaap_token`)
- `logout()` — clears the token, resets to public
- `switchRole(role)` — the one-click demo buttons (Header, DemoWalkthroughBar, LoginPage's role cards). For business/lmo/gatc/admin it performs a **real login** against the seeded demo account for that role (`business@demo.test` etc.); falls back to a static offline profile only if the backend is unreachable
- On mount, if a token exists, calls `GET /api/auth/me` to rehydrate the session
- `ROLE_PROFILES` — static display metadata (avatar icon, color, role label) merged with the real user record for each role

## Data layer (`services/storageService.js`)

Two halves, mixed in one file:

1. **Mongo-backed, async, JWT-aware** (added this migration) — `getInstruments/getInstrumentById/addInstrument/updateInstrument`, `getApplications/getApplicationById/submitApplication/assignAndScheduleApplication/completeInspection`, `getCertificates/getCertificateById/verifyCertificatePublic/revokeCertificate`, `getNotifications/markNotificationRead`, `getOfficers`, `apiLogin/apiRegister/apiMe`. All go through a shared `apiFetch()` helper that attaches `Authorization: Bearer <token>` from `localStorage` and throws on non-2xx.
2. **Legacy, synchronous, file-backed** (unmigrated) — `getStakeholders`, `getGatcReports`/`submitGatcReport`, `getAuditLogs`, `getDb`/`resetDatabase`/`subscribeToDbChanges`. These still read/write the whole `db.json` blob via a synchronous XHR to `/api/db`, falling back to `localStorage` if the backend is unreachable.

**Rule of thumb for any page**: if it touches instruments, applications, verifications, certificates, or notifications, it's real MongoDB data and its calls are `async`/awaited. If it touches stakeholders, GATC reports, or audit logs, it's still the legacy local/file store.

## Public QR-verification path

`QRScannerModal` (real camera + `jsqr` decode, manual-entry fallback) → decoded/typed identifier → `verifyCertificatePublic(id)` → `GET /api/certificates/verify/:certId` (no auth) → `/certificate/:id` route renders the result. This is the only fully anonymous, unauthenticated flow in the app by design — no bulk certificate listing is exposed publicly.

## Pages NOT yet wired to MongoDB (intentionally deferred)

`AuditLogsPage`, `StakeholdersPage`, `GatcDashboard`, `LabTestPage` — still read/write the legacy file-backed collections. `AnalyticsPage` is entirely static demo data (no backend calls at all).

## Known gaps

- No client-side route guards by role (a business user could type `/admin` in the URL bar and see the page shell, though its data calls would 403 against the backend)
- `AnalyticsPage` charts are illustrative, not computed from real data
- No pagination on any list view — fine at demo data volumes, would need it for a real registry

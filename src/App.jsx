import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import DemoWalkthroughBar from './components/common/DemoWalkthroughBar';
import HelpChatBot from './components/common/HelpChatBot';
import { useAuth } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import PublicVerifyPage from './pages/public/PublicVerifyPage';
import CertificateResultPage from './pages/public/CertificateResultPage';

// Business Trader Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import MyInstrumentsPage from './pages/business/MyInstrumentsPage';
import RegisterInstrumentPage from './pages/business/RegisterInstrumentPage';
import InstrumentDetailsPage from './pages/business/InstrumentDetailsPage';
import VerificationApplicationsPage from './pages/business/VerificationApplicationsPage';
import ApplyVerificationPage from './pages/business/ApplyVerificationPage';
import CertificatesPage from './pages/business/CertificatesPage';
import TraderProfilePage from './pages/business/TraderProfilePage';

// LMO Enforcement Pages
import LmoDashboard from './pages/lmo/LmoDashboard';
import AssignedVerificationsPage from './pages/lmo/AssignedVerificationsPage';
import InspectionFormPage from './pages/lmo/InspectionFormPage';
import LmoSchedulePage from './pages/lmo/LmoSchedulePage';

// GATC Lab Pages
import GatcDashboard from './pages/gatc/GatcDashboard';
import LabTestPage from './pages/gatc/LabTestPage';

// National Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VerificationDeskPage from './pages/admin/VerificationDeskPage';
import InstrumentsRegistryPage from './pages/admin/InstrumentsRegistryPage';
import StakeholdersPage from './pages/admin/StakeholdersPage';
import SchedulingPanelPage from './pages/admin/SchedulingPanelPage';
import CertificatesRegistryPage from './pages/admin/CertificatesRegistryPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

export default function App() {
  const { toast } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light app-root-container">
      {/* Interactive Verification Lifecycle Walkthrough Guide */}
      <DemoWalkthroughBar />

      {/* Main Government Portal Header */}
      <Header />

      {/* Global Toast Notification */}
      {toast && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1090 }}
        >
          <div
            className={`toast show align-items-center text-white bg-${toast.type === 'primary' ? 'primary' : toast.type === 'success' ? 'success' : toast.type === 'warning' ? 'warning text-dark' : toast.type === 'danger' ? 'danger' : 'dark'} border-0 shadow-lg`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill"></i>
                <div className="fw-semibold">{toast.message}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<PublicVerifyPage />} />
          <Route path="/certificate/:id" element={<CertificateResultPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Business Trader Routes */}
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/instruments" element={<MyInstrumentsPage />} />
          <Route path="/business/instruments/:id" element={<InstrumentDetailsPage />} />
          <Route path="/business/register" element={<RegisterInstrumentPage />} />
          <Route path="/business/applications" element={<VerificationApplicationsPage />} />
          <Route path="/business/apply" element={<ApplyVerificationPage />} />
          <Route path="/business/certificates" element={<CertificatesPage />} />
          <Route path="/business/profile" element={<TraderProfilePage />} />

          {/* LMO Enforcement Routes */}
          <Route path="/lmo" element={<LmoDashboard />} />
          <Route path="/lmo/assigned" element={<AssignedVerificationsPage />} />
          <Route path="/lmo/inspect/:appId" element={<InspectionFormPage />} />
          <Route path="/lmo/inspect" element={<InspectionFormPage />} />
          <Route path="/lmo/schedule" element={<LmoSchedulePage />} />

          {/* GATC Lab Routes */}
          <Route path="/gatc" element={<GatcDashboard />} />
          <Route path="/gatc/test/:appId" element={<LabTestPage />} />
          <Route path="/gatc/test" element={<LabTestPage />} />

          {/* National Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<VerificationDeskPage />} />
          <Route path="/admin/instruments" element={<InstrumentsRegistryPage />} />
          <Route path="/admin/stakeholders" element={<StakeholdersPage />} />
          <Route path="/admin/scheduling" element={<SchedulingPanelPage />} />
          <Route path="/admin/certificates" element={<CertificatesRegistryPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/logs" element={<AuditLogsPage />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Government Footer */}
      <Footer />

      {/* Floating Help Assistant */}
      <HelpChatBot />
    </div>
  );
}

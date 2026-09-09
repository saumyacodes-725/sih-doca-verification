import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import DemoWalkthroughBar from './components/common/DemoWalkthroughBar';
import HelpChatBot from './components/common/HelpChatBot';
import RequireRole from './components/common/RequireRole';
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
          <Route path="/business" element={<RequireRole roles={['business']}><BusinessDashboard /></RequireRole>} />
          <Route path="/business/instruments" element={<RequireRole roles={['business']}><MyInstrumentsPage /></RequireRole>} />
          <Route path="/business/instruments/:id" element={<RequireRole roles={['business']}><InstrumentDetailsPage /></RequireRole>} />
          <Route path="/business/register" element={<RequireRole roles={['business']}><RegisterInstrumentPage /></RequireRole>} />
          <Route path="/business/applications" element={<RequireRole roles={['business']}><VerificationApplicationsPage /></RequireRole>} />
          <Route path="/business/apply" element={<RequireRole roles={['business']}><ApplyVerificationPage /></RequireRole>} />
          <Route path="/business/certificates" element={<RequireRole roles={['business']}><CertificatesPage /></RequireRole>} />
          <Route path="/business/profile" element={<RequireRole roles={['business']}><TraderProfilePage /></RequireRole>} />

          {/* LMO Enforcement Routes */}
          <Route path="/lmo" element={<RequireRole roles={['lmo']}><LmoDashboard /></RequireRole>} />
          <Route path="/lmo/assigned" element={<RequireRole roles={['lmo']}><AssignedVerificationsPage /></RequireRole>} />
          <Route path="/lmo/inspect/:appId" element={<RequireRole roles={['lmo']}><InspectionFormPage /></RequireRole>} />
          <Route path="/lmo/inspect" element={<RequireRole roles={['lmo']}><InspectionFormPage /></RequireRole>} />
          <Route path="/lmo/schedule" element={<RequireRole roles={['lmo']}><LmoSchedulePage /></RequireRole>} />

          {/* GATC Lab Routes */}
          <Route path="/gatc" element={<RequireRole roles={['gatc']}><GatcDashboard /></RequireRole>} />
          <Route path="/gatc/test/:appId" element={<RequireRole roles={['gatc']}><LabTestPage /></RequireRole>} />
          <Route path="/gatc/test" element={<RequireRole roles={['gatc']}><LabTestPage /></RequireRole>} />

          {/* National Admin Routes */}
          <Route path="/admin" element={<RequireRole roles={['admin']}><AdminDashboard /></RequireRole>} />
          <Route path="/admin/applications" element={<RequireRole roles={['admin']}><VerificationDeskPage /></RequireRole>} />
          <Route path="/admin/instruments" element={<RequireRole roles={['admin']}><InstrumentsRegistryPage /></RequireRole>} />
          <Route path="/admin/stakeholders" element={<RequireRole roles={['admin']}><StakeholdersPage /></RequireRole>} />
          <Route path="/admin/scheduling" element={<RequireRole roles={['admin']}><SchedulingPanelPage /></RequireRole>} />
          <Route path="/admin/certificates" element={<RequireRole roles={['admin']}><CertificatesRegistryPage /></RequireRole>} />
          <Route path="/admin/analytics" element={<RequireRole roles={['admin']}><AnalyticsPage /></RequireRole>} />
          <Route path="/admin/logs" element={<RequireRole roles={['admin']}><AuditLogsPage /></RequireRole>} />

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

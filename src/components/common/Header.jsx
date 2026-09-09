import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import QRScannerModal from './QRScannerModal';

const ROLE_OPTIONS = [
  { key: 'public', label: 'Citizen', color: 'info' },
  { key: 'business', label: 'Trader', color: 'warning' },
  { key: 'lmo', label: 'LMO Officer', color: 'primary' },
  { key: 'gatc', label: 'GATC Lab', color: 'success' },
  { key: 'admin', label: 'Admin', color: 'danger' }
];

export default function Header() {
  const { currentRole, currentUser, logout, showToast, handleResetData, ROLE_PROFILES } = useAuth();
  const { language, switchLanguage, supportedLanguages } = useLanguage();
  const currentLanguage = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];
  const location = useLocation();
  const navigate = useNavigate();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return 'active';
    if (path !== '/' && location.pathname.startsWith(path)) return 'active';
    return '';
  };

  // Switching to a different role must go through a real login — this only
  // jumps to /login (logging out first if a session is active) rather than
  // silently authenticating as the new role.
  const handleRoleChange = (role) => {
    if (role === currentRole) {
      navigate(role === 'public' ? '/' : `/${role}`);
      return;
    }
    logout();
    navigate(role === 'public' ? '/' : '/login');
  };

  return (
    <header className="gov-header-wrapper no-print">
      {/* India Tricolor Stripe */}
      <div className="gov-tricolor-bar"></div>

      {/* Top Utility Bar */}
      <div className="gov-top-bar py-1 px-3 d-none d-md-block">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span>
              <i className="bi bi-flag-fill text-warning me-1"></i> भारत सरकार | Government of India
            </span>
            <span className="text-secondary">|</span>
            <span>
              <i className="bi bi-shield-check text-info me-1"></i> Legal Metrology Act, 2009
            </span>
            <span className="text-secondary">|</span>
            <span className="badge bg-success-subtle text-success border border-success-subtle">
              <i className="bi bi-shield-lock-fill me-1"></i> Directorate of Legal Metrology
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="text-light-50">
              National Consumer Helpline: <strong className="text-warning">1915</strong>
            </span>
            {/* Multilingual Language Switcher */}
            <div className="dropdown no-translate">
              <button
                className="btn btn-sm btn-warning text-dark fw-bold py-0 px-2 dropdown-toggle no-translate"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: '0.78rem' }}
              >
                {currentLanguage.nativeLabel}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm no-translate">
                {supportedLanguages.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      onClick={() => {
                        switchLanguage(l.code);
                        showToast(l.toastMsg, 'info');
                      }}
                      className={`dropdown-item d-flex align-items-center justify-content-between no-translate fw-bold ${
                        language === l.code ? 'bg-warning-subtle' : ''
                      }`}
                      title={`View Portal in ${l.label} (${l.nativeLabel})`}
                    >
                      {l.nativeLabel}
                      {language === l.code && <i className="bi bi-check-lg text-warning-emphasis"></i>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowQRScanner(true)}
              className="btn btn-sm btn-outline-info py-0 px-2"
              title="Scan Stamping QR Code"
            >
              <i className="bi bi-qr-code-scan me-1"></i> Quick QR Scan
            </button>
          </div>
        </div>
      </div>

      {/* Main Government Title Header */}
      <div className="gov-main-header py-2 px-3">
        <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-3">
            <div className="gov-emblem-box text-center">
              <div
                className="bg-warning-subtle text-warning-emphasis d-flex align-items-center justify-content-center rounded-circle border border-warning"
                style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}
              >
                ⚖️
              </div>
            </div>

            <div className="portal-brand-title fs-4 lh-sm text-navy-dark fw-bold">
              Trust Scale
            </div>
          </Link>

          {/* Role Switcher & Profile Widget */}
          <div className="d-flex align-items-center gap-3 ms-auto pe-1">
            {/* Role Login Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary py-1 px-2 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: '0.75rem' }}
              >
                Role Login
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                {ROLE_OPTIONS.map((r) => (
                  <li key={r.key}>
                    <button
                      onClick={() => handleRoleChange(r.key)}
                      className={`dropdown-item d-flex align-items-center justify-content-between ${currentRole === r.key ? `bg-${r.color}-subtle fw-bold` : ''}`}
                    >
                      {r.label}
                      {currentRole === r.key && <i className={`bi bi-check-lg text-${r.color}`}></i>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Profile Card */}
            <div className="d-flex align-items-center gap-2 border-start ps-3">
              <div className="text-end d-none d-md-block">
                <div className="fw-bold small text-dark">{currentUser?.name}</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {currentUser?.badge || currentUser?.roleLabel}
                </div>
              </div>
              <div
                className={`rounded-circle bg-${currentUser?.color || 'primary'}-subtle text-${currentUser?.color || 'primary'} border border-${currentUser?.color || 'primary'} d-flex align-items-center justify-content-center shadow-sm`}
                style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}
              >
                <i className={`bi ${currentUser?.avatar || 'bi-person-circle'}`}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Navigation Bar */}
      <nav className="navbar navbar-expand-lg gov-subnav p-0 border-top border-bottom">
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center gap-2 py-1 d-lg-none">
            <span className="badge bg-warning text-dark">{currentUser?.roleLabel}</span>
          </div>

          <button
            className="navbar-toggler py-1 px-2 my-1"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
              {/* PUBLIC MENU */}
              {currentRole === 'public' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/')}`} to="/">
                      <i className="bi bi-house-door-fill me-1"></i> Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/verify')}`} to="/verify">
                      <i className="bi bi-shield-check me-1"></i> Verify Certificate
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link px-3 btn btn-link text-decoration-none"
                      onClick={() => setShowQRScanner(true)}
                    >
                      <i className="bi bi-qr-code-scan me-1"></i> QR Scan
                    </button>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/login')}`} to="/login">
                      <i className="bi bi-box-arrow-in-right me-1"></i> Portal Login / Role Switcher
                    </Link>
                  </li>
                </>
              )}

              {/* BUSINESS TRADER MENU */}
              {currentRole === 'business' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/business') && location.pathname === '/business' ? 'active' : ''}`} to="/business">
                      <i className="bi bi-speedometer2 me-1"></i> Trader Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/business/instruments')}`} to="/business/instruments">
                      <i className="bi bi-box-seam me-1"></i> My Instruments
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/business/register')}`} to="/business/register">
                      <i className="bi bi-plus-circle me-1"></i> Register Instrument
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/business/applications')}`} to="/business/applications">
                      <i className="bi bi-file-earmark-text me-1"></i> Verification Applications
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/business/apply')}`} to="/business/apply">
                      <i className="bi bi-patch-plus me-1"></i> Apply for Verification
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/business/certificates')}`} to="/business/certificates">
                      <i className="bi bi-award me-1"></i> Certificates & Stamping
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/business/profile')}`} to="/business/profile">
                      <i className="bi bi-person-badge me-1"></i> Profile & Alerts
                    </Link>
                  </li>
                </>
              )}

              {/* LMO MENU */}
              {currentRole === 'lmo' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/lmo') && location.pathname === '/lmo' ? 'active' : ''}`} to="/lmo">
                      <i className="bi bi-speedometer2 me-1"></i> Officer Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/lmo/assigned')}`} to="/lmo/assigned">
                      <i className="bi bi-list-check me-1"></i> Assigned Verifications
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/lmo/inspect')}`} to="/lmo/inspect/APP-2026-103">
                      <i className="bi bi-tools me-1"></i> Field Digital Checklist & Stamping
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/lmo/schedule')}`} to="/lmo/schedule">
                      <i className="bi bi-calendar3 me-1"></i> My Inspection Roster
                    </Link>
                  </li>
                </>
              )}

              {/* GATC MENU */}
              {currentRole === 'gatc' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/gatc') && location.pathname === '/gatc' ? 'active' : ''}`} to="/gatc">
                      <i className="bi bi-speedometer2 me-1"></i> GATC Lab Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/gatc/test')}`} to="/gatc/test/APP-2026-102">
                      <i className="bi bi-cpu me-1"></i> Metrology Test Bench
                    </Link>
                  </li>
                </>
              )}

              {/* ADMIN MENU */}
              {currentRole === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`} to="/admin">
                      <i className="bi bi-speedometer2 me-1"></i> National Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin/applications')}`} to="/admin/applications">
                      <i className="bi bi-inbox-fill me-1"></i> Applications Desk
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin/instruments')}`} to="/admin/instruments">
                      <i className="bi bi-database me-1"></i> Instruments Registry
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin/stakeholders')}`} to="/admin/stakeholders">
                      <i className="bi bi-people-fill me-1"></i> Stakeholders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin/scheduling')}`} to="/admin/scheduling">
                      <i className="bi bi-calendar-event me-1"></i> Dispatch & Schedule
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin/certificates')}`} to="/admin/certificates">
                      <i className="bi bi-award-fill me-1"></i> Certificates & Revocation
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin/analytics')}`} to="/admin/analytics">
                      <i className="bi bi-graph-up-arrow me-1"></i> Analytics
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 ${isActive('/admin/logs')}`} to="/admin/logs">
                      <i className="bi bi-journal-text me-1"></i> Audit Ledger
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2 my-2 my-lg-0">
              <Link to="/verify" className="btn btn-sm btn-outline-primary fw-semibold">
                <i className="bi bi-search me-1"></i> Public Search
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* QR Scanner Modal Trigger */}
      <QRScannerModal isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} />
    </header>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QRScannerModal from '../../components/common/QRScannerModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/verify?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleRoleQuickJump = (role, path) => {
    switchRole(role);
    navigate(path);
  };

  return (
    <div className="landing-page-wrapper">
      {/* Hero Section */}
      <section className="gov-hero-section py-5 px-3 bg-navy text-white position-relative">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-white bg-opacity-10 rounded-pill mb-3 border border-light border-opacity-25">
                <span className="badge bg-warning text-dark fw-bold">NATIONAL PORTAL</span>
                <span className="small">Department of Consumer Affairs | Legal Metrology Division</span>
              </div>
              <h1 className="display-5 fw-bold mb-3 lh-sm">
                National Online Verification & Stamping Portal for Weights & Measures
              </h1>
              <p className="lead text-light-50 mb-4 fs-6">
                Ensuring precision, trust, and consumer protection across India. Digitally verify commercial weighing scales, fuel dispensers, weighbridges, and analytical balances with tamper-evident QR verification.
              </p>

              {/* Instant Verification Search Box */}
              <div className="bg-white p-3 rounded-3 shadow-lg text-dark mb-3">
                <label className="form-label fw-bold text-navy-dark small mb-1">
                  <i className="bi bi-shield-check text-primary me-1"></i> Instant Public Certificate Verification
                </label>
                <form onSubmit={handleSearch} className="d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 py-2"
                      placeholder="Enter Certificate No, Stamping Seal, or Serial No (e.g. CERT-2026-001)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary fw-bold px-4">
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQRModal(true)}
                    className="btn btn-warning fw-bold px-3 d-flex align-items-center gap-1"
                    title="Scan QR code on physical scale"
                  >
                    <i className="bi bi-qr-code-scan"></i> <span className="d-none d-md-inline">Scan QR</span>
                  </button>
                </form>
                <div className="mt-2 text-muted small" style={{ fontSize: '0.75rem' }}>
                  Try sample identifiers:{' '}
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 font-monospace text-primary text-decoration-none"
                    onClick={() => navigate('/certificate/CERT-2026-001')}
                  >
                    CERT-2026-001
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 font-monospace text-primary text-decoration-none"
                    onClick={() => navigate('/certificate/CERT-2025-912')}
                  >
                    CERT-2025-912
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 font-monospace text-primary text-decoration-none"
                    onClick={() => navigate('/certificate/CERT-2024-042')}
                  >
                    CERT-2024-042
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Quick Role Launch Cards */}
            <div className="col-lg-5">
              <div className="p-4 bg-white bg-opacity-10 backdrop-blur rounded-4 border border-light border-opacity-25 shadow">
                <h5 className="fw-bold mb-3 text-warning d-flex align-items-center gap-2">
                  <i className="bi bi-person-workspace"></i> Official Role Portals
                </h5>
                <div className="d-grid gap-2">
                  <button
                    onClick={() => handleRoleQuickJump('business', '/business')}
                    className="btn btn-light text-start p-3 d-flex align-items-center justify-content-between hover-shadow transition-all"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-warning-subtle text-warning-emphasis p-2 rounded-circle">
                        <i className="bi bi-shop fs-5"></i>
                      </div>
                      <div>
                        <strong className="d-block text-dark">Business Trader Portal</strong>
                        <small className="text-muted">Register instruments & submit verification applications</small>
                      </div>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                  </button>

                  <button
                    onClick={() => handleRoleQuickJump('lmo', '/lmo')}
                    className="btn btn-light text-start p-3 d-flex align-items-center justify-content-between hover-shadow transition-all"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary-subtle text-primary p-2 rounded-circle">
                        <i className="bi bi-patch-check-fill fs-5"></i>
                      </div>
                      <div>
                        <strong className="d-block text-dark">Legal Metrology Officer (LMO)</strong>
                        <small className="text-muted">Field digital checklist, MPE test table & stamping seals</small>
                      </div>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                  </button>

                  <button
                    onClick={() => handleRoleQuickJump('gatc', '/gatc')}
                    className="btn btn-light text-start p-3 d-flex align-items-center justify-content-between hover-shadow transition-all"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success-subtle text-success p-2 rounded-circle">
                        <i className="bi bi-cpu-fill fs-5"></i>
                      </div>
                      <div>
                        <strong className="d-block text-dark">GATC Precision Test Lab</strong>
                        <small className="text-muted">High precision calibration & laboratory test reports</small>
                      </div>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                  </button>

                  <button
                    onClick={() => handleRoleQuickJump('admin', '/admin')}
                    className="btn btn-light text-start p-3 d-flex align-items-center justify-content-between hover-shadow transition-all"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-danger-subtle text-danger p-2 rounded-circle">
                        <i className="bi bi-shield-check fs-5"></i>
                      </div>
                      <div>
                        <strong className="d-block text-dark">National Controller (Admin)</strong>
                        <small className="text-muted">Dispatch, allocation, analytics & tamper-evident audit logs</small>
                      </div>
                    </div>
                    <i className="bi bi-chevron-right text-muted"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live National Metrics Counter */}
      <section className="py-4 bg-light border-bottom">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-md-3 col-6">
              <div className="p-3 bg-white rounded shadow-sm border">
                <div className="fs-3 fw-bold text-navy-dark">1,48,920+</div>
                <div className="small text-muted fw-semibold">Instruments Registered</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 bg-white rounded shadow-sm border">
                <div className="fs-3 fw-bold text-success">98.4%</div>
                <div className="small text-muted fw-semibold">Verification Compliance</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 bg-white rounded shadow-sm border">
                <div className="fs-3 fw-bold text-primary">760+</div>
                <div className="small text-muted fw-semibold">LMO Inspection Zones</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="p-3 bg-white rounded shadow-sm border">
                <div className="fs-3 fw-bold text-warning">0.00%</div>
                <div className="small text-muted fw-semibold">Tamper Audit Failures</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Demonstration Grid */}
      <section className="py-5 px-3">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-1 text-uppercase fw-bold mb-2">
              Statutory Metrology Lifecycle (Legal Metrology Act, 2009)
            </span>
            <h2 className="fw-bold text-navy-dark">
              End-to-End Online Verification & Stamping Workflow
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '750px' }}>
              Transforming the manual, physical stamping regime into a transparent, secure, digital workflow under the Legal Metrology Act, 2009.
            </p>
          </div>

          <div className="row g-4">
            {/* Step 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-translate transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fs-2">🏢</span>
                    <span className="badge bg-secondary-subtle text-secondary fw-bold">STAGE 1</span>
                  </div>
                  <h5 className="fw-bold text-navy-dark mb-2">Trader Registration & Application</h5>
                  <p className="small text-muted mb-3">
                    Traders register device technical specifications, accuracy class (I-IV), capacity, verification interval, and physical GPS geolocation on Trust Scale.
                  </p>
                  <Link to="/business/register" className="btn btn-sm btn-outline-primary fw-semibold">
                    Explore Registration Wizard &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-translate transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fs-2">⚖️</span>
                    <span className="badge bg-primary-subtle text-primary fw-bold">STAGE 2</span>
                  </div>
                  <h5 className="fw-bold text-navy-dark mb-2">Admin Review & LMO Scheduling</h5>
                  <p className="small text-muted mb-3">
                    Legal Metrology Controller reviews verification requests, verifies fee receipts on Bharatkosh, and dispatches field inspection tasks to designated LMOs.
                  </p>
                  <Link to="/admin/applications" className="btn btn-sm btn-outline-primary fw-semibold">
                    View Dispatch Console &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-translate transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fs-2">🔍</span>
                    <span className="badge bg-warning-subtle text-warning fw-bold">STAGE 3</span>
                  </div>
                  <h5 className="fw-bold text-navy-dark mb-2">Digital Field Checklist & MPE Tests</h5>
                  <p className="small text-muted mb-3">
                    LMO visits premises with standard weights, conducts multi-point weight tolerance tests (Zero load, 1/3, 2/3, Full max, Corner test) with live error calculation.
                  </p>
                  <Link to="/lmo/inspect/APP-2026-103" className="btn btn-sm btn-outline-primary fw-semibold">
                    Launch Inspection Workbench &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-translate transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fs-2">🏷️</span>
                    <span className="badge bg-info-subtle text-info fw-bold">STAGE 4</span>
                  </div>
                  <h5 className="fw-bold text-navy-dark mb-2">Stamping Seal Tag Application</h5>
                  <p className="small text-muted mb-3">
                    Upon passing tolerance checks, LMO applies physical lead/holographic seal with auto-generated unique Tag No. (e.g. <code>LM-DL-2026-8812</code>) and captures photo evidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-translate transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fs-2">📜</span>
                    <span className="badge bg-success-subtle text-success fw-bold">STAGE 5</span>
                  </div>
                  <h5 className="fw-bold text-navy-dark mb-2">Digital Certificate Issuance</h5>
                  <p className="small text-muted mb-3">
                    System instantly issues a cryptographically signed Digital Certificate with SHA-256 hash, validity period, and embedded verification QR code.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-translate transition-all">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="fs-2">📲</span>
                    <span className="badge bg-success-subtle text-success fw-bold">STAGE 6</span>
                  </div>
                  <h5 className="fw-bold text-navy-dark mb-2">Public QR Verification & Transparency</h5>
                  <p className="small text-muted mb-3">
                    Consumers scan the QR sticker on the scale with their smartphone to immediately see genuine verification status, expiry date, and issuing officer.
                  </p>
                  <Link to="/verify" className="btn btn-sm btn-outline-primary fw-semibold">
                    Test Public QR Scanner &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consumer Rights & Anti-Fraud Awareness */}
      <section className="py-5 px-3 bg-light">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="badge bg-warning text-dark px-3 py-1 fw-bold mb-2">CONSUMER EMPOWERMENT</div>
              <h3 className="fw-bold text-navy-dark mb-3">
                How to Identify an Authentic Stamped Weighing Scale
              </h3>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
                <li className="d-flex gap-3">
                  <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-check-lg"></i>
                  </div>
                  <div>
                    <strong>Look for the Official Stamping QR Sticker:</strong> Every verified scale must display an intact holographic Trust Scale QR tag.
                  </div>
                </li>
                <li className="d-flex gap-3">
                  <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-check-lg"></i>
                  </div>
                  <div>
                    <strong>Check the Validity Year:</strong> Verification is mandatory annually for commercial scales and fuel MPDs.
                  </div>
                </li>
                <li className="d-flex gap-3">
                  <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-check-lg"></i>
                  </div>
                  <div>
                    <strong>Report Unstamped Instruments:</strong> Dial toll-free helpline <strong>1915</strong> or register a complaint on the National Consumer Portal.
                  </div>
                </li>
              </ul>
              <div className="d-flex gap-2">
                <Link to="/verify" className="btn btn-primary fw-semibold">
                  <i className="bi bi-shield-check me-1"></i> Verify a Scale Now
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm p-4 bg-white">
                <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                  <i className="bi bi-shield-check text-success me-2"></i> How Public Verification Works
                </h5>
                <div className="d-flex flex-column gap-3 small text-muted">
                  <div className="d-flex gap-2">
                    <i className="bi bi-1-circle-fill text-primary fs-5"></i>
                    <div>Scan the QR sticker on the instrument, or enter its Certificate Number / Stamping Seal Tag / Serial Number.</div>
                  </div>
                  <div className="d-flex gap-2">
                    <i className="bi bi-2-circle-fill text-primary fs-5"></i>
                    <div>The portal looks up that one record in the National Legal Metrology Registry — no other business data is ever listed publicly.</div>
                  </div>
                  <div className="d-flex gap-2">
                    <i className="bi bi-3-circle-fill text-primary fs-5"></i>
                    <div>You see the live status — VALID, EXPIRING SOON, EXPIRED, or REVOKED — with the issuing officer and office of record.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Scanner Modal Trigger */}
      <QRScannerModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
    </div>
  );
}

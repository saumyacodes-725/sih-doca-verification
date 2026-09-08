import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="gov-footer-wrapper mt-auto no-print text-white">
      {/* Top Footer Banner */}
      <div className="gov-footer-top py-4 px-3">
        <div className="container-fluid">
          <div className="row g-4">
            {/* Col 1: About Portal */}
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="fs-4">⚖️</span>
                <h5 className="fw-bold mb-0 text-warning">Trust Scale National Portal</h5>
              </div>
              <p className="small text-light-50 mb-3">
                Official Online Verification & Stamping Portal developed for the Legal Metrology Division,
                Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution,
                Government of India.
              </p>
              <div className="badge bg-primary text-white border p-2 text-start">
                <div className="small fw-bold">National Legal Metrology Portal (Trust Scale)</div>
                <div className="text-white-50" style={{ fontSize: '0.7rem' }}>
                  Unified Online Verification, Stamping & Consumer Protection Network
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold text-uppercase text-warning mb-3 small" style={{ letterSpacing: '0.5px' }}>
                Citizen Services
              </h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
                <li>
                  <Link to="/verify" className="text-light text-decoration-none hover-underline">
                    <i className="bi bi-chevron-right text-warning me-1"></i> Verify Certificate / QR
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-light text-decoration-none hover-underline">
                    <i className="bi bi-chevron-right text-warning me-1"></i> Consumer Rights Guide
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-light text-decoration-none hover-underline">
                    <i className="bi bi-chevron-right text-warning me-1"></i> Report Defective Scale
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-light text-decoration-none hover-underline">
                    <i className="bi bi-chevron-right text-warning me-1"></i> Trader / Officer Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Regulatory Framework */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-uppercase text-warning mb-3 small" style={{ letterSpacing: '0.5px' }}>
                Acts & Standards
              </h6>
              <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
                <li>
                  <span className="text-light">
                    <i className="bi bi-file-earmark-ruled text-warning me-1"></i> Legal Metrology Act, 2009
                  </span>
                </li>
                <li>
                  <span className="text-light">
                    <i className="bi bi-file-earmark-ruled text-warning me-1"></i> Legal Metrology (General) Rules, 2011
                  </span>
                </li>
                <li>
                  <span className="text-light">
                    <i className="bi bi-file-earmark-ruled text-warning me-1"></i> OIML International Recommendations
                  </span>
                </li>
                <li>
                  <span className="text-light">
                    <i className="bi bi-file-earmark-ruled text-warning me-1"></i> Consumer Protection Act, 2019
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 4: Consumer Helpline & Support */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold text-uppercase text-warning mb-3 small" style={{ letterSpacing: '0.5px' }}>
                Helpline & Grievance
              </h6>
              <div className="p-3 gov-footer-help-card rounded mb-2">
                <div className="small text-light-50">National Consumer Toll-Free:</div>
                <div className="fs-4 fw-bold text-warning">
                  <i className="bi bi-telephone-fill me-1"></i> 1915
                </div>
                <div className="small text-light-50">SMS / WhatsApp: 8800001915</div>
              </div>
              <div className="small text-light-50">
                <i className="bi bi-envelope-fill text-warning me-1"></i> support.metrology@doca.gov.in
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="gov-footer-bottom py-2 px-3 bg-navy-dark border-top border-secondary text-center small text-light-50">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center">
          <div>
            Website Content Managed by <strong>Department of Consumer Affairs, Government of India</strong>
          </div>
          <div>
            Designed & Maintained for <strong>Legal Metrology Division, DoCA</strong> | High-Trust e-Governance Digital Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}

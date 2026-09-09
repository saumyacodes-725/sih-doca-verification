import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_COLORS = {
  public: 'info',
  business: 'warning',
  lmo: 'primary',
  gatc: 'success',
  admin: 'danger'
};

const steps = [
  {
    step: 1,
    title: 'Register Instrument',
    role: 'business',
    path: '/business/register',
    desc: 'Trader registers weighing scale specs & GPS location'
  },
  {
    step: 2,
    title: 'Apply Verification',
    role: 'business',
    path: '/business/apply',
    desc: 'Trader submits application & simulates Bharatkosh fee payment'
  },
  {
    step: 3,
    title: 'Admin Review & Schedule',
    role: 'admin',
    path: '/admin/applications',
    desc: 'Controller assigns LMO & confirms inspection date'
  },
  {
    step: 4,
    title: 'LMO Field Inspection',
    role: 'lmo',
    path: '/lmo/inspect/APP-2026-103',
    desc: 'Inspector runs MPE test table & uploads evidence photos'
  },
  {
    step: 5,
    title: 'PASS & Stamping Seal',
    role: 'lmo',
    path: '/lmo/inspect/APP-2026-103',
    desc: 'System applies seal LM-DL-2026-XXXX & issues certificate'
  },
  {
    step: 6,
    title: 'Public QR Verification',
    role: 'public',
    path: '/verify',
    desc: 'Citizen/Consumer scans QR to verify green VALID certificate'
  }
];

export default function DemoWalkthroughBar() {
  const { currentRole, logout, handleResetData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Jumping to a step for a different role requires an actual login — this
  // logs the current session out and sends the user to /login instead of
  // silently authenticating as that step's role.
  const handleStepJump = (targetStep) => {
    if (targetStep.role === currentRole) {
      navigate(targetStep.path);
      return;
    }
    logout();
    navigate('/login');
  };

  return (
    <div className="portal-walkthrough-bar-wrapper border-bottom shadow-sm">
      <div className="bg-navy-dark text-white px-3 py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="badge bg-warning text-navy-dark fw-bold px-2 py-1">
            <i className="bi bi-compass-fill me-1"></i> PORTAL WORKFLOW GUIDE
          </span>
          <span className="small text-white-50 fw-medium d-none d-md-inline">
            End-to-End Statutory Verification &amp; Stamping Lifecycle Tour (Role-Based)
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className={`badge bg-${ROLE_COLORS[currentRole]}-subtle text-${ROLE_COLORS[currentRole]} border border-${ROLE_COLORS[currentRole]} px-2 py-1`}>
            Active View: <strong>{currentRole.toUpperCase()}</strong>
          </span>

          <button
            onClick={handleResetData}
            className="btn btn-sm btn-outline-light py-1 px-2"
            title="Reset portal data to default state"
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            <span className="d-none d-sm-inline">Reset Portal Data</span>
          </button>

          <div className="dropdown">
            <button
              className="btn btn-sm btn-warning text-navy-dark fw-bold py-1 px-2 dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-signpost-split-fill me-1"></i> Tour Steps
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg p-2 walkthrough-dropdown-menu">
              {steps.map((s) => {
                const isCurrentPath = location.pathname === s.path && currentRole === s.role;
                const color = ROLE_COLORS[s.role];
                return (
                  <li key={s.step}>
                    <button
                      onClick={() => handleStepJump(s)}
                      className={`dropdown-item rounded py-2 px-2 mb-1 ${isCurrentPath ? `bg-${color}-subtle` : ''}`}
                    >
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <span className="fw-bold text-navy-dark">
                          {s.step}. {s.title}
                        </span>
                        <span className={`badge bg-${color} text-white`} style={{ fontSize: '0.65rem' }}>
                          {s.role.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-muted small text-wrap" style={{ fontSize: '0.75rem' }}>
                        {s.desc}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

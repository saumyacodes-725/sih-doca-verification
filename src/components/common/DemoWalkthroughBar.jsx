import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DemoWalkthroughBar() {
  const { switchRole, currentRole, handleResetData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    {
      step: 1,
      title: '1. Register Instrument',
      role: 'business',
      path: '/business/register',
      desc: 'Trader registers weighing scale specs & GPS location'
    },
    {
      step: 2,
      title: '2. Apply Verification',
      role: 'business',
      path: '/business/apply',
      desc: 'Trader submits application & simulates Bharatkosh fee payment'
    },
    {
      step: 3,
      title: '3. Admin Review & Schedule',
      role: 'admin',
      path: '/admin/applications',
      desc: 'Controller assigns LMO & confirms inspection date'
    },
    {
      step: 4,
      title: '4. LMO Field Inspection',
      role: 'lmo',
      path: '/lmo/inspect/APP-2026-103',
      desc: 'Inspector runs MPE test table & uploads evidence photos'
    },
    {
      step: 5,
      title: '5. PASS & Stamping Seal',
      role: 'lmo',
      path: '/lmo/inspect/APP-2026-103',
      desc: 'System applies seal LM-DL-2026-XXXX & issues certificate'
    },
    {
      step: 6,
      title: '6. Public QR Verification',
      role: 'public',
      path: '/verify',
      desc: 'Citizen/Consumer scans QR to verify green VALID certificate'
    }
  ];

  const handleStepJump = (targetStep) => {
    switchRole(targetStep.role);
    navigate(targetStep.path);
  };

  return (
    <div className="portal-walkthrough-bar-wrapper border-bottom shadow-sm">
      <div className="bg-dark text-white px-3 py-1 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-warning text-dark fw-bold px-2 py-1">
            <i className="bi bi-compass-fill me-1"></i> PORTAL WORKFLOW GUIDE
          </span>
          <span className="small text-light fw-medium d-none d-md-inline">
            End-to-End Statutory Verification & Stamping Lifecycle Tour (Role-Based)
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleResetData}
            className="btn btn-sm btn-outline-warning py-0 px-2 text-warning"
            title="Reset portal data to default state"
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Portal Data
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-sm btn-outline-light py-0 px-2"
          >
            {collapsed ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-up"></i>}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="bg-navy-dark text-white p-2 px-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              {steps.map((s) => {
                const isCurrentPath = location.pathname === s.path && currentRole === s.role;
                return (
                  <button
                    key={s.step}
                    onClick={() => handleStepJump(s)}
                    className={`btn btn-sm text-start py-1 px-2 d-flex flex-column transition-all ${
                      isCurrentPath
                        ? 'btn-warning text-dark shadow fw-bold border-2'
                        : 'btn-outline-secondary text-light bg-dark-subtle border-secondary'
                    }`}
                    style={{ fontSize: '0.78rem', minWidth: '150px' }}
                    title={s.desc}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <span>{s.title}</span>
                      <span className="badge bg-secondary-subtle text-dark ms-1" style={{ fontSize: '0.65rem' }}>
                        {s.role.toUpperCase()}
                      </span>
                    </div>
                    <span
                      className="text-truncate text-white-50"
                      style={{ fontSize: '0.68rem', maxWidth: '170px' }}
                    >
                      {s.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="d-none d-lg-block text-end">
              <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1">
                Active View: <strong>{currentRole.toUpperCase()}</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

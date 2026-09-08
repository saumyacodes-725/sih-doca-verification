import React from 'react';

export default function LifecycleTracker({ currentStatus, application, certificate }) {
  const steps = [
    {
      key: 'REGISTERED',
      label: '1. Registered',
      sublabel: 'Instrument on Portal',
      icon: 'bi-box-seam'
    },
    {
      key: 'APPLICATION_SUBMITTED',
      label: '2. Applied & Paid',
      sublabel: application?.feeAmount || 'Fee Paid',
      icon: 'bi-file-earmark-check'
    },
    {
      key: 'SCHEDULED',
      label: '3. LMO Scheduled',
      sublabel: application?.assignedOfficerName || 'Officer Assigned',
      icon: 'bi-calendar-check'
    },
    {
      key: 'IN_PROGRESS',
      label: '4. Field Inspection',
      sublabel: 'MPE Tests & Checklist',
      icon: 'bi-speedometer2'
    },
    {
      key: 'COMPLETED',
      label: '5. Stamping & Passed',
      sublabel: certificate?.stampingSealNumber || 'Seal Applied',
      icon: 'bi-patch-check-fill'
    },
    {
      key: 'VERIFIED',
      label: '6. Digital Cert Active',
      sublabel: certificate?.certificateNumber || 'QR Validated',
      icon: 'bi-qr-code'
    }
  ];

  // Helper to determine stage number (1-6)
  const getStageIndex = (status) => {
    switch (status) {
      case 'REGISTERED':
        return 1;
      case 'APPLICATION_SUBMITTED':
      case 'PENDING_REVIEW':
        return 2;
      case 'APPROVED':
      case 'SCHEDULED':
        return 3;
      case 'IN_PROGRESS':
        return 4;
      case 'COMPLETED':
      case 'PASSED':
        return 5;
      case 'VALID':
      case 'VERIFIED':
        return 6;
      case 'FAILED':
      case 'REJECTED':
      case 'EXPIRED':
      case 'REVOKED':
        return 5;
      default:
        return 2;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="lifecycle-stepper-container p-3 bg-white rounded border shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-navy-dark mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-diagram-3-fill text-primary"></i> Verification Lifecycle Progress
        </h6>
        <span className="badge bg-light text-dark border">
          Current State: <strong>{currentStatus}</strong>
        </span>
      </div>

      <div className="lifecycle-stepper-track d-flex justify-content-between position-relative">
        <div className="lifecycle-line"></div>
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentIndex || (stepNum === currentIndex && (currentStatus === 'VERIFIED' || currentStatus === 'COMPLETED'));
          const isActive = stepNum === currentIndex && currentStatus !== 'VERIFIED';
          const isFailed = (currentStatus === 'FAILED' || currentStatus === 'REJECTED') && stepNum >= 4;

          let bubbleClass = 'bg-light text-muted border';
          if (isDone) bubbleClass = 'bg-success text-white shadow-sm';
          else if (isActive) bubbleClass = 'bg-primary text-white shadow ring-pulse';
          else if (isFailed && stepNum === 5) bubbleClass = 'bg-danger text-white';

          return (
            <div key={step.key} className="lifecycle-step-item text-center position-relative" style={{ zIndex: 2, width: '16%' }}>
              <div
                className={`lifecycle-bubble rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1 ${bubbleClass}`}
                style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}
              >
                {isDone ? (
                  <i className="bi bi-check-lg fw-bold"></i>
                ) : isFailed && stepNum === 5 ? (
                  <i className="bi bi-x-lg fw-bold"></i>
                ) : (
                  <i className={`bi ${step.icon}`}></i>
                )}
              </div>
              <div className="lifecycle-label fw-bold text-dark" style={{ fontSize: '0.72rem' }}>
                {step.label}
              </div>
              <div className="lifecycle-sublabel text-muted text-truncate" style={{ fontSize: '0.65rem' }}>
                {step.sublabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

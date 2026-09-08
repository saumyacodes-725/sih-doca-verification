import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplications } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';
import LifecycleTracker from '../../components/lifecycle/LifecycleTracker';

export default function VerificationApplicationsPage() {
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [allApps, setAllApps] = useState([]);

  useEffect(() => {
    getApplications().then(setAllApps).catch(() => setAllApps([]));
  }, []);

  const myApps = allApps.filter(
    (a) => a.applicantTraderId === currentUser.id || a.applicantName.includes('Apex') || !a.applicantTraderId
  );

  const filtered = myApps.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="applications-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / Business Trader / Verification Applications
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-file-earmark-text text-warning me-2"></i> Verification & Stamping Applications
            </h3>
            <p className="text-muted small mb-0">
              Track the statutory lifecycle of verification requests from submission to on-site stamping.
            </p>
          </div>

          <Link to="/business/apply" className="btn btn-primary fw-bold shadow-sm">
            <i className="bi bi-plus-circle-fill me-1"></i> Apply for Verification / Stamping
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex gap-2 align-items-center">
              <span className="small fw-bold text-muted">Filter Applications:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                All ({myApps.length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING_REVIEW')}
                className={`btn btn-sm ${statusFilter === 'PENDING_REVIEW' ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setStatusFilter('SCHEDULED')}
                className={`btn btn-sm ${statusFilter === 'SCHEDULED' ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`btn btn-sm ${statusFilter === 'COMPLETED' ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                Completed / Stamped
              </button>
            </div>
          </div>
        </div>

        {/* Applications List & Selected Timeline Drawer */}
        <div className="row g-4">
          <div className="col-lg-8 col-12">
            <div className="card border-0 shadow-sm bg-white">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Application ID</th>
                      <th>Instrument</th>
                      <th>Type & Fee</th>
                      <th>Assigned LMO / Slot</th>
                      <th>Status</th>
                      <th className="text-end">Lifecycle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No applications found for current filter.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((app) => (
                        <tr
                          key={app.id}
                          className={selectedApp?.id === app.id ? 'table-primary-subtle' : ''}
                        >
                          <td>
                            <strong className="font-monospace text-primary">{app.id}</strong>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                              {app.submittedDate}
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{app.instrumentName}</div>
                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                              ID: {app.instrumentId}
                            </span>
                          </td>
                          <td>
                            <div className="text-dark">{app.applicationType}</div>
                            <span className="badge bg-light text-dark border">{app.feeAmount} (Paid)</span>
                          </td>
                          <td>
                            {app.assignedOfficerName ? (
                              <div>
                                <div className="fw-semibold text-dark">
                                  <i className="bi bi-person-badge text-primary me-1"></i>
                                  {app.assignedOfficerName}
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                  {app.scheduledDate} ({app.scheduledTimeSlot})
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">Awaiting Admin Allocation</span>
                            )}
                          </td>
                          <td>
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="text-end">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="btn btn-sm btn-outline-primary fw-semibold"
                            >
                              <i className="bi bi-diagram-3 me-1"></i> Track
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lifecycle Details Panel */}
          <div className="col-lg-4 col-12">
            {selectedApp ? (
              <div className="card border-0 shadow-sm bg-white p-3">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h6 className="fw-bold text-navy-dark mb-0">
                    <i className="bi bi-info-circle text-primary me-2"></i> Application Status Timeline
                  </h6>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="btn btn-sm btn-close"
                  ></button>
                </div>

                <div className="mb-3">
                  <LifecycleTracker currentStatus={selectedApp.status} application={selectedApp} />
                </div>

                <div className="p-3 bg-light rounded small mb-3 border">
                  <h6 className="fw-bold text-dark mb-2">Application Metadata</h6>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Application ID:</span>
                    <strong className="font-monospace">{selectedApp.id}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Instrument:</span>
                    <span>{selectedApp.instrumentName}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Bharatkosh Txn:</span>
                    <span className="font-monospace">{selectedApp.feeTransactionId}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Premise Address:</span>
                    <span className="text-end" style={{ maxWidth: '60%' }}>{selectedApp.premiseAddress}</span>
                  </div>
                </div>

                {/* Audit history events */}
                <h6 className="fw-bold text-navy-dark small mb-2 text-uppercase">Application Audit Trail</h6>
                <div className="timeline-container border-start ps-3 ms-2 small">
                  {(selectedApp.history || []).map((h, i) => (
                    <div key={i} className="mb-2 position-relative">
                      <div className="timeline-dot"></div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>{h.date}</div>
                      <div className="text-dark fw-semibold">{h.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm bg-white p-4 text-center text-muted">
                <i className="bi bi-hand-index-thumb fs-1 mb-2 text-primary opacity-50"></i>
                <h6 className="fw-bold text-dark">Select an Application</h6>
                <p className="small mb-0">Click "Track" on any verification row to see the live statutory lifecycle stepper and audit trail.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

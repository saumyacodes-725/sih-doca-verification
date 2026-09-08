import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getInstruments, getCertificates, getAuditLogs } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [allInstruments, setAllInstruments] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [allCertificates, setAllCertificates] = useState([]);
  const allAuditLogs = getAuditLogs();

  useEffect(() => {
    getInstruments().then(setAllInstruments).catch(() => setAllInstruments([]));
    getApplications().then(setAllApplications).catch(() => setAllApplications([]));
    getCertificates().then(setAllCertificates).catch(() => setAllCertificates([]));
  }, []);

  const pendingApps = allApplications.filter((a) => a.status === 'PENDING_REVIEW');
  const validCerts = allCertificates.filter((c) => c.status === 'VALID');
  const expiringCerts = allCertificates.filter((c) => c.status === 'EXPIRING_SOON');
  const expiredCerts = allCertificates.filter((c) => c.status === 'EXPIRED');
  const revokedCerts = allCertificates.filter((c) => c.status === 'REVOKED');

  return (
    <div className="admin-dashboard py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / National Command / Controller Dashboard
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-shield-check text-danger me-2"></i> National Legal Metrology Command Center
            </h3>
            <div className="text-muted small">
              Controller: <strong>{currentUser.name}</strong> | Department of Consumer Affairs (DoCA), Govt of India
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/admin/applications" className="btn btn-danger fw-bold shadow-sm">
              <i className="bi bi-inbox-fill me-1"></i> Applications Desk ({pendingApps.length} Pending)
            </Link>
            <Link to="/admin/scheduling" className="btn btn-primary fw-bold shadow-sm">
              <i className="bi bi-calendar-event me-1"></i> Dispatch & Schedule
            </Link>
          </div>
        </div>

        {/* National KPIs */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">National Registry Fleet</div>
                  <div className="fs-3 fw-bold text-navy-dark">{allInstruments.length + 148900}</div>
                </div>
                <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                  <i className="bi bi-database fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                Across 28 States & 8 UTs
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Active Valid Certificates</div>
                  <div className="fs-3 fw-bold text-success">{validCerts.length + 142000}</div>
                </div>
                <div className="p-3 bg-success-subtle text-success rounded-circle">
                  <i className="bi bi-patch-check-fill fs-4"></i>
                </div>
              </div>
              <div className="small text-success mt-2 border-top pt-2">
                <i className="bi bi-check-lg me-1"></i> 98.4% Compliance Rate
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Pending Review Queue</div>
                  <div className="fs-3 fw-bold text-danger">{pendingApps.length}</div>
                </div>
                <div className="p-3 bg-danger-subtle text-danger rounded-circle">
                  <i className="bi bi-hourglass-top fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                Awaiting officer allocation
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Bharatkosh Revenue</div>
                  <div className="fs-4 fw-bold text-navy-dark mt-1">₹ 18.42 Cr</div>
                </div>
                <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-circle">
                  <i className="bi bi-cash-stack fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                FY 2026-27 Stamping Fees
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Breakdown Visuals */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            {/* Pending Applications Dispatch Queue */}
            <div className="card border-0 shadow-sm bg-white mb-4">
              <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
                <h5 className="fw-bold text-navy-dark mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-inbox text-danger"></i> Urgent Applications Awaiting LMO Assignment
                </h5>
                <Link to="/admin/applications" className="btn btn-sm btn-outline-danger fw-semibold">
                  Manage Desk ({pendingApps.length}) &rarr;
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>App ID</th>
                      <th>Trader & Establishment</th>
                      <th>Instrument & Accuracy</th>
                      <th>Zone / Premise</th>
                      <th>Fee Status</th>
                      <th className="text-end">Assign Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allApplications.slice(0, 4).map((app) => (
                      <tr key={app.id}>
                        <td>
                          <strong className="font-monospace text-primary">{app.id}</strong>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>{app.submittedDate}</div>
                        </td>
                        <td>
                          <div className="fw-bold text-dark">{app.applicantName}</div>
                          <span className="text-muted" style={{ fontSize: '0.7rem' }}>{app.contactPhone}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{app.instrumentName}</div>
                          <span className="badge bg-info-subtle text-info border">{app.accuracyClass}</span>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '180px' }}>{app.premiseAddress}</div>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success border">{app.feeAmount} (Paid)</span>
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/admin/applications?assignAppId=${app.id}`}
                            className="btn btn-sm btn-outline-danger fw-bold"
                          >
                            Assign LMO &rarr;
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* National Stamping Compliance Breakdown */}
            <div className="card border-0 shadow-sm bg-white p-4">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-pie-chart text-primary me-2"></i> Certificate Status Distribution (Nationwide)
              </h5>
              <div className="row g-3 text-center">
                <div className="col-md-3 col-6">
                  <div className="p-3 bg-success-subtle rounded border border-success-subtle">
                    <div className="fs-4 fw-bold text-success">92.6%</div>
                    <div className="small fw-semibold text-dark">VALID</div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="p-3 bg-warning-subtle rounded border border-warning-subtle">
                    <div className="fs-4 fw-bold text-warning-emphasis">4.8%</div>
                    <div className="small fw-semibold text-dark">EXPIRING SOON</div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="p-3 bg-danger-subtle rounded border border-danger-subtle">
                    <div className="fs-4 fw-bold text-danger">2.1%</div>
                    <div className="small fw-semibold text-dark">EXPIRED</div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="p-3 bg-dark-subtle rounded border border-secondary">
                    <div className="fs-4 fw-bold text-danger">0.5%</div>
                    <div className="small fw-semibold text-dark">REVOKED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Tamper-Evident Audit Stream */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm bg-white mb-4">
              <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
                <h6 className="fw-bold text-navy-dark mb-0">
                  <i className="bi bi-journal-text text-primary me-2"></i> Real-Time Audit Stream
                </h6>
                <Link to="/admin/logs" className="small text-decoration-none">
                  All Logs &rarr;
                </Link>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-3">
                  {allAuditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-2 border-start border-3 border-primary bg-light-subtle rounded-end small">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-secondary-subtle text-dark" style={{ fontSize: '0.65rem' }}>
                          {log.action}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>{log.timestamp}</span>
                      </div>
                      <div className="text-dark fw-semibold" style={{ fontSize: '0.75rem' }}>{log.actor}</div>
                      <div className="text-muted text-truncate" style={{ fontSize: '0.7rem' }}>{log.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card border-0 shadow-sm bg-navy-dark text-white p-3 rounded-3">
              <h6 className="fw-bold text-warning mb-2">
                <i className="bi bi-shield-slash me-2"></i> Certificate Revocation Console
              </h6>
              <p className="small text-light-50 mb-3">
                Revoke compromised, tampered, or disputed stamping certificates with cryptographic audit logs.
              </p>
              <Link to="/admin/certificates" className="btn btn-sm btn-danger fw-bold">
                Open Certificates Registry &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

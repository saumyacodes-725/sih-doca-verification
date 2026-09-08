import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getCertificates } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';

export default function LmoDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [allApplications, setAllApplications] = useState([]);
  const [allCertificates, setAllCertificates] = useState([]);

  useEffect(() => {
    getApplications().then(setAllApplications).catch(() => setAllApplications([]));
    getCertificates().then(setAllCertificates).catch(() => setAllCertificates([]));
  }, []);

  // Filter applications assigned to this LMO or active in North zone
  const assignedApps = allApplications.filter(
    (a) => a.assignedOfficerId === currentUser.id || a.assignedOfficerName?.includes('Rajesh') || a.status === 'SCHEDULED' || a.status === 'PENDING_REVIEW'
  );

  const pendingInspections = assignedApps.filter((a) => a.status === 'SCHEDULED' || a.status === 'PENDING_REVIEW');
  const completedInspections = allApplications.filter((a) => a.status === 'COMPLETED');

  return (
    <div className="lmo-dashboard py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / Enforcement Portal / Officer Dashboard
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-patch-check-fill text-primary me-2"></i> Legal Metrology Officer Console
            </h3>
            <div className="text-muted small">
              Officer: <strong>{currentUser.name}</strong> | Badge: <span className="font-monospace text-primary fw-bold">DOCA-LM-1092</span> | Stamping Kit: <span className="badge bg-dark text-warning">STAMP-KIT-DL-44</span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/lmo/assigned" className="btn btn-primary fw-bold shadow-sm">
              <i className="bi bi-list-check me-1"></i> View Assigned Queue ({pendingInspections.length})
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Pending Field Audits</div>
                  <div className="fs-3 fw-bold text-navy-dark">{pendingInspections.length}</div>
                </div>
                <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                  <i className="bi bi-clipboard-data fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                Scheduled for on-site inspection
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Inspections Completed</div>
                  <div className="fs-3 fw-bold text-success">{completedInspections.length + 340}</div>
                </div>
                <div className="p-3 bg-success-subtle text-success rounded-circle">
                  <i className="bi bi-check2-circle fs-4"></i>
                </div>
              </div>
              <div className="small text-success mt-2 border-top pt-2">
                <i className="bi bi-award-fill me-1"></i> 99.4% Compliance Rate
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Stamping Seals Applied</div>
                  <div className="fs-3 fw-bold text-warning-emphasis">{allCertificates.length + 310}</div>
                </div>
                <div className="p-3 bg-warning-subtle text-warning rounded-circle">
                  <i className="bi bi-tag-fill fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                Tamper-evident holographic tags
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Designated Territory</div>
                  <div className="fs-5 fw-bold text-navy-dark mt-1">South Delhi Zone</div>
                </div>
                <div className="p-3 bg-info-subtle text-info rounded-circle">
                  <i className="bi bi-geo-alt-fill fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                Office of Asst. Controller, DoCA
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Verifications Table */}
        <div className="card border-0 shadow-sm bg-white mb-4">
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
            <h5 className="fw-bold text-navy-dark mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-tools text-primary"></i> Assigned On-Site Field Verifications
            </h5>
            <span className="badge bg-primary px-3 py-1">Active Queue: {assignedApps.length}</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>App ID</th>
                  <th>Instrument & Establishment</th>
                  <th>Type & Accuracy Class</th>
                  <th>Premise Address</th>
                  <th>Scheduled Slot</th>
                  <th>Status</th>
                  <th className="text-end">Field Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong className="font-monospace text-primary">{app.id}</strong>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Submitted: {app.submittedDate}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{app.instrumentName}</div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                        Trader: {app.applicantName} ({app.contactPhone})
                      </div>
                    </td>
                    <td>
                      <div>{app.applicationType}</div>
                      <span className="badge bg-info-subtle text-info border">{app.accuracyClass}</span>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        <i className="bi bi-geo-alt text-danger me-1"></i>
                        {app.premiseAddress}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">
                        {app.scheduledDate || 'Awaiting Date'}
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {app.scheduledTimeSlot || 'Standard Slot'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/lmo/inspect/${app.id}`}
                        className="btn btn-sm btn-warning text-dark fw-bold shadow-sm"
                        title="Start Digital Field Inspection"
                      >
                        <i className="bi bi-tools me-1"></i> Conduct Inspection
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

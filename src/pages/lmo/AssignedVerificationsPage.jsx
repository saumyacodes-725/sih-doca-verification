import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplications } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';

export default function AssignedVerificationsPage() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [allApps, setAllApps] = useState([]);

  useEffect(() => {
    getApplications().then(setAllApps).catch(() => setAllApps([]));
  }, []);

  const assigned = allApps.filter(
    (a) => a.assignedOfficerId === currentUser.id || a.assignedOfficerName?.includes('Rajesh') || true
  );

  const filtered = assigned.filter((a) => {
    const matchesSearch =
      !search.trim() ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      a.instrumentName.toLowerCase().includes(search.toLowerCase()) ||
      a.premiseAddress.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="assigned-verifications-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / Enforcement Portal / Assigned Inspections
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-list-check text-primary me-2"></i> Field Verification Queue
            </h3>
            <p className="text-muted small mb-0">
              List of verification and stamping appointments assigned by the Central Dispatch Controller.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-lg-6 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by Trader, App ID, Instrument, Address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Inspection Statuses</option>
                <option value="SCHEDULED">SCHEDULED (Action Required)</option>
                <option value="PENDING_REVIEW">PENDING REVIEW</option>
                <option value="COMPLETED">COMPLETED / STAMPED</option>
                <option value="REJECTED">REJECTED / FAILED</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Cards / Table */}
        <div className="card border-0 shadow-sm bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Application ID</th>
                  <th>Establishment & Contact</th>
                  <th>Instrument Details</th>
                  <th>Site Location</th>
                  <th>Scheduled Date & Slot</th>
                  <th>Status</th>
                  <th className="text-end">Inspection Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong className="font-monospace text-primary">{app.id}</strong>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Type: {app.applicationType}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{app.applicantName}</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        <i className="bi bi-telephone me-1"></i> {app.contactPhone}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{app.instrumentName}</div>
                      <span className="badge bg-light text-dark border">{app.accuracyClass}</span>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '220px' }}>
                        <i className="bi bi-geo-alt text-danger me-1"></i> {app.premiseAddress}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{app.scheduledDate || '2026-08-25'}</div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {app.scheduledTimeSlot || '10:30 AM - 01:00 PM'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/lmo/inspect/${app.id}`}
                        className="btn btn-sm btn-warning text-dark fw-bold shadow-sm"
                      >
                        <i className="bi bi-tools me-1"></i> Field Audit &rarr;
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

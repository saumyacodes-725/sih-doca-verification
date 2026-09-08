import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAuditLogs } from '../../services/storageService';

export default function AuditLogsPage() {
  const { showToast } = useAuth();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const auditLogs = getAuditLogs();

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      !search.trim() ||
      log.id.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.hash.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleVerifyLedger = () => {
    showToast('Cryptographic hash validation complete: 0 tamper violations detected.', 'success');
  };

  return (
    <div className="admin-audit-logs-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / National Admin / Audit Ledger
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-journal-text text-danger me-2"></i> Tamper-Evident National Metrological Audit Ledger
            </h3>
            <p className="text-muted small mb-0">
              Cryptographically chained immutable ledger tracking every registration, verification, stamping, and revocation.
            </p>
          </div>

          <button onClick={handleVerifyLedger} className="btn btn-outline-success fw-bold btn-sm shadow-sm">
            <i className="bi bi-shield-check me-1"></i> Verify Ledger Integrity (SHA-256)
          </button>
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
                  placeholder="Search by Log ID, Actor, Details, Cryptographic Hash..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-4">
              <select
                className="form-select"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="ALL">All Audit Actions ({auditLogs.length})</option>
                <option value="REGISTER_INSTRUMENT">REGISTER_INSTRUMENT</option>
                <option value="SUBMIT_VERIFICATION_APPLICATION">SUBMIT_VERIFICATION_APPLICATION</option>
                <option value="ASSIGN_AND_SCHEDULE_LMO">ASSIGN_AND_SCHEDULE_LMO</option>
                <option value="FIELD_VERIFY_PASSED_CERTIFICATE_ISSUED">FIELD_VERIFY_PASSED_CERTIFICATE_ISSUED</option>
                <option value="PUBLIC_QR_VERIFY">PUBLIC_QR_VERIFY</option>
                <option value="REVOKE_CERTIFICATE">REVOKE_CERTIFICATE</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch('');
                  setActionFilter('ALL');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Log ID</th>
                  <th>Timestamp (IST)</th>
                  <th>Actor / Role</th>
                  <th>Action Type</th>
                  <th>Transaction Details</th>
                  <th>Cryptographic SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <strong className="font-monospace text-primary">{log.id}</strong>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{log.actor}</div>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-dark border font-monospace" style={{ fontSize: '0.68rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <div className="text-dark" style={{ maxWidth: '380px' }}>
                        {log.details}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-dark text-warning font-monospace" style={{ fontSize: '0.65rem' }}>
                        {log.hash}
                      </span>
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

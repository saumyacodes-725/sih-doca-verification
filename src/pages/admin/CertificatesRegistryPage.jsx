import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCertificates, revokeCertificate } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';
import CertificateModal from '../../components/common/CertificateModal';

export default function CertificatesRegistryPage() {
  const { showToast } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCert, setSelectedCert] = useState(null);

  // Revocation Modal
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeReason, setRevokeReason] = useState('Reported broken physical seal and unauthorized tampering under Section 30 of Legal Metrology Act, 2009.');

  const refreshCertificates = () => getCertificates().then(setCertificates).catch(() => setCertificates([]));

  useEffect(() => {
    refreshCertificates();
  }, []);

  const handleOpenRevoke = (cert) => {
    setRevokeTarget(cert);
    setShowRevokeModal(true);
  };

  const handleConfirmRevocation = async (e) => {
    e.preventDefault();
    if (!revokeTarget) return;

    try {
      await revokeCertificate(revokeTarget.id, revokeReason);
      await refreshCertificates();
      setShowRevokeModal(false);
      showToast(`Certificate ${revokeTarget.certificateNumber} has been REVOKED!`, 'danger');
    } catch (error) {
      showToast(error.message || 'Failed to revoke certificate', 'danger');
    }
  };

  const filtered = certificates.filter((c) => {
    const matchesSearch =
      !search.trim() ||
      c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.stampingSealNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      c.instrumentType.toLowerCase().includes(search.toLowerCase()) ||
      c.serialNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-certificates-registry py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / National Admin / Certificates Vault
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-award-fill text-danger me-2"></i> Master Digital Certificates Vault & Revocation
            </h3>
            <p className="text-muted small mb-0">
              National registry of verified certificates, cryptographic hashes, and statutory revocation management.
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
                  placeholder="Search by Certificate No, Stamping Tag, Trader, Serial..."
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
                <option value="ALL">All Certificate Statuses ({certificates.length})</option>
                <option value="VALID">VALID</option>
                <option value="EXPIRING_SOON">EXPIRING SOON</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="REVOKED">REVOKED</option>
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

        {/* Certificates Table */}
        <div className="card border-0 shadow-sm bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Certificate Number</th>
                  <th>Stamping Tag Seal</th>
                  <th>Instrument & Serial</th>
                  <th>Owner Establishment</th>
                  <th>Valid Period</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert) => (
                  <tr key={cert.id}>
                    <td>
                      <strong className="font-monospace text-primary">{cert.certificateNumber}</strong>
                      <div className="text-muted font-monospace" style={{ fontSize: '0.65rem' }}>
                        {cert.digitalHash?.slice(0, 20)}...
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-dark text-warning border font-monospace">
                        <i className="bi bi-tag-fill me-1"></i> {cert.stampingSealNumber}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{cert.instrumentType}</div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>SN: {cert.serialNumber}</span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{cert.ownerName}</div>
                      <span className="text-muted font-monospace" style={{ fontSize: '0.68rem' }}>{cert.businessRegNo}</span>
                    </td>
                    <td>
                      <div className={cert.status === 'VALID' ? 'text-success fw-bold' : 'text-danger'}>
                        {cert.issueDate} to {cert.expiryDate}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="btn btn-sm btn-outline-primary me-1 fw-semibold"
                      >
                        <i className="bi bi-eye"></i> View
                      </button>
                      {cert.status !== 'REVOKED' && (
                        <button
                          onClick={() => handleOpenRevoke(cert)}
                          className="btn btn-sm btn-outline-danger"
                          title="Revoke Certificate"
                        >
                          <i className="bi bi-slash-circle"></i> Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Certificate Modal */}
        {selectedCert && (
          <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
        )}

        {/* Revoke Modal */}
        {showRevokeModal && revokeTarget && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1080 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-danger text-white py-2 px-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-slash-circle-fill fs-5"></i>
                    <h6 className="modal-title fw-bold mb-0">
                      Revoke Legal Metrology Certificate — {revokeTarget.certificateNumber}
                    </h6>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowRevokeModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleConfirmRevocation}>
                  <div className="modal-body p-4">
                    <div className="alert alert-danger small p-3 mb-3">
                      <strong>WARNING:</strong> Revoking this certificate will immediately invalidate the physical stamping seal and flag the instrument as non-compliant on the public QR verification registry.
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Statutory Grounds for Revocation</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={revokeReason}
                        onChange={(e) => setRevokeReason(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="modal-footer bg-light py-2 px-3">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowRevokeModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger btn-sm fw-bold px-3">
                      Confirm Immediate Revocation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

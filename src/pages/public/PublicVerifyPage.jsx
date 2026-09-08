import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyCertificatePublic } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';
import CertificateModal from '../../components/common/CertificateModal';
import QRScannerModal from '../../components/common/QRScannerModal';

export default function PublicVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const runLookup = useCallback((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSearching(true);
    setSearched(true);
    verifyCertificatePublic(trimmed)
      .then(setResult)
      .catch(() => setResult(null))
      .finally(() => setSearching(false));
  }, []);

  useEffect(() => {
    if (initialQuery) {
      runLookup(initialQuery);
    }
  }, [initialQuery, runLookup]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    runLookup(query);
  };

  const filteredCerts = result ? [result] : [];

  return (
    <div className="public-verify-container py-4 px-3">
      <div className="container">
        {/* Breadcrumb & Header */}
        <div className="mb-4">
          <div className="small text-muted mb-1">
            <span className="text-primary">Trust Scale</span> / Public Services / Certificate Verification
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h3 className="fw-bold text-navy-dark mb-1">
                <i className="bi bi-shield-check text-success me-2"></i> National Certificate & Stamping Verification
              </h3>
              <p className="text-muted small mb-0">
                Official real-time verification database under Section 24 of The Legal Metrology Act, 2009.
              </p>
            </div>
            <button
              onClick={() => setShowQRModal(true)}
              className="btn btn-warning fw-bold d-flex align-items-center gap-2 shadow-sm"
            >
              <i className="bi bi-qr-code-scan"></i> Scan Physical QR Tag
            </button>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
          <form className="row g-3 align-items-end" onSubmit={handleSearchSubmit}>
            <div className="col-lg-9 col-md-8">
              <label className="form-label small fw-bold text-muted mb-1">Search Identifier</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Certificate No, Stamping Tag (e.g. LM-DL-2026-8812), Serial No"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => { setQuery(''); setResult(null); setSearched(false); }}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-lg-3 col-md-4">
              <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={searching || !query.trim()}>
                {searching ? 'Searching…' : 'Verify Certificate'}
              </button>
            </div>
          </form>
        </div>

        {/* Results List */}
        <div className="row g-3">
          {!searched ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm p-5 text-center bg-white">
                <div className="fs-1 text-muted mb-2">🔎</div>
                <h5 className="fw-bold text-navy-dark">Enter a Certificate or Stamping Tag Number</h5>
                <p className="text-muted small mx-auto" style={{ maxWidth: '500px' }}>
                  Search by Certificate Number, Stamping Seal Tag, or Instrument Serial Number to verify authenticity.
                </p>
              </div>
            </div>
          ) : filteredCerts.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm p-5 text-center bg-white">
                <div className="fs-1 text-muted mb-2">🔍</div>
                <h5 className="fw-bold text-navy-dark">No Verification Records Found</h5>
                <p className="text-muted small mx-auto" style={{ maxWidth: '500px' }}>
                  No certificate or stamping record matched your query "{query}". Please double-check the Certificate ID or Stamping Seal Tag number.
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => { setQuery(''); setResult(null); setSearched(false); }}
                    className="btn btn-sm btn-primary"
                  >
                    Search Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            filteredCerts.map((cert) => (
              <div key={cert.id} className="col-lg-6 col-12">
                <div className="card border-0 shadow-sm h-100 hover-shadow transition-all bg-white">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-primary-subtle text-primary font-monospace px-2 py-1 mb-1">
                          {cert.certificateNumber}
                        </span>
                        <h5 className="fw-bold text-navy-dark mb-1">{cert.instrumentType}</h5>
                        <div className="small text-muted">{cert.manufacturer} — {cert.model}</div>
                      </div>
                      <StatusBadge status={cert.status} />
                    </div>

                    <div className="p-3 bg-light rounded my-3 border small">
                      <div className="row g-2">
                        <div className="col-6">
                          <span className="text-muted d-block">Stamping Tag Seal:</span>
                          <strong className="text-dark font-monospace">
                            <i className="bi bi-tag-fill text-warning me-1"></i>
                            {cert.stampingSealNumber}
                          </strong>
                        </div>
                        <div className="col-6">
                          <span className="text-muted d-block">Instrument Serial:</span>
                          <strong className="text-dark font-monospace">{cert.serialNumber}</strong>
                        </div>
                        <div className="col-12 border-top pt-2 mt-2">
                          <span className="text-muted d-block">Trader / Establishment:</span>
                          <strong className="text-dark">{cert.ownerName}</strong>
                          <div className="text-muted text-truncate">{cert.establishmentAddress}</div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                      <div className="small">
                        <span className="text-muted">Valid Period:</span>{' '}
                        <strong className={cert.status === 'VALID' ? 'text-success' : 'text-danger'}>
                          {cert.issueDate} to {cert.expiryDate}
                        </strong>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="btn btn-sm btn-outline-primary fw-semibold"
                        >
                          <i className="bi bi-eye me-1"></i> View Certificate
                        </button>
                        <button
                          onClick={() => navigate(`/certificate/${cert.id}`)}
                          className="btn btn-sm btn-primary fw-semibold"
                          title="Direct permalink"
                        >
                          <i className="bi bi-link-45deg me-1"></i> Direct Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
}

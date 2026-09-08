import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { verifyCertificatePublic } from '../../services/storageService';
import { QRCodeSVG } from 'qrcode.react';
import StatusBadge from '../../components/common/StatusBadge';

export default function CertificateResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    verifyCertificatePublic(id)
      .then(setCert)
      .catch(() => setCert(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm p-5 max-w-md mx-auto bg-white" style={{ maxWidth: '600px' }}>
          <div className="fs-1 text-danger mb-3">⚠️</div>
          <h4 className="fw-bold text-navy-dark">Certificate Record Not Found</h4>
          <p className="text-muted small">
            The verification certificate ID <strong>{id}</strong> could not be located on the National Legal Metrology Registry.
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Link to="/verify" className="btn btn-primary btn-sm">
              <i className="bi bi-search me-1"></i> Search Public Registry
            </Link>
            <Link to="/" className="btn btn-outline-secondary btn-sm">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isValid = cert.status === 'VALID';
  const isExpiring = cert.status === 'EXPIRING_SOON';
  const isExpired = cert.status === 'EXPIRED';
  const isRevoked = cert.status === 'REVOKED';

  return (
    <div className="certificate-result-page py-4 px-3 bg-light">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Verification Status Banner (Citizen Top View) */}
        <div className="no-print mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Link to="/verify" className="btn btn-sm btn-outline-secondary">
              &larr; Back to Verification Search
            </Link>
            <button onClick={handlePrint} className="btn btn-sm btn-primary fw-bold">
              <i className="bi bi-printer-fill me-1"></i> Print / Save Certificate PDF
            </button>
          </div>

          {isValid && (
            <div className="alert alert-success d-flex align-items-center gap-3 py-3 px-4 shadow-sm border-0 bg-success text-white rounded-3">
              <div className="fs-1">
                <i className="bi bi-patch-check-fill"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1">AUTHENTIC LEGAL METROLOGY VERIFICATION</h5>
                <p className="small mb-0 opacity-90">
                  This weighing and measuring instrument has been tested and officially stamped by the Directorate of Legal Metrology. It is compliant for commercial trade.
                </p>
              </div>
            </div>
          )}

          {isExpiring && (
            <div className="alert alert-warning d-flex align-items-center gap-3 py-3 px-4 shadow-sm border-0 bg-warning text-dark rounded-3">
              <div className="fs-1">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1">EXPIRING SOON — RE-VERIFICATION DUE</h5>
                <p className="small mb-0">
                  This instrument verification is valid but due for periodic annual re-verification before {cert.expiryDate}.
                </p>
              </div>
            </div>
          )}

          {isExpired && (
            <div className="alert alert-danger d-flex align-items-center gap-3 py-3 px-4 shadow-sm border-0 bg-danger text-white rounded-3">
              <div className="fs-1">
                <i className="bi bi-x-circle-fill"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1">STAMPING EXPIRED — UNLAWFUL FOR COMMERCIAL USE</h5>
                <p className="small mb-0 opacity-90">
                  The statutory stamping validity for this instrument expired on {cert.expiryDate}. Using an unverified scale for trade is an offence under Section 30 of The Legal Metrology Act, 2009.
                </p>
              </div>
            </div>
          )}

          {isRevoked && (
            <div className="alert alert-dark d-flex align-items-center gap-3 py-3 px-4 shadow-sm border-0 bg-dark text-danger rounded-3">
              <div className="fs-1">
                <i className="bi bi-slash-circle-fill"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1 text-danger">CERTIFICATE REVOKED BY ENFORCEMENT</h5>
                <p className="small mb-0 text-white-50">
                  This certificate was revoked on {cert.revokedAt}. Reason: {cert.revocationReason || 'Suspected seal tampering / consumer dispute.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Official Certificate Card */}
        <div className="card border-0 shadow-lg p-4 p-md-5 bg-white position-relative printable-certificate rounded-4">
          {/* Watermark */}
          <div className="cert-watermark-container">
            <div className="cert-watermark-text">LEGAL METROLOGY INDIA</div>
          </div>

          {/* Header */}
          <div className="text-center border-bottom pb-4 mb-4">
            <div className="mb-2">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis border border-warning rounded-circle p-2"
                style={{ width: '64px', height: '64px', fontSize: '2.2rem' }}
              >
                ⚖️
              </div>
            </div>
            <h6 className="text-uppercase fw-bold text-secondary mb-1" style={{ letterSpacing: '1.5px', fontSize: '0.85rem' }}>
              Government of India | भारत सरकार
            </h6>
            <h4 className="fw-bold text-navy-dark mb-1">
              Department of Consumer Affairs | उपभोक्ता मामले विभाग
            </h4>
            <div className="text-primary fw-semibold small">
              Directorate of Legal Metrology | विधिक मापविज्ञान निदेशालय
            </div>
            <div className="mt-3 py-1 px-4 bg-light d-inline-block rounded border border-secondary-subtle">
              <h5 className="mb-0 fw-bold text-dark text-uppercase" style={{ letterSpacing: '0.5px' }}>
                CERTIFICATE OF VERIFICATION AND STAMPING
              </h5>
              <small className="text-muted">[Issued under Section 24 of The Legal Metrology Act, 2009 & Rule 27 of General Rules, 2011]</small>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="d-flex flex-wrap justify-content-between align-items-center bg-light p-3 rounded mb-4 border">
            <div>
              <small className="text-muted d-block">Certificate Number:</small>
              <strong className="text-primary fs-5 font-monospace">{cert.certificateNumber}</strong>
            </div>
            <div>
              <small className="text-muted d-block">Stamping Seal Tag No:</small>
              <span className="badge bg-dark text-warning border font-monospace fs-6 px-3 py-1">
                <i className="bi bi-tag-fill me-1"></i>
                {cert.stampingSealNumber}
              </span>
            </div>
            <div>
              <small className="text-muted d-block">Statutory Status:</small>
              <StatusBadge status={cert.status} />
            </div>
          </div>

          {/* Specifications & Trader Details */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="p-3 border rounded h-100 bg-light-subtle">
                <h6 className="fw-bold text-navy-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-gear-fill text-primary"></i> Instrument Specifications
                </h6>
                <table className="table table-sm table-borderless small mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted" style={{ width: '40%' }}>Instrument Type:</td>
                      <td className="fw-bold text-dark">{cert.instrumentType}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Manufacturer / Model:</td>
                      <td className="fw-semibold">{cert.manufacturer} / {cert.model}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Serial Number:</td>
                      <td className="font-monospace fw-bold">{cert.serialNumber}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Accuracy Class:</td>
                      <td><span className="badge bg-info-subtle text-info border">{cert.accuracyClass}</span></td>
                    </tr>
                    <tr>
                      <td className="text-muted">Capacity Limits:</td>
                      <td className="fw-semibold">{cert.capacity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 border rounded h-100 bg-light-subtle">
                <h6 className="fw-bold text-navy-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-building-fill text-primary"></i> Trader & Establishment Details
                </h6>
                <table className="table table-sm table-borderless small mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted" style={{ width: '40%' }}>Business Owner:</td>
                      <td className="fw-bold text-dark">{cert.ownerName}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">GSTIN / Business Reg:</td>
                      <td className="font-monospace">{cert.businessRegNo}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Premise Location:</td>
                      <td className="small">{cert.establishmentAddress}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Governing Rules:</td>
                      <td className="small text-muted">{cert.verificationStandard}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Test Observations Table */}
          {cert.testDetails && cert.testDetails.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-navy-dark mb-2 small text-uppercase">
                Field Verification Metrological Tolerance Observations (MPE)
              </h6>
              <div className="table-responsive">
                <table className="table table-sm table-bordered text-center small mb-1 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Test Point</th>
                      <th>Applied Standard Load</th>
                      <th>Observed Error</th>
                      <th>MPE Allowed</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cert.testDetails.map((t, idx) => (
                      <tr key={idx}>
                        <td className="text-start">{t.testPoint}</td>
                        <td className="font-monospace">{t.appliedLoad}</td>
                        <td className="font-monospace fw-semibold text-success">{t.observedError}</td>
                        <td className="font-monospace text-muted">{t.mpeAllowed}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Signature, QR & Seal Footer */}
          <div className="row g-3 align-items-center border-top pt-4">
            <div className="col-md-3 text-center">
              <div className="p-2 border rounded bg-light d-inline-block shadow-sm">
                <QRCodeSVG
                  value={cert.qrVerificationUrl || window.location.href}
                  size={100}
                  level="H"
                  includeMargin={false}
                />
                <div className="small text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                  Public Authenticity QR
                </div>
              </div>
            </div>

            <div className="col-md-5 small">
              <div className="mb-1">
                <span className="text-muted">Verification Date:</span>{' '}
                <strong className="text-dark">{cert.issueDate}</strong>
              </div>
              <div className="mb-1">
                <span className="text-muted">Valid Period:</span>{' '}
                <strong className={`fs-6 ${isExpired || isRevoked ? 'text-danger' : 'text-success'}`}>
                  {cert.issueDate} to {cert.expiryDate}
                </strong>
              </div>
              <div className="text-muted text-truncate" style={{ fontSize: '0.7rem' }}>
                <strong>Cryptographic Hash:</strong> {cert.digitalHash}
              </div>
            </div>

            <div className="col-md-4 text-end">
              <div className="border p-3 rounded bg-light-subtle text-center">
                <div className="text-success small fw-semibold">
                  <i className="bi bi-shield-check me-1"></i> Verified & Stamped By
                </div>
                <div className="fw-bold text-dark">{cert.issuingOfficer}</div>
                <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                  {cert.issuingOffice}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="text-center mt-4 pt-3 border-top text-muted" style={{ fontSize: '0.7rem' }}>
            This is an official digital verification certificate issued by the Legal Metrology Division, Department of Consumer Affairs, Government of India.
            Unauthorized removal, alteration, or tampering of the physical seal is an offence under Section 30 of The Legal Metrology Act, 2009.
          </div>
        </div>
      </div>
    </div>
  );
}

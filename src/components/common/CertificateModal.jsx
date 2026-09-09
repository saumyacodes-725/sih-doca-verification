import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import StatusBadge from './StatusBadge';
import { getCertificateQrUrl } from '../../utils/certificateUrl';

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const isRevoked = certificate.status === 'REVOKED';
  const isExpired = certificate.status === 'EXPIRED';

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1060 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg certificate-modal-content">
          {/* Top Modal Controls */}
          <div className="modal-header bg-navy-dark text-white py-2 px-3 no-print">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-patch-check-fill text-warning fs-5"></i>
              <span className="fw-semibold">
                Official Digital Certificate of Verification — {certificate.certificateNumber}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={handlePrint}
                className="btn btn-sm btn-light d-flex align-items-center gap-1"
                title="Print or Save as PDF"
              >
                <i className="bi bi-printer-fill text-primary"></i> Print / PDF
              </button>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
          </div>

          {/* Certificate Body (Government Format) */}
          <div className="modal-body p-4 bg-white position-relative printable-certificate">
            {/* Watermark */}
            <div className="cert-watermark-container">
              <div className="cert-watermark-text">LEGAL METROLOGY INDIA</div>
            </div>

            {/* Certificate Header */}
            <div className="text-center border-bottom pb-3 mb-3">
              <div className="mb-1">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis border border-warning rounded-circle p-2"
                  style={{ width: '56px', height: '56px', fontSize: '1.8rem' }}
                >
                  ⚖️
                </div>
              </div>
              <h6 className="text-uppercase fw-bold text-secondary mb-0" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
                Government of India | भारत सरकार
              </h6>
              <h5 className="fw-bold text-navy-dark mb-0">
                Department of Consumer Affairs | उपभोक्ता मामले विभाग
              </h5>
              <div className="text-primary small fw-semibold">
                Directorate of Legal Metrology | विधिक मापविज्ञान निदेशालय
              </div>
              <div className="mt-2 py-1 px-3 bg-light d-inline-block rounded border border-secondary-subtle">
                <h6 className="mb-0 fw-bold text-dark text-uppercase" style={{ letterSpacing: '0.5px' }}>
                  CERTIFICATE OF VERIFICATION AND STAMPING
                </h6>
                <small className="text-muted">[Issued under Section 24 of The Legal Metrology Act, 2009 & Rule 27 of General Rules, 2011]</small>
              </div>
            </div>

            {/* Certificate Status & Metadata Banner */}
            <div className="d-flex flex-wrap justify-content-between align-items-center bg-light p-2 rounded mb-3 border">
              <div>
                <small className="text-muted d-block">Certificate No:</small>
                <strong className="text-primary fs-6">{certificate.certificateNumber}</strong>
              </div>
              <div>
                <small className="text-muted d-block">Stamping Seal Tag No:</small>
                <span className="badge bg-dark text-warning border font-monospace px-2 py-1">
                  <i className="bi bi-tag-fill me-1"></i>
                  {certificate.stampingSealNumber || 'N/A'}
                </span>
              </div>
              <div>
                <small className="text-muted d-block">Current Status:</small>
                <StatusBadge status={certificate.status} />
              </div>
            </div>

            {isRevoked && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
                <i className="bi bi-slash-circle-fill fs-4"></i>
                <div>
                  <strong>NOTICE: THIS CERTIFICATE HAS BEEN REVOKED</strong>
                  <div className="small">Reason: {certificate.revocationReason || 'Violations under Legal Metrology Act, 2009'}</div>
                </div>
              </div>
            )}

            {/* Main Instrument & Owner Details Grid */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="p-3 border rounded h-100 bg-light-subtle">
                  <h6 className="fw-bold text-navy-dark border-bottom pb-1 mb-2 d-flex align-items-center gap-1">
                    <i className="bi bi-gear-fill text-secondary"></i> Instrument Specifications
                  </h6>
                  <table className="table table-sm table-borderless small mb-0">
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: '40%' }}>Instrument:</td>
                        <td className="fw-semibold">{certificate.instrumentType}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Make & Model:</td>
                        <td className="fw-semibold">{certificate.manufacturer} / {certificate.model}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Serial Number:</td>
                        <td className="font-monospace fw-bold">{certificate.serialNumber}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Accuracy Class:</td>
                        <td><span className="badge bg-info-subtle text-info border">{certificate.accuracyClass}</span></td>
                      </tr>
                      <tr>
                        <td className="text-muted">Capacity Range:</td>
                        <td className="fw-semibold">{certificate.capacity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 border rounded h-100 bg-light-subtle">
                  <h6 className="fw-bold text-navy-dark border-bottom pb-1 mb-2 d-flex align-items-center gap-1">
                    <i className="bi bi-building-fill text-secondary"></i> Trader & Premise Details
                  </h6>
                  <table className="table table-sm table-borderless small mb-0">
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: '40%' }}>Owner / Business:</td>
                        <td className="fw-semibold">{certificate.ownerName}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">GSTIN / Reg No:</td>
                        <td className="font-monospace">{certificate.businessRegNo || 'GSTIN07AAACA1234F1Z5'}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Premise Address:</td>
                        <td className="small">{certificate.establishmentAddress}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Verification Standard:</td>
                        <td className="small text-muted">{certificate.verificationStandard}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Test Results Summary Table */}
            {certificate.testDetails && certificate.testDetails.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold text-navy-dark mb-1 small text-uppercase">
                  Metrological Field Test Observations & Tolerances (MPE)
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered text-center small mb-1 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Test Point Description</th>
                        <th>Applied Load</th>
                        <th>Observed Error</th>
                        <th>MPE Allowed</th>
                        <th>Tolerance Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificate.testDetails.map((t, idx) => (
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

            {/* Validity, QR & Digital Signature Box */}
            <div className="row g-3 align-items-center border-top pt-3">
              <div className="col-md-3 text-center">
                <div className="p-2 border rounded bg-light d-inline-block shadow-sm">
                  <QRCodeSVG
                    value={getCertificateQrUrl(certificate)}
                    size={90}
                    level="H"
                    includeMargin={false}
                  />
                  <div className="small text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                    Scan to Verify
                  </div>
                </div>
              </div>

              <div className="col-md-5 small">
                <div className="mb-1">
                  <span className="text-muted">Date of Verification:</span>{' '}
                  <strong className="text-dark">{certificate.issueDate}</strong>
                </div>
                <div className="mb-1">
                  <span className="text-muted">Valid Until:</span>{' '}
                  <strong className={`fs-6 ${isExpired || isRevoked ? 'text-danger' : 'text-success'}`}>
                    {certificate.expiryDate}
                  </strong>
                </div>
                <div className="text-muted text-truncate" style={{ fontSize: '0.7rem' }}>
                  <strong>Digital Hash:</strong> {certificate.digitalHash}
                </div>
              </div>

              <div className="col-md-4 text-end">
                <div className="border p-2 rounded bg-light-subtle text-center">
                  <div className="text-success small fw-semibold">
                    <i className="bi bi-shield-check me-1"></i> Digitally Signed & Stamped
                  </div>
                  <div className="fw-bold text-dark small">{certificate.issuingOfficer}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {certificate.issuingOffice}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Disclaimer */}
            <div className="text-center mt-3 pt-2 border-top text-muted" style={{ fontSize: '0.68rem' }}>
              This is a legally valid computer-generated verification certificate issued by the Directorate of Legal Metrology, Government of India. Any tampering, seal breaking or unauthorized recalibration is punishable under Section 30 of The Legal Metrology Act, 2009.
            </div>
          </div>

          <div className="modal-footer bg-light py-2 px-3 no-print">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Close Preview
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
              <i className="bi bi-download me-1"></i> Save / Print Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

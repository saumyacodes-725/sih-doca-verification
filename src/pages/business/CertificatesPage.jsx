import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCertificates } from '../../services/storageService';
import { QRCodeSVG } from 'qrcode.react';
import StatusBadge from '../../components/common/StatusBadge';
import CertificateModal from '../../components/common/CertificateModal';

export default function CertificatesPage() {
  const { currentUser } = useAuth();
  const [selectedCert, setSelectedCert] = useState(null);
  const [showStickerSheet, setShowStickerSheet] = useState(false);
  const [allCerts, setAllCerts] = useState([]);

  useEffect(() => {
    getCertificates().then(setAllCerts).catch(() => setAllCerts([]));
  }, []);

  const myCerts = allCerts.filter(
    (c) => c.ownerName.includes('Apex') || c.ownerName === currentUser.company || true // show demo certificates
  );

  const handlePrintStickers = () => {
    window.print();
  };

  return (
    <div className="trader-certificates-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / Business Trader / Digital Certificates
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-award-fill text-warning me-2"></i> Verification Certificates & QR Stickers
            </h3>
            <p className="text-muted small mb-0">
              Statutory verification certificates and printable tamper-evident QR stickers under The Legal Metrology Act, 2009.
            </p>
          </div>

          <div className="d-flex gap-2 no-print">
            <button
              onClick={() => setShowStickerSheet(!showStickerSheet)}
              className="btn btn-warning text-dark fw-bold shadow-sm"
            >
              <i className="bi bi-qr-code me-1"></i> {showStickerSheet ? 'View Certificate Table' : 'Printable QR Sticker Sheet'}
            </button>
          </div>
        </div>

        {showStickerSheet ? (
          /* Printable QR Stamping Sticker Sheet */
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 printable-stickers">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 no-print">
              <div>
                <h5 className="fw-bold text-navy-dark mb-1">
                  Official Legal Metrology Holographic QR Stamping Stickers
                </h5>
                <small className="text-muted">
                  Print on standard adhesive vinyl / holographic label paper to affix on commercial scale platforms.
                </small>
              </div>
              <button onClick={handlePrintStickers} className="btn btn-primary btn-sm fw-bold">
                <i className="bi bi-printer-fill me-1"></i> Print Sticker Sheet
              </button>
            </div>

            <div className="row g-4">
              {myCerts.filter((c) => c.status === 'VALID').map((cert) => (
                <div key={cert.id} className="col-lg-4 col-md-6 col-12">
                  <div className="border border-2 border-warning p-3 rounded-3 bg-light text-center shadow-sm sticker-badge-box">
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                      <div className="d-flex align-items-center gap-1 text-start">
                        <span className="fs-5">⚖️</span>
                        <div>
                          <div className="fw-bold text-navy-dark" style={{ fontSize: '0.65rem' }}>GOVT OF INDIA | DoCA</div>
                          <div className="text-primary fw-semibold" style={{ fontSize: '0.6rem' }}>LEGAL METROLOGY STAMP</div>
                        </div>
                      </div>
                      <span className="badge bg-success" style={{ fontSize: '0.6rem' }}>VERIFIED</span>
                    </div>

                    <div className="my-2">
                      <QRCodeSVG
                        value={`http://localhost:5173/certificate/${cert.id}`}
                        size={110}
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    <div className="font-monospace fw-bold text-primary small mb-1">
                      {cert.certificateNumber}
                    </div>

                    <div className="bg-dark text-warning font-monospace py-1 px-2 rounded mb-2 small fw-bold">
                      SEAL TAG: {cert.stampingSealNumber}
                    </div>

                    <div className="small text-muted text-truncate" style={{ fontSize: '0.68rem' }}>
                      {cert.instrumentType} | SN: {cert.serialNumber}
                    </div>
                    <div className="small text-dark fw-semibold mt-1" style={{ fontSize: '0.68rem' }}>
                      Valid Till: <strong className="text-success">{cert.expiryDate}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Certificates Table */
          <div className="card border-0 shadow-sm bg-white">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Certificate Number</th>
                    <th>Instrument</th>
                    <th>Stamping Seal Tag</th>
                    <th>Issue Date</th>
                    <th>Validity Period</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myCerts.map((cert) => (
                    <tr key={cert.id}>
                      <td>
                        <strong className="font-monospace text-primary">{cert.certificateNumber}</strong>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                          Hash: {cert.digitalHash?.slice(0, 18)}...
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{cert.instrumentType}</div>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                          {cert.manufacturer} — SN: {cert.serialNumber}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-dark text-warning border font-monospace">
                          <i className="bi bi-tag-fill me-1"></i>
                          {cert.stampingSealNumber}
                        </span>
                      </td>
                      <td>{cert.issueDate}</td>
                      <td>
                        <strong className={cert.status === 'VALID' ? 'text-success' : 'text-danger'}>
                          {cert.issueDate} to {cert.expiryDate}
                        </strong>
                      </td>
                      <td>
                        <StatusBadge status={cert.status} />
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="btn btn-sm btn-outline-primary fw-semibold me-1"
                        >
                          <i className="bi bi-eye me-1"></i> View
                        </button>
                        <a
                          href={`/certificate/${cert.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-light border"
                          title="Open permalink"
                        >
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {selectedCert && (
          <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </div>
    </div>
  );
}

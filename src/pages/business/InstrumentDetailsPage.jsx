import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInstrumentById, getCertificateById } from '../../services/storageService';
import { QRCodeSVG } from 'qrcode.react';
import StatusBadge from '../../components/common/StatusBadge';
import CertificateModal from '../../components/common/CertificateModal';
import { getCertificateQrUrl } from '../../utils/certificateUrl';

export default function InstrumentDetailsPage() {
  const { id } = useParams();
  const [showCertModal, setShowCertModal] = useState(false);
  const [instrument, setInstrument] = useState(null);
  const [activeCert, setActiveCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getInstrumentById(id)
      .then((inst) => {
        setInstrument(inst);
        if (inst?.activeCertificateId) {
          return getCertificateById(inst.activeCertificateId).then(setActiveCert);
        }
        setActiveCert(null);
      })
      .catch(() => setInstrument(null))
      .finally(() => setLoading(false));
  }, [id]);

  const hasPendingApplication = ['APPLICATION_SUBMITTED', 'APPLICATION_APPROVED', 'SCHEDULED'].includes(instrument?.status);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!instrument) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm p-5 max-w-md mx-auto bg-white">
          <div className="fs-1 text-muted mb-2">🔍</div>
          <h4 className="fw-bold text-navy-dark">Instrument Not Found</h4>
          <p className="text-muted small">No instrument found with ID "{id}".</p>
          <Link to="/business/instruments" className="btn btn-primary btn-sm">
            Back to Fleet Registry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="instrument-details-page py-4 px-3 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '950px' }}>
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="small text-muted mb-1">
            <span className="text-primary">Trust Scale</span> / Business Trader / Fleet / {instrument.id}
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 className="fw-bold text-navy-dark mb-0">
                <i className="bi bi-box-seam text-warning me-2"></i> {instrument.type}
              </h3>
              <div className="text-muted small">
                Manufacturer: <strong>{instrument.manufacturer}</strong> | Model: <strong>{instrument.model}</strong>
              </div>
            </div>
            <div className="d-flex gap-2">
              {activeCert && (
                <button
                  onClick={() => setShowCertModal(true)}
                  className="btn btn-outline-success fw-semibold btn-sm"
                >
                  <i className="bi bi-award-fill me-1"></i> View Certificate
                </button>
              )}
              {hasPendingApplication && (
                <Link
                  to="/business/applications"
                  className="btn btn-outline-primary fw-semibold btn-sm"
                >
                  <i className="bi bi-clock-history me-1"></i> Track Application
                </Link>
              )}
              {instrument.status !== 'VERIFIED' && !hasPendingApplication && (
                <Link
                  to={`/business/apply?instId=${instrument.id}`}
                  className="btn btn-warning text-dark fw-bold btn-sm shadow-sm"
                >
                  <i className="bi bi-patch-plus me-1"></i> Apply for Verification
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Top Status & Stamping Card */}
        <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="small text-muted">Statutory Verification Status:</div>
              <div className="mt-1">
                <StatusBadge status={instrument.status} />
              </div>
            </div>

            <div>
              <div className="small text-muted">Stamping Seal Tag No:</div>
              <div className="fs-6 font-monospace fw-bold text-dark">
                {instrument.stampingNumber ? (
                  <span>
                    <i className="bi bi-tag-fill text-warning me-1"></i>
                    {instrument.stampingNumber}
                  </span>
                ) : (
                  <span className="text-muted">Not Stamped</span>
                )}
              </div>
            </div>

            <div>
              <div className="small text-muted">Stamping Expiry Date:</div>
              <div className={`fs-6 fw-bold ${instrument.status === 'VERIFIED' ? 'text-success' : 'text-muted'}`}>
                {instrument.expiryDate || 'Pending stamping'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="row g-4 mb-4">
          {/* Col 1: Technical Specs */}
          <div className="col-md-7">
            <div className="card border-0 shadow-sm bg-white p-4 h-100 rounded-3">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-sliders text-primary me-2"></i> Technical Specifications
              </h5>

              <table className="table table-sm table-borderless small mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted" style={{ width: '40%' }}>Registration ID:</td>
                    <td className="font-monospace fw-bold">{instrument.id}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Serial Number:</td>
                    <td className="font-monospace fw-bold">{instrument.serialNumber}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Category:</td>
                    <td>{instrument.category}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Accuracy Class:</td>
                    <td><span className="badge bg-info-subtle text-info border">{instrument.accuracyClass}</span></td>
                  </tr>
                  <tr>
                    <td className="text-muted">Max Capacity:</td>
                    <td className="fw-bold">{instrument.maxCapacity}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Min Capacity:</td>
                    <td>{instrument.minCapacity}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Verification Interval (e):</td>
                    <td className="fw-bold text-primary">{instrument.verificationInterval}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Pattern Approval No:</td>
                    <td className="font-monospace">{instrument.patternApprovalNo || 'IND-LM-PA-2023-412'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Registered On:</td>
                    <td>{instrument.registrationDate}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Installation Site:</td>
                    <td>{instrument.location}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">GPS Coordinates:</td>
                    <td className="font-monospace">{instrument.latitude}, {instrument.longitude}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Col 2: Stamping QR Tag Sticker */}
          <div className="col-md-5">
            <div className="card border-0 shadow-sm bg-white p-4 h-100 rounded-3 text-center d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold text-navy-dark mb-2">
                  <i className="bi bi-qr-code text-primary me-2"></i> Official Stamping QR Tag
                </h5>
                <p className="small text-muted mb-3">
                  Affixed to physical instrument display for consumer verification.
                </p>

                {activeCert ? (
                  <div className="p-3 border rounded bg-light d-inline-block shadow-sm mb-3">
                    <QRCodeSVG
                      value={getCertificateQrUrl(activeCert)}
                      size={130}
                      level="H"
                      includeMargin={false}
                    />
                    <div className="font-monospace small text-primary fw-bold mt-2">
                      {activeCert.certificateNumber}
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.7rem' }}>
                      Seal: {activeCert.stampingSealNumber}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded bg-light small mb-3">
                    <i className="bi bi-hourglass-split fs-1 text-warning d-block mb-2"></i>
                    <div className="fw-semibold text-navy-dark mb-1">Stamping QR Pending</div>
                    <div className="text-muted">
                      Official QR tag will be generated after field verification and stamping.
                    </div>
                  </div>
                )}
              </div>

              {activeCert && (
                <div>
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="btn btn-sm btn-outline-primary w-100 fw-semibold"
                  >
                    View Official Certificate &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        {showCertModal && activeCert && (
          <CertificateModal certificate={activeCert} onClose={() => setShowCertModal(false)} />
        )}
      </div>
    </div>
  );
}

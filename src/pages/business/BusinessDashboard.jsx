import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInstruments, getApplications, getCertificates } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';

export default function BusinessDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [allInstruments, setAllInstruments] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [allCertificates, setAllCertificates] = useState([]);

  useEffect(() => {
    getInstruments().then(setAllInstruments).catch(() => setAllInstruments([]));
    getApplications().then(setAllApplications).catch(() => setAllApplications([]));
    getCertificates().then(setAllCertificates).catch(() => setAllCertificates([]));
  }, []);

  // Filter instruments for this business trader
  const myInstruments = allInstruments.filter(
    (i) => i.ownerTraderId === currentUser.id || i.ownerName.includes('Apex') || !i.ownerTraderId
  );

  const myApplications = allApplications.filter(
    (a) => a.applicantTraderId === currentUser.id || a.applicantName.includes('Apex') || !a.applicantTraderId
  );

  const validCount = myInstruments.filter((i) => i.status === 'VERIFIED').length;
  const pendingCount = myInstruments.filter((i) => i.status === 'APPLICATION_SUBMITTED' || i.status === 'SCHEDULED').length;
  const expiredCount = myInstruments.filter((i) => i.status === 'EXPIRED').length;
  const unverifiedCount = myInstruments.filter((i) => i.status === 'REGISTERED').length;

  const expiringInstruments = myInstruments.filter((i) => {
    if (!i.expiryDate) return false;
    const exp = new Date(i.expiryDate);
    const now = new Date('2026-08-24');
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  });

  return (
    <div className="business-dashboard py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Trader Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / Business Trader Portal / Dashboard
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-shop text-warning me-2"></i> {currentUser.company || 'Apex Weighing & Logistics Ltd'}
            </h3>
            <div className="text-muted small">
              GSTIN: <strong>GSTIN07AAACA1234F1Z5</strong> | Registered Trader ID: <span className="font-monospace">TRD-2026-991</span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/business/register" className="btn btn-warning text-dark fw-bold shadow-sm">
              <i className="bi bi-plus-circle-fill me-1"></i> Register New Instrument
            </Link>
            <Link to="/business/apply" className="btn btn-primary fw-bold shadow-sm">
              <i className="bi bi-patch-check-fill me-1"></i> Apply for Verification
            </Link>
          </div>
        </div>

        {/* Expiry Warning Banner if any instruments expiring soon */}
        {expiringInstruments.length > 0 && (
          <div className="alert alert-warning border-warning shadow-sm d-flex flex-wrap justify-content-between align-items-center p-3 mb-4 rounded-3">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-exclamation-triangle-fill fs-3 text-warning"></i>
              <div>
                <strong className="d-block text-dark">Stamping Validity Expiring Soon!</strong>
                <span className="small text-muted">
                  {expiringInstruments.length} instrument(s) require statutory annual re-verification within 30 days.
                </span>
              </div>
            </div>
            <Link to="/business/apply" className="btn btn-sm btn-dark text-warning fw-bold">
              Submit Re-verification Application &rarr;
            </Link>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Total Instruments</div>
                  <div className="fs-3 fw-bold text-navy-dark">{myInstruments.length}</div>
                </div>
                <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                  <i className="bi bi-box-seam fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                Registered in Fleet Registry
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Verified & Stamped</div>
                  <div className="fs-3 fw-bold text-success">{validCount}</div>
                </div>
                <div className="p-3 bg-success-subtle text-success rounded-circle">
                  <i className="bi bi-patch-check-fill fs-4"></i>
                </div>
              </div>
              <div className="small text-success mt-2 border-top pt-2">
                <i className="bi bi-shield-check me-1"></i> 100% Legally Compliant
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Pending / In Review</div>
                  <div className="fs-3 fw-bold text-primary">{pendingCount}</div>
                </div>
                <div className="p-3 bg-info-subtle text-primary rounded-circle">
                  <i className="bi bi-hourglass-split fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                Applications with Legal Metrology
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Expired / Action Needed</div>
                  <div className="fs-3 fw-bold text-danger">{expiredCount + unverifiedCount}</div>
                </div>
                <div className="p-3 bg-danger-subtle text-danger rounded-circle">
                  <i className="bi bi-exclamation-octagon-fill fs-4"></i>
                </div>
              </div>
              <div className="small text-danger mt-2 border-top pt-2">
                Requires Verification Application
              </div>
            </div>
          </div>
        </div>

        {/* My Registered Instruments Fleet Table */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm bg-white">
              <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
                <h5 className="fw-bold text-navy-dark mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-cpu text-primary"></i> Registered Instruments Fleet
                </h5>
                <Link to="/business/instruments" className="btn btn-sm btn-outline-primary fw-semibold">
                  View All ({myInstruments.length}) &rarr;
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Instrument / Model</th>
                      <th>Serial No</th>
                      <th>Class & Capacity</th>
                      <th>Stamping Seal</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myInstruments.map((inst) => (
                      <tr key={inst.id}>
                        <td>
                          <div className="fw-bold text-dark">{inst.type}</div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                            {inst.manufacturer} — {inst.model}
                          </div>
                        </td>
                        <td className="font-monospace fw-semibold">{inst.serialNumber}</td>
                        <td>
                          <div>{inst.accuracyClass.split(' ')[0]}</div>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>Max: {inst.maxCapacity}</span>
                        </td>
                        <td className="font-monospace">
                          {inst.stampingNumber ? (
                            <span className="badge bg-light text-dark border">
                              <i className="bi bi-tag-fill text-warning me-1"></i>
                              {inst.stampingNumber}
                            </span>
                          ) : (
                            <span className="text-muted">Not Stamped</span>
                          )}
                        </td>
                        <td>
                          <StatusBadge status={inst.status} />
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/business/instruments/${inst.id}`}
                            className="btn btn-sm btn-light border me-1"
                            title="View Instrument Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {inst.status !== 'VERIFIED' && inst.status !== 'APPLICATION_SUBMITTED' && (
                            <Link
                              to={`/business/apply?instId=${inst.id}`}
                              className="btn btn-sm btn-warning text-dark fw-bold"
                              title="Apply for Stamping"
                            >
                              Apply
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Applications */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm bg-white mb-4">
              <div className="card-header bg-white py-3 px-4 border-bottom">
                <h6 className="fw-bold text-navy-dark mb-0">
                  <i className="bi bi-file-earmark-text text-primary me-2"></i> Verification Applications
                </h6>
              </div>
              <div className="card-body p-3">
                {myApplications.length === 0 ? (
                  <div className="text-center text-muted py-3 small">No active applications.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {myApplications.slice(0, 3).map((app) => (
                      <div key={app.id} className="p-3 border rounded bg-light-subtle small">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="font-monospace fw-bold text-primary">{app.id}</span>
                          <StatusBadge status={app.status} />
                        </div>
                        <div className="fw-semibold text-dark">{app.instrumentName}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Submitted: {app.submittedDate} | Fee: <strong>{app.feeAmount}</strong>
                        </div>
                        {app.assignedOfficerName && (
                          <div className="text-primary mt-1" style={{ fontSize: '0.72rem' }}>
                            <i className="bi bi-person-badge me-1"></i> {app.assignedOfficerName} ({app.scheduledDate})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  <Link to="/business/applications" className="btn btn-outline-primary btn-sm w-100 fw-semibold">
                    View All Applications &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="card border-0 shadow-sm bg-navy-dark text-white p-3 rounded-3">
              <h6 className="fw-bold text-warning mb-2">
                <i className="bi bi-qr-code me-2"></i> Printable Stamping QR Stickers
              </h6>
              <p className="small text-light-50 mb-3">
                Download verified QR stickers to affix on your commercial scale platforms and front display.
              </p>
              <Link to="/business/certificates" className="btn btn-sm btn-warning text-dark fw-bold">
                Download Sticker Sheet &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

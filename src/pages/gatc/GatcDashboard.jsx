import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getGatcReports } from '../../services/storageService';

export default function GatcDashboard() {
  const { currentUser } = useAuth();
  const reports = getGatcReports();

  return (
    <div className="gatc-dashboard py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / GATC Test Lab Portal / Dashboard
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-cpu-fill text-success me-2"></i> {currentUser.company || 'GATC Precision Metrology Standards Lab'}
            </h3>
            <div className="text-muted small">
              Accreditation: <strong>NABL-CC-2891 / DoCA-GATC-2024-09</strong> | Lab Code: <span className="font-monospace text-primary fw-bold">GATC-DL-001</span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/gatc/test/APP-2026-102" className="btn btn-success fw-bold shadow-sm">
              <i className="bi bi-plus-circle-fill me-1"></i> New Laboratory Test Report
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Lab Calibrations Done</div>
                  <div className="fs-3 fw-bold text-navy-dark">184</div>
                </div>
                <div className="p-3 bg-success-subtle text-success rounded-circle">
                  <i className="bi bi-cpu fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                NPL India Traceable Reference Standards
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Class I & II Balances</div>
                  <div className="fs-3 fw-bold text-primary">96</div>
                </div>
                <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                  <i className="bi bi-speedometer fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                High-precision analytical balances
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Pattern Approvals Verified</div>
                  <div className="fs-3 fw-bold text-warning-emphasis">42</div>
                </div>
                <div className="p-3 bg-warning-subtle text-warning rounded-circle">
                  <i className="bi bi-patch-check fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                OIML R76 Compliance Reports
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted fw-semibold">Standard Weights Used</div>
                  <div className="fs-5 fw-bold text-navy-dark mt-1">Class E1, E2 & F1</div>
                </div>
                <div className="p-3 bg-info-subtle text-info rounded-circle">
                  <i className="bi bi-box fs-4"></i>
                </div>
              </div>
              <div className="small text-muted mt-2 border-top pt-2">
                Environmental Chamber Controlled
              </div>
            </div>
          </div>
        </div>

        {/* Recent Calibration Reports */}
        <div className="card border-0 shadow-sm bg-white mb-4">
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
            <h5 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-file-earmark-medical text-success me-2"></i> Recent Metrology Laboratory Test Reports
            </h5>
            <span className="badge bg-success px-3 py-1">NABL Accredited Facility</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Report ID</th>
                  <th>Instrument Model & Serial</th>
                  <th>Accuracy Class</th>
                  <th>Standard Reference Used</th>
                  <th>Linearity & Repeatability</th>
                  <th>Test Verdict</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rep) => (
                  <tr key={rep.id}>
                    <td>
                      <strong className="font-monospace text-primary">{rep.id}</strong>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Date: {rep.testDate}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{rep.instrumentModel}</div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        SN: {rep.serialNumber} ({rep.manufacturer})
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info border">{rep.accuracyClass}</span>
                    </td>
                    <td>{rep.standardWeightsUsed}</td>
                    <td>
                      <div>Linearity: <strong>{rep.linearityError}</strong></div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>Std Dev: {rep.repeatabilityStdDev}</div>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border px-2 py-1">
                        <i className="bi bi-check-circle-fill me-1"></i> PASSED CALIBRATION
                      </span>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/gatc/test/${rep.id}`}
                        className="btn btn-sm btn-outline-success fw-semibold"
                      >
                        <i className="bi bi-eye me-1"></i> Test Bench
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

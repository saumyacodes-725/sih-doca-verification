import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AnalyticsPage() {
  const { showToast } = useAuth();

  const handleExportReport = () => {
    showToast('National Verification Analytics Report (PDF) downloaded', 'success');
  };

  return (
    <div className="admin-analytics-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / National Admin / Metrological Analytics
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-graph-up-arrow text-danger me-2"></i> National Metrology Analytics & SLA Intelligence
            </h3>
            <p className="text-muted small mb-0">
              Real-time monitoring of verification turnaround times, geographic compliance, and non-conformance trends.
            </p>
          </div>

          <button onClick={handleExportReport} className="btn btn-outline-danger fw-semibold btn-sm">
            <i className="bi bi-file-earmark-pdf-fill me-1"></i> Export Comprehensive Report (PDF)
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="small text-muted fw-semibold">Average SLA Turnaround</div>
              <div className="fs-3 fw-bold text-primary">3.2 Days</div>
              <div className="small text-success mt-1">
                <i className="bi bi-arrow-down-short"></i> 18% faster than 2025
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="small text-muted fw-semibold">First-Time Pass Rate</div>
              <div className="fs-3 fw-bold text-success">94.8%</div>
              <div className="small text-muted mt-1">Within standard MPE limits</div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="small text-muted fw-semibold">Non-Compliance Rejections</div>
              <div className="fs-3 fw-bold text-danger">5.2%</div>
              <div className="small text-danger mt-1">Rectification notices issued</div>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6">
            <div className="card border-0 shadow-sm p-3 bg-white h-100">
              <div className="small text-muted fw-semibold">Public QR Scans (30 Days)</div>
              <div className="fs-3 fw-bold text-navy-dark">4,28,910</div>
              <div className="small text-success mt-1">Consumer transparency index</div>
            </div>
          </div>
        </div>

        {/* Zone Performance Table */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm bg-white p-4 h-100 rounded-3">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-geo-alt-fill text-primary me-2"></i> State & Zone Metrological Verification Throughput
              </h5>

              <div className="table-responsive">
                <table className="table table-hover align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Zone / State</th>
                      <th>Total Instruments</th>
                      <th>Verified %</th>
                      <th>Avg Turnaround</th>
                      <th>Enforcement Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">North Zone (Delhi NCR, UP, HR)</td>
                      <td>48,210</td>
                      <td>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: '98%' }}></div>
                        </div>
                        <span className="small text-success fw-bold">98.2%</span>
                      </td>
                      <td>2.8 Days</td>
                      <td><span className="badge bg-success-subtle text-success">Optimal SLA</span></td>
                    </tr>
                    <tr>
                      <td className="fw-bold">West Zone (Maharashtra, Gujarat)</td>
                      <td>52,440</td>
                      <td>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: '97%' }}></div>
                        </div>
                        <span className="small text-success fw-bold">97.4%</span>
                      </td>
                      <td>3.1 Days</td>
                      <td><span className="badge bg-success-subtle text-success">Optimal SLA</span></td>
                    </tr>
                    <tr>
                      <td className="fw-bold">South Zone (TN, KA, AP, TS)</td>
                      <td>39,120</td>
                      <td>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: '99%' }}></div>
                        </div>
                        <span className="small text-success fw-bold">99.1%</span>
                      </td>
                      <td>2.4 Days</td>
                      <td><span className="badge bg-success-subtle text-success">Exceeding SLA</span></td>
                    </tr>
                    <tr>
                      <td className="fw-bold">East Zone (WB, OD, BR, JH)</td>
                      <td>24,800</td>
                      <td>
                        <div className="progress" style={{ height: '6px' }}>
                          <div className="progress-bar bg-warning" style={{ width: '91%' }}></div>
                        </div>
                        <span className="small text-warning-emphasis fw-bold">91.5%</span>
                      </td>
                      <td>4.6 Days</td>
                      <td><span className="badge bg-warning-subtle text-warning-emphasis">Backlog Alert</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm bg-white p-4 h-100 rounded-3">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-pie-chart-fill text-warning me-2"></i> Category Distribution
              </h5>

              <div className="d-flex flex-column gap-3 small">
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Retail Electronic Scales (Class III)</span>
                    <strong className="text-dark">58%</strong>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-primary" style={{ width: '58%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Industrial Weighbridges (Class IV)</span>
                    <strong className="text-dark">18%</strong>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-warning" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Fuel MPD Dispensers (Class 0.5)</span>
                    <strong className="text-dark">14%</strong>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" style={{ width: '14%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Laboratory Precision (Class I & II)</span>
                    <strong className="text-dark">10%</strong>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-info" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

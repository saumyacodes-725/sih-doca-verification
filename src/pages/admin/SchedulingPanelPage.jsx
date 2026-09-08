import React, { useState, useEffect } from 'react';
import { getApplications, getStakeholders } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';

export default function SchedulingPanelPage() {
  const [applications, setApplications] = useState([]);
  const stakeholders = getStakeholders();
  const lmoOfficers = stakeholders.filter((s) => s.role === 'lmo');

  useEffect(() => {
    getApplications().then(setApplications).catch(() => setApplications([]));
  }, []);

  const [selectedDate, setSelectedDate] = useState('2026-08-25');

  const scheduledTasks = applications.filter(
    (a) => a.status === 'SCHEDULED' || a.status === 'PENDING_REVIEW'
  );

  return (
    <div className="admin-scheduling-panel py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / National Admin / Scheduling & Dispatch
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-calendar-event text-danger me-2"></i> Field Verification Dispatch & Scheduling Console
            </h3>
            <p className="text-muted small mb-0">
              Balance officer inspection capacity, schedule premises visits, and prevent geographic bottlenecks.
            </p>
          </div>
        </div>

        {/* Officer Workload Breakdown Cards */}
        <div className="row g-3 mb-4">
          {lmoOfficers.map((off) => (
            <div key={off.id} className="col-lg-4 col-md-6 col-12">
              <div className="card border-0 shadow-sm bg-white p-3 rounded-3 h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold text-navy-dark mb-0">{off.name}</h6>
                    <span className="badge bg-primary-subtle text-primary font-monospace">{off.badgeNumber}</span>
                  </div>
                  <span className="badge bg-success">Active Capacity</span>
                </div>

                <div className="small text-muted mb-2">
                  <div><strong>Zone:</strong> {off.zone}</div>
                  <div><strong>Kit ID:</strong> <span className="font-monospace">{off.stampingKitId}</span></div>
                </div>

                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" role="progressbar" style={{ width: '65%' }}></div>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <span>Assigned: <strong>4 Inspections</strong></span>
                  <span>Daily Limit: 6</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Master Inspection Schedule Table */}
        <div className="card border-0 shadow-sm bg-white">
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
            <h5 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-clock-history text-primary me-2"></i> Master Field Inspection Schedule
            </h5>
            <span className="badge bg-primary px-3 py-1">Active Slots: {scheduledTasks.length}</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>App ID</th>
                  <th>Scheduled Date & Slot</th>
                  <th>Assigned Officer</th>
                  <th>Instrument & Trader</th>
                  <th>Site Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scheduledTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <strong className="font-monospace text-primary">{task.id}</strong>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{task.scheduledDate || '2026-08-25'}</div>
                      <span className="badge bg-light text-dark border font-monospace">
                        <i className="bi bi-clock me-1"></i> {task.scheduledTimeSlot || '10:30 AM - 01:00 PM'}
                      </span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">
                        <i className="bi bi-person-badge text-primary me-1"></i>
                        {task.assignedOfficerName || 'Insp. Rajesh Sharma'}
                      </div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>DOCA-LM-1092</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{task.instrumentName}</div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>Trader: {task.applicantName}</span>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        <i className="bi bi-geo-alt text-danger me-1"></i> {task.premiseAddress}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={task.status} />
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

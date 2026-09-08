import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getOfficers, assignAndScheduleApplication } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';

export default function VerificationDeskPage() {
  const [searchParams] = useSearchParams();
  const assignAppIdParam = searchParams.get('assignAppId') || '';
  const { showToast } = useAuth();

  const [applications, setApplications] = useState([]);
  const [lmoOfficers, setLmoOfficers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);

  // Assignment Modal Form
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    officerId: '',
    officerName: '',
    scheduledDate: '2026-08-27',
    timeSlot: '10:30 AM - 01:00 PM',
    remarks: 'Approved by Controller for on-site physical verification and stamping.'
  });

  const refreshApplications = () => getApplications().then(setApplications).catch(() => setApplications([]));

  useEffect(() => {
    refreshApplications();
    getOfficers().then(setLmoOfficers).catch(() => setLmoOfficers([]));
  }, []);

  useEffect(() => {
    if (lmoOfficers.length > 0 && !assignForm.officerId) {
      setAssignForm((prev) => ({ ...prev, officerId: lmoOfficers[0].id, officerName: lmoOfficers[0].name }));
    }
  }, [lmoOfficers, assignForm.officerId]);

  useEffect(() => {
    if (assignAppIdParam) {
      const target = applications.find((a) => a.id === assignAppIdParam);
      if (target) {
        setSelectedApp(target);
        setShowAssignModal(true);
      }
    }
  }, [assignAppIdParam, applications]);

  const handleOpenAssignModal = (app) => {
    setSelectedApp(app);
    setShowAssignModal(true);
  };

  const handleOfficerSelect = (e) => {
    const offId = e.target.value;
    const off = lmoOfficers.find((o) => o.id === offId);
    setAssignForm((prev) => ({
      ...prev,
      officerId: offId,
      officerName: off ? off.name : prev.officerName
    }));
  };

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await assignAndScheduleApplication(selectedApp.id, assignForm);
      await refreshApplications();
      setShowAssignModal(false);
      showToast(`Application ${selectedApp.id} assigned to ${assignForm.officerName} for ${assignForm.scheduledDate}!`, 'success');
    } catch (error) {
      showToast(error.message || 'Failed to assign officer', 'danger');
    }
  };

  const filtered = applications.filter((a) => {
    const matchesSearch =
      !search.trim() ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      a.instrumentName.toLowerCase().includes(search.toLowerCase()) ||
      a.premiseAddress.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-verification-desk py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / National Admin / Applications Desk
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-inbox-fill text-danger me-2"></i> Verification & Stamping Applications Desk
            </h3>
            <p className="text-muted small mb-0">
              Review, validate statutory fee payment, and assign field inspections to Legal Metrology Officers.
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
                  placeholder="Search by Trader, App ID, Instrument, Address..."
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
                <option value="ALL">All Application Statuses ({applications.length})</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="SCHEDULED">Scheduled / Assigned</option>
                <option value="COMPLETED">Completed / Stamped</option>
                <option value="REJECTED">Rejected</option>
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

        {/* Table */}
        <div className="card border-0 shadow-sm bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Application ID</th>
                  <th>Applicant Establishment</th>
                  <th>Instrument Details</th>
                  <th>Site Premise Location</th>
                  <th>Fee Payment</th>
                  <th>Assigned Officer / Slot</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <strong className="font-monospace text-primary">{app.id}</strong>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {app.submittedDate}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{app.applicantName}</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {app.contactPhone}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{app.instrumentName}</div>
                      <span className="badge bg-info-subtle text-info border">{app.accuracyClass}</span>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        <i className="bi bi-geo-alt text-danger me-1"></i>
                        {app.premiseAddress}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-success-subtle text-success border">
                        {app.feeAmount} ({app.paymentStatus})
                      </span>
                      <div className="text-muted font-monospace" style={{ fontSize: '0.65rem' }}>
                        {app.feeTransactionId}
                      </div>
                    </td>
                    <td>
                      {app.assignedOfficerName ? (
                        <div>
                          <div className="fw-semibold text-dark">
                            <i className="bi bi-person-badge text-primary me-1"></i>
                            {app.assignedOfficerName}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {app.scheduledDate} ({app.scheduledTimeSlot})
                          </div>
                        </div>
                      ) : (
                        <span className="badge bg-warning text-dark">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenAssignModal(app)}
                        className="btn btn-sm btn-outline-danger fw-bold"
                      >
                        <i className="bi bi-person-check-fill me-1"></i> {app.assignedOfficerName ? 'Re-assign' : 'Assign LMO'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assignment Modal */}
        {showAssignModal && selectedApp && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1080 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-navy-dark text-white py-2 px-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-person-check-fill text-warning fs-5"></i>
                    <h6 className="modal-title fw-bold mb-0">
                      Assign Legal Metrology Officer — {selectedApp.id}
                    </h6>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowAssignModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleConfirmAssignment}>
                  <div className="modal-body p-4">
                    <div className="p-3 bg-light rounded border small mb-3">
                      <div className="fw-bold text-dark mb-1">{selectedApp.instrumentName}</div>
                      <div className="text-muted">Trader: <strong>{selectedApp.applicantName}</strong></div>
                      <div className="text-muted">Site: {selectedApp.premiseAddress}</div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Select Inspecting Officer / GATC Lab</label>
                      <select
                        className="form-select"
                        value={assignForm.officerId}
                        onChange={handleOfficerSelect}
                        required
                      >
                        {lmoOfficers.map((off) => (
                          <option key={off.id} value={off.id}>
                            {off.name} ({off.zone || off.labCode || 'Enforcement Wing'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold">Scheduled Inspection Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={assignForm.scheduledDate}
                          onChange={(e) => setAssignForm({ ...assignForm, scheduledDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">Inspection Time Slot</label>
                        <select
                          className="form-select"
                          value={assignForm.timeSlot}
                          onChange={(e) => setAssignForm({ ...assignForm, timeSlot: e.target.value })}
                        >
                          <option value="10:30 AM - 01:00 PM">10:30 AM - 01:00 PM</option>
                          <option value="02:00 PM - 04:30 PM">02:00 PM - 04:30 PM</option>
                          <option value="04:30 PM - 06:30 PM">04:30 PM - 06:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Controller Instructions / Remarks</label>
                      <input
                        type="text"
                        className="form-control"
                        value={assignForm.remarks}
                        onChange={(e) => setAssignForm({ ...assignForm, remarks: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-footer bg-light py-2 px-3">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAssignModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger btn-sm fw-bold px-3">
                      Confirm Assignment & Dispatch &rarr;
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

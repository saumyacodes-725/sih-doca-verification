import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { submitGatcReport } from '../../services/storageService';

export default function LabTestPage() {
  const { appId } = useParams();
  const { currentUser, showToast } = useAuth();
  const navigate = useNavigate();

  const [testForm, setTestForm] = useState({
    instrumentModel: 'Sartorius Secura 225D-1S Micro-Balance',
    manufacturer: 'Sartorius India',
    serialNumber: 'SR-2025-7890',
    accuracyClass: 'Class I (Special Precision)',
    standardWeightsUsed: 'E1 & E2 Standard Class Weights (NPL India Traceable)',
    temperature: '20.2 °C',
    humidity: '48.5 % RH',
    linearityError: '0.04 mg (Allowed: 0.10 mg)',
    repeatabilityStdDev: '0.02 mg',
    result: 'PASSED_CALIBRATION',
    officerRemarks: 'Instrument complies with OIML R76 Class I specifications. Recommended for statutory stamping by Legal Metrology Department.',
    technician: 'Dr. V. K. Ramanathan, Principal Metrologist'
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const created = submitGatcReport(testForm);
      showToast(`GATC Calibration Test Report ${created.id} issued successfully!`, 'success');
      navigate('/gatc');
    }, 1000);
  };

  return (
    <div className="gatc-lab-test-page py-4 px-3 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div className="mb-4">
          <div className="small text-muted mb-1">
            <span className="text-primary">Trust Scale</span> / GATC Test Lab / Metrology Test Bench
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 className="fw-bold text-navy-dark mb-0">
                <i className="bi bi-cpu text-success me-2"></i> High-Precision Laboratory Metrology Workbench
              </h3>
              <p className="text-muted small mb-0">
                OIML R76 Calibration Test & Environmental Standards Compliance Verification.
              </p>
            </div>
            <Link to="/gatc" className="btn btn-sm btn-outline-secondary">
              &larr; Back to Lab Dashboard
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Lab Test Card */}
          <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3">
            <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
              <i className="bi bi-sliders text-success me-2"></i> 1. Instrument Under Test & Standard Reference
            </h5>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Instrument Model</label>
                <input
                  type="text"
                  className="form-control"
                  value={testForm.instrumentModel}
                  onChange={(e) => setTestForm({ ...testForm, instrumentModel: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Serial Number</label>
                <input
                  type="text"
                  className="form-control font-monospace"
                  value={testForm.serialNumber}
                  onChange={(e) => setTestForm({ ...testForm, serialNumber: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Accuracy Class</label>
                <select
                  className="form-select"
                  value={testForm.accuracyClass}
                  onChange={(e) => setTestForm({ ...testForm, accuracyClass: e.target.value })}
                >
                  <option value="Class I (Special Precision)">Class I (Special Precision)</option>
                  <option value="Class II (High Accuracy)">Class II (High Accuracy)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Reference Mass Standard Used</label>
                <input
                  type="text"
                  className="form-control"
                  value={testForm.standardWeightsUsed}
                  onChange={(e) => setTestForm({ ...testForm, standardWeightsUsed: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Environmental Chamber Conditions */}
          <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3">
            <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
              <i className="bi bi-thermometer-half text-success me-2"></i> 2. Environmental Test Conditions (Controlled)
            </h5>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Chamber Temperature</label>
                <input
                  type="text"
                  className="form-control"
                  value={testForm.temperature}
                  onChange={(e) => setTestForm({ ...testForm, temperature: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Relative Humidity</label>
                <input
                  type="text"
                  className="form-control"
                  value={testForm.humidity}
                  onChange={(e) => setTestForm({ ...testForm, humidity: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Observed Linearity Error</label>
                <input
                  type="text"
                  className="form-control font-monospace"
                  value={testForm.linearityError}
                  onChange={(e) => setTestForm({ ...testForm, linearityError: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Repeatability Standard Deviation</label>
                <input
                  type="text"
                  className="form-control font-monospace"
                  value={testForm.repeatabilityStdDev}
                  onChange={(e) => setTestForm({ ...testForm, repeatabilityStdDev: e.target.value })}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold">Principal Metrologist Findings & Remarks</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={testForm.officerRemarks}
                  onChange={(e) => setTestForm({ ...testForm, officerRemarks: e.target.value })}
                  required
                ></textarea>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
              <Link to="/gatc" className="btn btn-outline-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-success fw-bold px-4 shadow"
              >
                {submitting ? 'Generating Report...' : 'Issue GATC Metrology Test Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

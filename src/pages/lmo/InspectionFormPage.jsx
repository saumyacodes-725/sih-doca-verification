import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApplicationById, getInstrumentById, completeInspection } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';
import CertificateModal from '../../components/common/CertificateModal';

const FALLBACK_APP = {
  id: 'APP-2026-103',
  instrumentId: 'INST-2026-001',
  instrumentName: 'Electronic Retail Weighing Scale EL-900',
  instrumentType: 'Electronic Retail Weighing Scale',
  applicantName: 'Apex Weighing & Logistics Ltd',
  applicantTraderId: 'USR-BIZ-01',
  accuracyClass: 'Class III (Medium Accuracy)',
  premiseAddress: 'Plot 42, Okhla Industrial Area Phase III, New Delhi - 110020',
  status: 'SCHEDULED'
};

export default function InspectionFormPage() {
  const { appId } = useParams();
  const { currentUser, showToast } = useAuth();
  const navigate = useNavigate();

  const [app, setApp] = useState({ ...FALLBACK_APP, id: appId || FALLBACK_APP.id });
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getApplicationById(appId)
      .then((found) => {
        const resolvedApp = found || { ...FALLBACK_APP, id: appId };
        setApp(resolvedApp);
        return getInstrumentById(resolvedApp.instrumentId).catch(() => null);
      })
      .then((inst) => setInstrument(inst))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [appId]);

  // GPS Check State
  const [gpsVerified, setGpsVerified] = useState(true);

  // Digital Statutory Checklist
  const [checklist, setChecklist] = useState({
    nameplateVerified: true,
    patternApprovalMatched: true,
    levelingBubbleCentered: true,
    sealingHoleIntact: true,
    zeroSettingAccurate: true,
    discriminationTestPassed: true
  });

  // Dynamic Multi-point Weight Test Table
  const [testRows, setTestRows] = useState([
    { id: 1, testPoint: 'Zero Load Check', appliedLoad: '0.000 kg', observedReading: '0.000 kg', errorVal: 0.00, errorStr: '0.00 g', mpeAllowed: '±2.5 g', maxMpe: 2.5, pass: true },
    { id: 2, testPoint: '1/3 Max Capacity', appliedLoad: '10.000 kg', observedReading: '10.000 kg', errorVal: 0.10, errorStr: '+0.10 g', mpeAllowed: '±5.0 g', maxMpe: 5.0, pass: true },
    { id: 3, testPoint: '2/3 Max Capacity', appliedLoad: '20.000 kg', observedReading: '20.000 kg', errorVal: 0.20, errorStr: '+0.20 g', mpeAllowed: '±5.0 g', maxMpe: 5.0, pass: true },
    { id: 4, testPoint: 'Full Max Capacity', appliedLoad: '30.000 kg', observedReading: '30.000 kg', errorVal: 0.20, errorStr: '+0.20 g', mpeAllowed: '±7.5 g', maxMpe: 7.5, pass: true },
    { id: 5, testPoint: 'Eccentric Corner Test', appliedLoad: '10.000 kg', observedReading: '10.000 kg', errorVal: 0.15, errorStr: '+0.15 g', mpeAllowed: '±5.0 g', maxMpe: 5.0, pass: true }
  ]);

  // Evidence Photos State
  const [evidenceUploaded, setEvidenceUploaded] = useState({
    plate: true,
    loadTest: true,
    seal: true
  });

  const [decision, setDecision] = useState('PASS');
  const [summaryNotes, setSummaryNotes] = useState('All weights tested against standard Class M1 weights. Errors within statutory MPE limits. Lead stamping seal applied.');
  const [rejectionReason, setRejectionReason] = useState('Observed error exceeds Maximum Permissible Error (MPE) limit.');
  const [submitting, setSubmitting] = useState(false);
  const [generatedCert, setGeneratedCert] = useState(null);

  const handleChecklistToggle = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTestErrorChange = (rowId, newObservedError) => {
    const num = parseFloat(newObservedError) || 0;
    setTestRows((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const isPass = Math.abs(num) <= row.maxMpe;
          return {
            ...row,
            errorVal: num,
            errorStr: `${num >= 0 ? '+' : ''}${num.toFixed(2)} g`,
            pass: isPass
          };
        }
        return row;
      })
    );
  };

  const handleCompleteFieldAudit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(async () => {
      const inspectionPayload = {
        outcome: decision,
        officerName: currentUser.name || 'Insp. Rajesh Sharma',
        summaryNotes,
        rejectionReason: decision === 'FAIL' ? rejectionReason : null,
        testDetails: testRows.map((r) => ({
          testPoint: r.testPoint,
          appliedLoad: r.appliedLoad,
          observedError: r.errorStr,
          mpeAllowed: r.mpeAllowed,
          status: r.pass ? 'PASS' : 'FAIL'
        })),
        evidencePhotos: [
          'photo_nameplate_verified.jpg',
          'photo_test_load_m1.jpg',
          'photo_stamping_seal_applied.jpg'
        ]
      };

      try {
        const result = await completeInspection(app.id, inspectionPayload);

        if (decision === 'PASS') {
          setGeneratedCert(result.certificate);
          showToast(`Field inspection PASSED! Certificate ${result.certificate.certificateNumber} generated.`, 'success');
        } else {
          showToast('Inspection marked FAILED. Notice of non-compliance issued to trader.', 'warning');
          navigate('/lmo/assigned');
        }
      } catch (error) {
        showToast(error.message || 'Failed to submit field verification', 'danger');
      } finally {
        setSubmitting(false);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="inspection-workbench py-4 px-3 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '950px' }}>
        {/* Header */}
        <div className="mb-4">
          <div className="small text-muted mb-1">
            <span className="text-primary">Trust Scale</span> / LMO Field Enforcement / Digital Inspection Workbench
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 className="fw-bold text-navy-dark mb-0">
                <i className="bi bi-tools text-warning me-2"></i> Digital Field Verification Workbench
              </h3>
              <div className="text-muted small">
                App ID: <strong className="font-monospace text-primary">{app.id}</strong> | Instrument: <strong>{app.instrumentName}</strong>
              </div>
            </div>
            <Link to="/lmo/assigned" className="btn btn-sm btn-outline-secondary">
              &larr; Back to Assigned Queue
            </Link>
          </div>
        </div>

        {/* Premise & Geotag Verification Banner */}
        <div className="card border-0 shadow-sm p-3 bg-white mb-4 rounded-3 border-start border-4 border-primary">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span className="badge bg-primary-subtle text-primary mb-1">ON-SITE AUDIT</span>
              <h6 className="fw-bold text-dark mb-0">{app.applicantName}</h6>
              <div className="small text-muted">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i> {app.premiseAddress}
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="text-end small">
                <div className="fw-semibold text-success">
                  <i className="bi bi-geo-fill me-1"></i> GPS Match Verified
                </div>
                <div className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>
                  28.5355° N, 77.2710° E (Δ 4m)
                </div>
              </div>
              <span className="badge bg-success p-2 rounded-circle">
                <i className="bi bi-check-lg fs-6"></i>
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleCompleteFieldAudit}>
          {/* SECTION 1: STATUTORY DIGITAL CHECKLIST */}
          <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3">
            <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
              <i className="bi bi-card-checklist text-primary me-2"></i> 1. Statutory Visual & Physical Checklist
            </h5>

            <div className="row g-3 small">
              <div className="col-md-6">
                <div className="form-check p-2 border rounded bg-light-subtle">
                  <input
                    className="form-check-input ms-1"
                    type="checkbox"
                    checked={checklist.nameplateVerified}
                    onChange={() => handleChecklistToggle('nameplateVerified')}
                    id="chk1"
                  />
                  <label className="form-check-label ms-2 fw-semibold" htmlFor="chk1">
                    Metallic Nameplate & Serial No. Verified
                  </label>
                  <div className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                    Model: {instrument?.model || 'EL-900 Plus'}, SN: {instrument?.serialNumber || 'AV-2024-8841'}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-check p-2 border rounded bg-light-subtle">
                  <input
                    className="form-check-input ms-1"
                    type="checkbox"
                    checked={checklist.patternApprovalMatched}
                    onChange={() => handleChecklistToggle('patternApprovalMatched')}
                    id="chk2"
                  />
                  <label className="form-check-label ms-2 fw-semibold" htmlFor="chk2">
                    Pattern Approval Compliance (IND-LM-PA)
                  </label>
                  <div className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                    Matches DoCA national type-approval standard
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-check p-2 border rounded bg-light-subtle">
                  <input
                    className="form-check-input ms-1"
                    type="checkbox"
                    checked={checklist.levelingBubbleCentered}
                    onChange={() => handleChecklistToggle('levelingBubbleCentered')}
                    id="chk3"
                  />
                  <label className="form-check-label ms-2 fw-semibold" htmlFor="chk3">
                    Spirit Leveling Bubble Perfectly Centered
                  </label>
                  <div className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                    Instrument is leveled on stable, rigid countertop
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-check p-2 border rounded bg-light-subtle">
                  <input
                    className="form-check-input ms-1"
                    type="checkbox"
                    checked={checklist.sealingHoleIntact}
                    onChange={() => handleChecklistToggle('sealingHoleIntact')}
                    id="chk4"
                  />
                  <label className="form-check-label ms-2 fw-semibold" htmlFor="chk4">
                    Stamping Seal Eyelet / Hole Free of Tampering
                  </label>
                  <div className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                    Provision for lead wire seal or holographic tamper tape
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-check p-2 border rounded bg-light-subtle">
                  <input
                    className="form-check-input ms-1"
                    type="checkbox"
                    checked={checklist.zeroSettingAccurate}
                    onChange={() => handleChecklistToggle('zeroSettingAccurate')}
                    id="chk5"
                  />
                  <label className="form-check-label ms-2 fw-semibold" htmlFor="chk5">
                    Zero-Setting / Tare Device Return Accuracy
                  </label>
                  <div className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                    Returns to ±0.25e under no-load condition
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-check p-2 border rounded bg-light-subtle">
                  <input
                    className="form-check-input ms-1"
                    type="checkbox"
                    checked={checklist.discriminationTestPassed}
                    onChange={() => handleChecklistToggle('discriminationTestPassed')}
                    id="chk6"
                  />
                  <label className="form-check-label ms-2 fw-semibold" htmlFor="chk6">
                    Sensitivity & Discrimination Test Passed
                  </label>
                  <div className="text-muted ms-2" style={{ fontSize: '0.7rem' }}>
                    Additional 1.4d weight produces perceptible display change
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: METROLOGICAL WEIGHT TOLERANCE TEST TABLE */}
          <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <div>
                <h5 className="fw-bold text-navy-dark mb-0">
                  <i className="bi bi-speedometer2 text-primary me-2"></i> 2. Metrological Load Tests & MPE Calculation
                </h5>
                <small className="text-muted">Standard Class M1 Test Weights applied at 5 statutory test points.</small>
              </div>
              <span className="badge bg-info-subtle text-info border">
                {instrument?.accuracyClass || 'Class III (Medium Accuracy)'}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center small mb-2">
                <thead className="table-light">
                  <tr>
                    <th>Test Point Description</th>
                    <th>Applied Load</th>
                    <th>Observed Display Reading</th>
                    <th>Observed Error (g)</th>
                    <th>MPE Allowed Limit</th>
                    <th>Tolerance Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {testRows.map((row) => (
                    <tr key={row.id}>
                      <td className="text-start fw-semibold">{row.testPoint}</td>
                      <td className="font-monospace">{row.appliedLoad}</td>
                      <td className="font-monospace text-dark">{row.observedReading}</td>
                      <td style={{ width: '150px' }}>
                        <div className="input-group input-group-sm">
                          <input
                            type="number"
                            step="0.05"
                            className="form-control text-center font-monospace"
                            value={row.errorVal}
                            onChange={(e) => handleTestErrorChange(row.id, e.target.value)}
                          />
                          <span className="input-group-text bg-light">g</span>
                        </div>
                      </td>
                      <td className="font-monospace text-muted">{row.mpeAllowed}</td>
                      <td>
                        <span className={`badge ${row.pass ? 'bg-success' : 'bg-danger'} px-2 py-1`}>
                          {row.pass ? 'PASS (Within MPE)' : 'FAIL (Exceeds MPE)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="small text-muted mt-1">
              *Maximum Permissible Error (MPE) calculated under Seventh Schedule, Legal Metrology (General) Rules, 2011.
            </div>
          </div>

          {/* SECTION 3: PHOTO EVIDENCE CAPTURE SIMULATOR */}
          <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3">
            <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
              <i className="bi bi-camera-fill text-primary me-2"></i> 3. On-Site Photo Evidence Upload (Simulated)
            </h5>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 border rounded text-center bg-light-subtle h-100">
                  <div className="text-success fs-3 mb-1">
                    <i className="bi bi-image-fill"></i>
                  </div>
                  <div className="fw-bold small text-dark">1. Metallic Nameplate Photo</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>Model, Serial & Class</div>
                  <span className="badge bg-success-subtle text-success mt-2">Captured & Attached</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 border rounded text-center bg-light-subtle h-100">
                  <div className="text-success fs-3 mb-1">
                    <i className="bi bi-image-fill"></i>
                  </div>
                  <div className="fw-bold small text-dark">2. Standard Test Load on Pan</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>30kg Max Load Display</div>
                  <span className="badge bg-success-subtle text-success mt-2">Captured & Attached</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 border rounded text-center bg-light-subtle h-100">
                  <div className="text-success fs-3 mb-1">
                    <i className="bi bi-image-fill"></i>
                  </div>
                  <div className="fw-bold small text-dark">3. Lead Seal / QR Stamping Tag</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>Holographic Tag Affixed</div>
                  <span className="badge bg-success-subtle text-success mt-2">Captured & Attached</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: FINAL STATUTORY DECISION */}
          <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3 border-start border-4 border-warning">
            <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
              <i className="bi bi-patch-question text-warning me-2"></i> 4. Verification Outcome & Stamping Seal Generation
            </h5>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Officer Inspection Verdict</label>
                <div className="d-flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision('PASS')}
                    className={`btn flex-grow-1 fw-bold ${decision === 'PASS' ? 'btn-success text-white shadow' : 'btn-outline-secondary'}`}
                  >
                    <i className="bi bi-check-circle-fill me-1"></i> PASS & ISSUE STAMP
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision('FAIL')}
                    className={`btn flex-grow-1 fw-bold ${decision === 'FAIL' ? 'btn-danger text-white shadow' : 'btn-outline-secondary'}`}
                  >
                    <i className="bi bi-x-circle-fill me-1"></i> FAIL & ISSUE NOTICE
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Issuing Stamping Kit</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value="STAMP-KIT-DL-44 (Insp. Rajesh Sharma)"
                  readOnly
                />
              </div>

              {decision === 'PASS' ? (
                <div className="col-12">
                  <div className="alert alert-success d-flex align-items-center gap-3 p-3 rounded mb-0">
                    <i className="bi bi-shield-check fs-2 text-success"></i>
                    <div>
                      <strong>Stamping Tag Ready to Apply:</strong>
                      <div className="small">
                        Upon submission, system will generate official Tag No. <code>LM-DL-2026-XXXX</code>, SHA-256 digital signature hash, and publish valid certificate to national QR registry.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-12">
                  <label className="form-label small fw-bold text-danger">Statutory Grounds for Rejection</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Specify exact error margin or physical defect..."
                    required
                  ></textarea>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
              <Link to="/lmo/assigned" className="btn btn-outline-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className={`btn fw-bold px-4 shadow ${decision === 'PASS' ? 'btn-warning text-dark' : 'btn-danger'}`}
              >
                {submitting ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Generating Certificate...
                  </span>
                ) : decision === 'PASS' ? (
                  <span>
                    <i className="bi bi-award-fill me-1"></i> Apply Stamping & Issue Digital Certificate
                  </span>
                ) : (
                  <span>
                    <i className="bi bi-file-earmark-x-fill me-1"></i> Confirm Rejection & Issue Notice
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Certificate Modal on PASS */}
        {generatedCert && (
          <CertificateModal
            certificate={generatedCert}
            onClose={() => {
              setGeneratedCert(null);
              navigate('/lmo/assigned');
            }}
          />
        )}
      </div>
    </div>
  );
}

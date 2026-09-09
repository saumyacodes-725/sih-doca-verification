import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getInstruments,
  submitApplication,
  getPaymentGatewayStatus,
  createPaymentOrder,
  verifyPayment
} from '../../services/storageService';

export default function ApplyVerificationPage() {
  const [searchParams] = useSearchParams();
  const preSelectedInstId = searchParams.get('instId') || '';
  const { currentUser, showToast } = useAuth();
  const navigate = useNavigate();

  const [allInstruments, setAllInstruments] = useState([]);

  useEffect(() => {
    getInstruments().then(setAllInstruments).catch(() => setAllInstruments([]));
  }, []);

  const myInstruments = allInstruments.filter(
    (i) => i.ownerTraderId === currentUser.id || i.ownerName.includes('Apex') || !i.ownerTraderId
  );

  const [selectedInstId, setSelectedInstId] = useState(preSelectedInstId || '');
  const [applicationType, setApplicationType] = useState('Periodic Annual Re-verification');
  const [preferredDate, setPreferredDate] = useState('2026-08-28');
  const [preferredSlot, setPreferredSlot] = useState('10:30 AM - 01:00 PM');
  const [remarks, setRemarks] = useState('Annual re-verification requested. Instrument available at site.');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [gatewayConfigured, setGatewayConfigured] = useState(false);
  const [pendingPaymentHandled, setPendingPaymentHandled] = useState(false);

  useEffect(() => {
    getPaymentGatewayStatus()
      .then((res) => setGatewayConfigured(Boolean(res?.configured)))
      .catch(() => setGatewayConfigured(false));
  }, []);

  useEffect(() => {
    if (preSelectedInstId) {
      setSelectedInstId(preSelectedInstId);
    }
  }, [preSelectedInstId]);

  useEffect(() => {
    if (!selectedInstId && myInstruments.length > 0) {
      setSelectedInstId(myInstruments[0].id);
    }
  }, [myInstruments, selectedInstId]);

  const selectedInst = myInstruments.find((i) => i.id === selectedInstId) || myInstruments[0];

  // Calculate statutory fee based on accuracy class & category
  const calculateFee = () => {
    if (!selectedInst) return { total: '₹ 800', verification: '₹ 600', seal: '₹ 100', portal: '₹ 100' };
    if (selectedInst.type.includes('Weighbridge')) {
      return { total: '₹ 4,500', verification: '₹ 4,000', seal: '₹ 300', portal: '₹ 200' };
    }
    if (selectedInst.accuracyClass.includes('Class I')) {
      return { total: '₹ 2,000', verification: '₹ 1,700', seal: '₹ 200', portal: '₹ 100' };
    }
    if (selectedInst.category.includes('Petroleum')) {
      return { total: '₹ 2,500', verification: '₹ 2,200', seal: '₹ 200', portal: '₹ 100' };
    }
    return { total: '₹ 800', verification: '₹ 600', seal: '₹ 100', portal: '₹ 100' };
  };

  const feeData = calculateFee();

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!selectedInst) {
      showToast('Please register or select an instrument first', 'danger');
      return;
    }
    if (gatewayConfigured) {
      handleRealPayment();
    } else {
      setShowPaymentModal(true);
    }
  };

  // Shared submission step for both the real Stripe flow and the simulated
  // Bharatkosh fallback. `overrides` lets the post-redirect Stripe return
  // (see the effect below) supply the instrument/application-type/remarks
  // explicitly, since the page remounts fresh after leaving for Stripe's
  // hosted checkout and loses the original form's React state.
  const finalizeSubmission = async (paymentFields = {}, overrides = {}) => {
    const inst = overrides.selectedInst || selectedInst;
    const newApp = await submitApplication({
      instrumentId: inst.id,
      applicantName: currentUser.company || 'Apex Weighing & Logistics Ltd',
      applicantEmail: currentUser.email || 'compliance@apexlogistics.mock',
      applicationType: overrides.applicationType ?? applicationType,
      premiseAddress: inst.location,
      remarks: overrides.remarks ?? `${remarks} | Preferred Slot: ${preferredDate} (${preferredSlot})`,
      ...paymentFields
    });
    showToast(`Verification Application ${newApp.id} submitted with payment receipt!`, 'success');
    navigate('/business/applications');
  };

  // Stripe Checkout is redirect-based (no client-side script needed) — the
  // browser fully leaves the app, so the current form values are stashed in
  // sessionStorage and restored by the effect below when Stripe redirects
  // back to success_url.
  const handleRealPayment = async () => {
    setPaymentProcessing(true);
    try {
      const order = await createPaymentOrder(selectedInst.id);
      sessionStorage.setItem(
        'pendingVerificationApp',
        JSON.stringify({
          applicationType,
          remarksFull: `${remarks} | Preferred Slot: ${preferredDate} (${preferredSlot})`
        })
      );
      window.location.href = order.url;
    } catch (error) {
      setPaymentProcessing(false);
      showToast(error.message || 'Could not start payment', 'danger');
    }
  };

  // Handle the return trip from Stripe Checkout (?payment=success|cancelled).
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (!paymentStatus || pendingPaymentHandled) return;

    if (paymentStatus === 'cancelled') {
      setPendingPaymentHandled(true);
      showToast('Payment cancelled', 'warning');
      navigate('/business/apply', { replace: true });
      return;
    }

    if (paymentStatus === 'success') {
      if (myInstruments.length === 0) return; // wait for the instrument list to load first
      const sessionId = searchParams.get('session_id');
      const instrumentIdParam = searchParams.get('instrumentId');
      const inst = myInstruments.find((i) => i.id === instrumentIdParam);

      if (!sessionId || !inst) {
        setPendingPaymentHandled(true);
        showToast('Could not complete submission — missing payment details', 'danger');
        navigate('/business/apply', { replace: true });
        return;
      }

      setPendingPaymentHandled(true);
      const stash = JSON.parse(sessionStorage.getItem('pendingVerificationApp') || '{}');

      (async () => {
        try {
          await verifyPayment({ sessionId });
          await finalizeSubmission(
            { stripe_session_id: sessionId },
            { selectedInst: inst, applicationType: stash.applicationType, remarks: stash.remarksFull }
          );
          sessionStorage.removeItem('pendingVerificationApp');
        } catch (error) {
          showToast(error.message || 'Payment verification failed', 'danger');
          navigate('/business/apply', { replace: true });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, myInstruments, pendingPaymentHandled]);

  const handleConfirmPaymentAndSubmit = () => {
    setPaymentProcessing(true);
    setTimeout(async () => {
      try {
        await finalizeSubmission();
      } catch (error) {
        showToast(error.message || 'Failed to submit application', 'danger');
      } finally {
        setPaymentProcessing(false);
        setShowPaymentModal(false);
      }
    }, 1200);
  };

  return (
    <div className="apply-verification-page py-4 px-3 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="small text-muted mb-1">
            <span className="text-primary">Trust Scale</span> / Business Trader / Apply Verification
          </div>
          <h3 className="fw-bold text-navy-dark mb-0">
            <i className="bi bi-patch-check-fill text-warning me-2"></i> Application for Verification & Stamping
          </h3>
          <p className="text-muted small mb-0">
            Mandatory statutory stamping under Section 24 of The Legal Metrology Act, 2009.
          </p>
        </div>

        {myInstruments.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center bg-white">
            <div className="fs-1 text-muted mb-2">📦</div>
            <h5 className="fw-bold text-navy-dark">No Instruments in Your Fleet</h5>
            <p className="text-muted small">Please register your weighing instrument first before applying for verification.</p>
            <div>
              <Link to="/business/register" className="btn btn-warning text-dark fw-bold">
                Register New Instrument
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleOpenPayment}>
            {/* Instrument Selection Card */}
            <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-box-seam text-primary me-2"></i> 1. Select Instrument for Verification
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold">Choose from Registered Fleet</label>
                  <select
                    className="form-select"
                    value={selectedInstId}
                    onChange={(e) => setSelectedInstId(e.target.value)}
                    required
                  >
                    {myInstruments.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.type} — {inst.model} (SN: {inst.serialNumber}) [{inst.status}]
                      </option>
                    ))}
                  </select>
                </div>

                {selectedInst && (
                  <div className="col-12">
                    <div className="p-3 bg-light rounded border small">
                      <div className="row g-2">
                        <div className="col-md-4">
                          <span className="text-muted d-block">Accuracy Class:</span>
                          <strong className="text-primary">{selectedInst.accuracyClass}</strong>
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted d-block">Max Capacity & Interval:</span>
                          <strong>{selectedInst.maxCapacity} (e={selectedInst.verificationInterval})</strong>
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted d-block">Current Status:</span>
                          <span className="badge bg-secondary-subtle text-secondary">{selectedInst.status}</span>
                        </div>
                        <div className="col-12 border-top pt-2 mt-1">
                          <span className="text-muted d-block">Premise Address:</span>
                          <span>{selectedInst.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Type & Schedule */}
            <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-calendar-check text-primary me-2"></i> 2. Verification Type & Preferred Inspection Slot
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Verification Category</label>
                  <select
                    className="form-select"
                    value={applicationType}
                    onChange={(e) => setApplicationType(e.target.value)}
                  >
                    <option value="Periodic Annual Re-verification">Periodic Annual Re-verification</option>
                    <option value="First-time Initial Stamping & Verification">First-time Initial Stamping & Verification</option>
                    <option value="Post-Repair Stamping & Recalibration">Post-Repair Stamping & Recalibration</option>
                    <option value="Re-verification after Re-installation / Relocation">Re-verification after Relocation</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Preferred Inspection Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Preferred Time Slot</label>
                  <select
                    className="form-select"
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                  >
                    <option value="10:30 AM - 01:00 PM">Morning Slot (10:30 AM - 01:00 PM)</option>
                    <option value="02:00 PM - 04:30 PM">Afternoon Slot (02:00 PM - 04:30 PM)</option>
                    <option value="04:30 PM - 06:30 PM">Evening Slot (04:30 PM - 06:30 PM)</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Special Remarks / Notes</label>
                  <input
                    type="text"
                    className="form-control"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Test weights readily available at site"
                  />
                </div>
              </div>
            </div>

            {/* Statutory Fee Calculation & Checkout */}
            <div className="card border-0 shadow-sm p-4 bg-white mb-4 rounded-3 border-start border-4 border-warning">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-receipt text-warning me-2"></i> 3. Statutory Fee Breakdown (Schedule VIII Rules)
              </h5>

              <div className="row g-2 small mb-3">
                <div className="col-8 text-muted">Legal Metrology Inspection & Stamping Fee:</div>
                <div className="col-4 text-end fw-semibold">{feeData.verification}</div>

                <div className="col-8 text-muted">Tamper-Evident Lead / Holographic Seal Tag Fee:</div>
                <div className="col-4 text-end fw-semibold">{feeData.seal}</div>

                <div className="col-8 text-muted">National Portal Online Processing & Verification Charge:</div>
                <div className="col-4 text-end fw-semibold">{feeData.portal}</div>

                <div className="col-12 border-top my-1"></div>

                <div className="col-8 fw-bold fs-6 text-navy-dark">Total Statutory Payable:</div>
                <div className="col-4 text-end fw-bold fs-5 text-success">{feeData.total}</div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2">
                <div className="small text-muted">
                  {gatewayConfigured ? (
                    <><i className="bi bi-shield-lock-fill text-success me-1"></i> Secured via Stripe (test mode)</>
                  ) : (
                    <><i className="bi bi-shield-lock-fill text-success me-1"></i> Secured via Bharatkosh / SBI e-Pay (simulated)</>
                  )}
                </div>
                <button type="submit" className="btn btn-warning text-dark fw-bold px-4 shadow" disabled={paymentProcessing}>
                  {paymentProcessing ? 'Starting payment…' : `Proceed to Online Payment (${feeData.total}) →`}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Bharatkosh Payment Gateway Simulator Modal */}
        {showPaymentModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1080 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-navy-dark text-white py-2 px-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning text-dark fw-bold">BHARATKOSH</span>
                    <h6 className="modal-title fw-bold mb-0">Non-Tax Receipt Portal (NTRP)</h6>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowPaymentModal(false)}
                    disabled={paymentProcessing}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="text-center mb-3">
                    <div className="small text-muted text-uppercase">Payment to Department of Consumer Affairs</div>
                    <h3 className="fw-bold text-success my-1">{feeData.total}</h3>
                    <span className="badge bg-light text-dark border">
                      Ref: NTRP-DOCA-LM-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>

                  <div className="p-3 bg-light rounded border small mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Applicant:</span>
                      <strong>{currentUser.company}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Purpose:</span>
                      <span>{applicationType}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Instrument:</span>
                      <span>{selectedInst?.type}</span>
                    </div>
                  </div>

                  {paymentProcessing ? (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary mb-2" role="status"></div>
                      <div className="fw-semibold text-dark">Processing Bharatkosh Transaction...</div>
                      <small className="text-muted">Generating statutory receipt and submitting to LMO queue</small>
                    </div>
                  ) : (
                    <div>
                      <label className="form-label small fw-bold text-muted mb-2">Select Payment Mode (Simulated)</label>
                      <div className="d-grid gap-2 mb-3">
                        <button
                          type="button"
                          onClick={handleConfirmPaymentAndSubmit}
                          className="btn btn-outline-primary text-start p-2 d-flex justify-content-between align-items-center"
                        >
                          <span><i className="bi bi-bank me-2"></i> State Bank of India / Net Banking</span>
                          <span className="badge bg-success-subtle text-success">Instant</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmPaymentAndSubmit}
                          className="btn btn-outline-primary text-start p-2 d-flex justify-content-between align-items-center"
                        >
                          <span><i className="bi bi-qr-code me-2"></i> UPI / BHIM / BharatQR</span>
                          <span className="badge bg-success-subtle text-success">Zero Charge</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer bg-light py-2 px-3">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowPaymentModal(false)}
                    disabled={paymentProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

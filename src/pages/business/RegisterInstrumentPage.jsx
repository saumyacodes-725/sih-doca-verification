import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addInstrument } from '../../services/storageService';

export default function RegisterInstrumentPage() {
  const { currentUser, showToast } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'Electronic Retail Weighing Scale',
    category: 'Commercial Weighing',
    manufacturer: 'Avery India Ltd',
    model: 'EL-900 Plus Dual Display',
    serialNumber: `AV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    patternApprovalNo: 'IND-LM-PA-2024-881',
    accuracyClass: 'Class III (Medium Accuracy)',
    maxCapacity: '30 kg',
    minCapacity: '100 g',
    verificationInterval: '5 g',
    location: 'Plot 42, Okhla Industrial Area Phase III, New Delhi',
    state: 'Delhi',
    district: 'South Delhi',
    latitude: '28.5355',
    longitude: '77.2710',
    ownerName: currentUser.company || 'Apex Weighing & Logistics Ltd',
    ownerTraderId: currentUser.id || 'USR-BIZ-01',
    ownerEmail: currentUser.email || 'compliance@apexlogistics.mock',
    businessRegNo: 'GSTIN07AAACA1234F1Z5'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillPreset = (presetType) => {
    if (presetType === 'retail') {
      setFormData((prev) => ({
        ...prev,
        type: 'Electronic Retail Weighing Scale',
        category: 'Commercial Weighing',
        manufacturer: 'Avery India Ltd',
        model: 'EL-900 Plus Dual Display',
        serialNumber: `AV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        accuracyClass: 'Class III (Medium Accuracy)',
        maxCapacity: '30 kg',
        minCapacity: '100 g',
        verificationInterval: '5 g'
      }));
    } else if (presetType === 'jewel') {
      setFormData((prev) => ({
        ...prev,
        type: 'High-Precision Micro-Analytical Balance',
        category: 'Jewellery & Precious Metals',
        manufacturer: 'Sartorius India',
        model: 'Secura 225D-1S Micro-Balance',
        serialNumber: `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        accuracyClass: 'Class I (Special Precision)',
        maxCapacity: '220 g',
        minCapacity: '1 mg',
        verificationInterval: '0.1 mg'
      }));
    } else if (presetType === 'weighbridge') {
      setFormData((prev) => ({
        ...prev,
        type: 'Heavy Duty Electronic Weighbridge',
        category: 'Industrial Weighing',
        manufacturer: 'Eagle Scales Pvt Ltd',
        model: 'WB-Pro 60T Pitless Weighbridge',
        serialNumber: 'EG-2026-9041',
        accuracyClass: 'Class IV (Ordinary Accuracy)',
        maxCapacity: '60 Tonnes',
        minCapacity: '200 kg',
        verificationInterval: '10 kg'
      }));
    }
    showToast(`Loaded ${presetType.toUpperCase()} preset specs`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await addInstrument(formData);
      showToast(`Instrument ${created.id} registered successfully in National Registry!`, 'success');
      navigate(`/business/instruments/${created.id}`);
    } catch (error) {
      showToast(error.message || 'Failed to register instrument', 'danger');
    }
  };

  return (
    <div className="register-instrument-page py-4 px-3 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Header */}
        <div className="mb-4">
          <div className="small text-muted mb-1">
            <span className="text-primary">Trust Scale</span> / Business Trader / Register Instrument
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 className="fw-bold text-navy-dark mb-0">
                <i className="bi bi-plus-circle-fill text-warning me-2"></i> Register Weighing & Measuring Device
              </h3>
              <p className="text-muted small mb-0">
                Statutory registration under Legal Metrology Act, 2009 & General Rules, 2011.
              </p>
            </div>
            <div className="d-flex gap-1">
              <span className="small text-muted align-self-center me-1">Demo Quick Presets:</span>
              <button
                type="button"
                onClick={() => handleFillPreset('retail')}
                className="btn btn-sm btn-outline-primary py-0 px-2"
              >
                Retail Scale
              </button>
              <button
                type="button"
                onClick={() => handleFillPreset('jewel')}
                className="btn btn-sm btn-outline-primary py-0 px-2"
              >
                Jewellery Scale
              </button>
              <button
                type="button"
                onClick={() => handleFillPreset('weighbridge')}
                className="btn btn-sm btn-outline-primary py-0 px-2"
              >
                Weighbridge
              </button>
            </div>
          </div>
        </div>

        {/* Multi-step progress stepper */}
        <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
          <div className="d-flex justify-content-between align-items-center text-center">
            <div className={`step-item ${step >= 1 ? 'text-primary fw-bold' : 'text-muted'}`}>
              <div className={`badge rounded-circle mb-1 p-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>1</div>
              <div className="small">Device Category</div>
            </div>
            <div className="flex-grow-1 border-top mx-2"></div>
            <div className={`step-item ${step >= 2 ? 'text-primary fw-bold' : 'text-muted'}`}>
              <div className={`badge rounded-circle mb-1 p-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>2</div>
              <div className="small">Make & Model</div>
            </div>
            <div className="flex-grow-1 border-top mx-2"></div>
            <div className={`step-item ${step >= 3 ? 'text-primary fw-bold' : 'text-muted'}`}>
              <div className={`badge rounded-circle mb-1 p-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>3</div>
              <div className="small">Capacity & Interval</div>
            </div>
            <div className="flex-grow-1 border-top mx-2"></div>
            <div className={`step-item ${step >= 4 ? 'text-primary fw-bold' : 'text-muted'}`}>
              <div className={`badge rounded-circle mb-1 p-2 ${step >= 4 ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>4</div>
              <div className="small">Location & Docs</div>
            </div>
          </div>
        </div>

        {/* Wizard Card */}
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
          <form onSubmit={handleSubmit}>
            {/* STEP 1: CATEGORY & CLASS */}
            {step === 1 && (
              <div>
                <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                  <i className="bi bi-tag text-primary me-2"></i> Step 1: Legal Metrology Category & Accuracy Class
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Instrument Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="Commercial Weighing">Commercial Weighing (Retail Scales)</option>
                      <option value="Industrial Weighing">Industrial Weighing (Weighbridges / Platforms)</option>
                      <option value="Petroleum & Liquid Volume">Petroleum & Liquid Volume (Fuel MPDs / Flowmeters)</option>
                      <option value="Packaging & Automated Filling">Packaging & Automated Filling</option>
                      <option value="Jewellery & Precious Metals">Jewellery & Precious Metals (Class I & II)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Instrument Type Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      placeholder="e.g. Electronic Retail Scale"
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label small fw-bold">Accuracy Class (OIML / Legal Metrology)</label>
                    <select
                      className="form-select"
                      name="accuracyClass"
                      value={formData.accuracyClass}
                      onChange={handleChange}
                    >
                      <option value="Class I (Special Precision)">Class I (Special Precision - Laboratory / Gold)</option>
                      <option value="Class II (High Accuracy)">Class II (High Accuracy - Precision Weighing / Pharma)</option>
                      <option value="Class III (Medium Accuracy)">Class III (Medium Accuracy - Commercial Retail / APMC)</option>
                      <option value="Class IV (Ordinary Accuracy)">Class IV (Ordinary Accuracy - Industrial Weighbridges)</option>
                      <option value="Class 0.5 (Liquid Fuel Standards)">Class 0.5 (Liquid Fuel Standards - Petroleum MPD)</option>
                    </select>
                    <small className="text-muted">
                      Determines the statutory Maximum Permissible Error (MPE) tolerances for on-site tests.
                    </small>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-primary fw-semibold px-4"
                  >
                    Next: Make & Model &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: MAKE & MODEL */}
            {step === 2 && (
              <div>
                <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                  <i className="bi bi-gear text-primary me-2"></i> Step 2: Manufacturer, Model & Serial Identification
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Manufacturer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      placeholder="e.g. Avery India Ltd / Eagle Scales"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Model Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g. EL-900 Plus"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Serial Number (on metallic nameplate)</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      placeholder="e.g. AV-2024-8841"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Government Pattern Approval No.</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      name="patternApprovalNo"
                      value={formData.patternApprovalNo}
                      onChange={handleChange}
                      placeholder="e.g. IND-LM-PA-2023-412"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-outline-secondary px-4"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-primary fw-semibold px-4"
                  >
                    Next: Capacity Specs &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CAPACITY & INTERVAL */}
            {step === 3 && (
              <div>
                <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                  <i className="bi bi-speedometer text-primary me-2"></i> Step 3: Capacity Limits & Verification Interval
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Maximum Capacity (Max)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleChange}
                      placeholder="e.g. 30 kg / 60 Tonnes"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Minimum Capacity (Min)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="minCapacity"
                      value={formData.minCapacity}
                      onChange={handleChange}
                      placeholder="e.g. 100 g / 200 kg"
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Verification Scale Interval (e)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="verificationInterval"
                      value={formData.verificationInterval}
                      onChange={handleChange}
                      placeholder="e.g. 5 g / 10 kg / 0.1 mg"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <div className="alert alert-info py-2 small mb-0">
                      <i className="bi bi-info-circle-fill me-1"></i> Verification scale interval (e) determines the allowable tolerance limits during field stamping tests under the Seventh Schedule of General Rules 2011.
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-outline-secondary px-4"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="btn btn-primary fw-semibold px-4"
                  >
                    Next: Location & Submit &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: LOCATION & SUBMISSION */}
            {step === 4 && (
              <div>
                <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                  <i className="bi bi-geo-alt text-primary me-2"></i> Step 4: Installation Location & Geotag Coordinates
                </h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold">Premise / Shop / Factory Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter physical site address where instrument is stationed"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">State / UT</label>
                    <select
                      className="form-select"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">District Legal Metrology Zone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="e.g. South Delhi / Thane"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Latitude Geotag</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Longitude Geotag</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <div className="p-3 border rounded bg-light-subtle small">
                      <div className="fw-bold mb-1">
                        <i className="bi bi-file-earmark-arrow-up text-primary me-1"></i> Upload Supporting Documents (Mock)
                      </div>
                      <div className="text-muted">
                        Manufacturer Calibration Certificate & Model Plate Photo attached (Demo preset verified).
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-outline-secondary px-4"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning text-dark fw-bold px-4 shadow-sm"
                  >
                    <i className="bi bi-check2-circle me-1"></i> Complete Instrument Registration
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

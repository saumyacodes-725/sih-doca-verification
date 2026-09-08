import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage() {
  const { signup, showToast } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: 'business',
    category: 'Commercial Weighing & Logistics',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gstin: '',
    state: 'Delhi',
    district: 'South Delhi',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Captcha Generator
  function generateCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  const [captchaCode, setCaptchaCode] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickFill = (type) => {
    if (type === 'retailer') {
      setFormData({
        name: 'Sunil Verma',
        company: 'Verma Supermarket & Provision Store',
        role: 'business',
        category: 'Commercial Weighing & Retail',
        email: 'sunil.verma@vermastores.mock',
        phone: '9810123456',
        password: 'TraderPass@123',
        confirmPassword: 'TraderPass@123',
        gstin: '07AAAAA0000A1Z5',
        state: 'Delhi',
        district: 'Central Delhi',
        address: 'Shop No. 14, Main Market, Karol Bagh'
      });
    } else if (type === 'jeweller') {
      setFormData({
        name: 'Mahesh Choksi',
        company: 'Choksi Heritage Bullion & Gems',
        role: 'business',
        category: 'Jewellery & Precious Metals',
        email: 'mahesh@choksibullion.mock',
        phone: '9820987654',
        password: 'GoldBullion@123',
        confirmPassword: 'GoldBullion@123',
        gstin: '27AABBC1122D1Z8',
        state: 'Maharashtra',
        district: 'Mumbai City',
        address: '88, Zaveri Bazaar, Kalbadevi'
      });
    } else if (type === 'citizen') {
      setFormData({
        name: 'Anjali Sharma',
        company: '',
        role: 'public',
        category: 'Citizen / Consumer',
        email: 'anjali.consumer@email.mock',
        phone: '9871122334',
        password: 'CitizenPass@123',
        confirmPassword: 'CitizenPass@123',
        gstin: '',
        state: 'Delhi',
        district: 'South Delhi',
        address: 'B-44, Greater Kailash Part 1'
      });
    }
    setCaptchaInput(captchaCode);
    setErrorMsg('');
    showToast(`Pre-filled sample profile for quick registration test.`, 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Full Name / Authorized Signatory is required.');
      return;
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMsg('Either Email or Mobile Number is required.');
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (captchaInput && captchaInput.trim().toUpperCase() !== captchaCode) {
      setErrorMsg('Security Captcha code does not match. Please enter the code shown in the box.');
      setCaptchaCode(generateCaptcha());
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg('You must accept the Legal Metrology Act compliance declaration to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = signup(formData);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to register account. Please check your details.');
        setIsSubmitting(false);
        return;
      }

      // Navigate to destination dashboard
      if (res.role === 'business') {
        navigate('/business');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light py-4 py-md-5">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                <i className="bi bi-house me-1"></i>Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/login" className="text-decoration-none">Authentication</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Stakeholder Registration
            </li>
          </ol>
        </nav>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            {/* National Legal Metrology Header Badge */}
            <div className="card border-0 shadow-sm mb-4 bg-primary text-white overflow-hidden">
              <div className="card-body p-4 position-relative">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-white text-primary rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 56, height: 56 }}>
                      <i className="bi bi-person-plus-fill fs-3"></i>
                    </div>
                    <div>
                      <span className="badge bg-warning text-dark fw-bold mb-1">
                        e-MĀPAN Stamping Portal
                      </span>
                      <h4 className="fw-bold mb-0">Stakeholder Registration</h4>
                      <p className="small mb-0 text-white-50">
                        Department of Consumer Affairs • Legal Metrology Division, Govt. of India
                      </p>
                    </div>
                  </div>
                  <div>
                    <Link to="/login" className="btn btn-outline-light btn-sm fw-semibold">
                      <i className="bi bi-box-arrow-in-right me-1"></i> Already registered? Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo Pre-fill Toolbar */}
            <div className="card border-0 shadow-sm mb-4 bg-white">
              <div className="card-body p-3">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <div className="small fw-semibold text-muted d-flex align-items-center gap-2">
                    <i className="bi bi-magic text-warning fs-5"></i>
                    <span>Quick-fill sample data for evaluation:</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('retailer')}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <i className="bi bi-shop me-1 text-warning"></i> Retail Merchant
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('jeweller')}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <i className="bi bi-gem me-1 text-warning"></i> Jeweller Bullion
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('citizen')}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <i className="bi bi-person me-1 text-info"></i> Citizen Consumer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form Card */}
            <div className="card border-0 shadow-sm bg-white">
              <div className="card-body p-4 p-md-5">
                {errorMsg && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0 fs-5"></i>
                    <div className="small fw-semibold">{errorMsg}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Account Type Selector */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2">
                      Select Registration Category <span className="text-danger">*</span>
                    </label>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className={`card p-3 h-100 border cursor-pointer ${formData.role === 'business' ? 'border-primary bg-primary-subtle' : 'border-light-subtle'}`} style={{ cursor: 'pointer' }}>
                          <div className="d-flex align-items-start gap-3">
                            <input
                              type="radio"
                              name="role"
                              value="business"
                              checked={formData.role === 'business'}
                              onChange={handleChange}
                              className="form-check-input mt-1"
                            />
                            <div>
                              <div className="fw-bold text-dark">Commercial Trader / Scale User</div>
                              <div className="small text-muted">
                                Weighing instrument owners, retailers, logistics, jewellery merchants & industry users.
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className={`card p-3 h-100 border cursor-pointer ${formData.role === 'public' ? 'border-primary bg-primary-subtle' : 'border-light-subtle'}`} style={{ cursor: 'pointer' }}>
                          <div className="d-flex align-items-start gap-3">
                            <input
                              type="radio"
                              name="role"
                              value="public"
                              checked={formData.role === 'public'}
                              onChange={handleChange}
                              className="form-check-input mt-1"
                            />
                            <div>
                              <div className="fw-bold text-dark">Citizen / Consumer</div>
                              <div className="small text-muted">
                                General public verification access, grievance reporting & consumer rights portal.
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4 text-muted opacity-25" />

                  {/* Basic Personal & Business Information */}
                  <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-person-lines-fill text-primary"></i>
                    <span>Primary Contact & Establishment</span>
                  </h5>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Full Name / Authorized Signatory <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Rajesh Agrawal"
                          className="form-control border-start-0"
                          required
                        />
                      </div>
                    </div>

                    {formData.role === 'business' ? (
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold text-secondary small">
                          Business / Establishment Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-building text-muted"></i>
                          </span>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Apex Weighing & Logistics Ltd"
                            className="form-control border-start-0"
                            required={formData.role === 'business'}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold text-secondary small">
                          Occupation / Citizen ID
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-card-text text-muted"></i>
                          </span>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Citizen Consumer / Individual"
                            className="form-control border-start-0"
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="compliance@enterprise.com"
                          className="form-control border-start-0"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Mobile Number (for SMS Alerts & OTP) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="98XXXXXXXX"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {formData.role === 'business' && (
                    <>
                      <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-text text-primary"></i>
                        <span>Statutory & Trade Details</span>
                      </h5>

                      <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold text-secondary small">
                            Business / Metrology Category
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="Commercial Weighing & Logistics">Commercial Weighing & Logistics</option>
                            <option value="Jewellery & Precious Metals">Jewellery & Precious Metals (Class II)</option>
                            <option value="Bulk Agriculture & Grain Terminals">Bulk Agriculture & Grain Terminals</option>
                            <option value="Retail Grocery & Provision Store">Retail Grocery & Provision Store</option>
                            <option value="Petroleum Dispensing Pump">Petroleum Dispensing Pump</option>
                            <option value="Pharmaceutical & Clinical Scales">Pharmaceutical & Clinical Scales</option>
                          </select>
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold text-secondary small">
                            GSTIN / Trade License Number
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-upc-scan text-muted"></i>
                            </span>
                            <input
                              type="text"
                              name="gstin"
                              value={formData.gstin}
                              onChange={handleChange}
                              placeholder="07AAAAA0000A1Z5"
                              className="form-control border-start-0 text-uppercase"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Location Details */}
                  <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-geo-alt text-primary"></i>
                    <span>Jurisdiction & Address</span>
                  </h5>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-secondary small">
                        State / UT <span className="text-danger">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Rajasthan">Rajasthan</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-secondary small">
                        District / Jurisdiction <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="e.g. South Delhi"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold text-secondary small">
                        Premise / Business Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Plot No., Street, Sector"
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Security & Password */}
                  <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-shield-lock text-primary"></i>
                    <span>Account Security</span>
                  </h5>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Create Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-key text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="At least 4 characters"
                          className="form-control border-start-0 border-end-0"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-secondary small">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-shield-check text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter password"
                          className="form-control border-start-0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Captcha Box */}
                  <div className="bg-light p-3 rounded-3 border mb-4">
                    <div className="row align-items-center g-3">
                      <div className="col-auto">
                        <label className="form-label fw-semibold small text-secondary mb-0">
                          Security Captcha:
                        </label>
                      </div>
                      <div className="col-auto">
                        <div
                          className="px-3 py-1 rounded border border-dark bg-white fw-bold fs-5 text-dark font-monospace user-select-none shadow-sm"
                          style={{ letterSpacing: '4px', textDecoration: 'line-through' }}
                        >
                          {captchaCode}
                        </div>
                      </div>
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleRefreshCaptcha}
                          title="Generate new Captcha"
                        >
                          <i className="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                      </div>
                      <div className="col-12 col-sm-4">
                        <input
                          type="text"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                          placeholder="Enter Captcha text"
                          className="form-control form-control-sm font-monospace text-uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms & Legal Declaration Checkbox */}
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="termsCheck"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <label className="form-check-label small text-secondary" htmlFor="termsCheck">
                      I solemnly declare that the information furnished above is accurate. I agree to abide by the provisions of the <strong>Legal Metrology Act, 2009</strong> and the <strong>Legal Metrology (General) Rules, 2011</strong> for commercial weights and measuring instruments.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg fw-bold shadow-sm py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering Stakeholder Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2-circle me-2"></i>
                          Complete Stakeholder Registration
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center mt-4 pt-2">
                    <span className="text-muted small">Already registered on the e-MĀPAN portal? </span>
                    <Link to="/login" className="text-decoration-none fw-bold small text-primary">
                      Sign In to your Dashboard
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Official Support & Security Footer Note */}
            <div className="text-center text-muted small mt-4">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <i className="bi bi-shield-check text-success"></i>
                <span>256-Bit SSL Encrypted National Metrology Data Network</span>
              </div>
              <div>
                Toll Free Metrology Citizen Helpline: <strong>1800-11-4000</strong> / <strong>1915</strong> (National Consumer Helpline)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

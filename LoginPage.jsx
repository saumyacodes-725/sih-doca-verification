import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, loginWithCredentials, switchRole, currentRole, showToast } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: 'signin' or 'demo'
  const initialMode = searchParams.get('mode') === 'demo' ? 'demo' : 'signin';
  const [activeMode, setActiveMode] = useState(initialMode);

  // Category presets for Traders, Testing Labs, and Citizens (Enforcement & Admin are strictly separated)
  const CATEGORY_CONFIG = {
    business: {
      role: 'business',
      label: 'Trader / Commercial Business',
      icon: 'bi-shop',
      color: 'warning',
      defaultIdentifier: 'trader.apex',
      defaultPassword: 'TraderApex@123',
      identifierLabel: 'Trader ID / Registered Email / Mobile / Username:',
      placeholder: 'e.g. trader.apex or compliance@apexlogistics.mock',
      badge: 'Commercial Trader',
      description: 'Weighbridge & scale owners, dealers, jewelers, manufacturers, and packagers.'
    },
    gatc: {
      role: 'gatc',
      label: 'GATC Standards Lab',
      icon: 'bi-cpu-fill',
      color: 'success',
      defaultIdentifier: 'gatc.north',
      defaultPassword: 'GatcLab@2891',
      identifierLabel: 'Laboratory Metrologist ID / Official Email:',
      placeholder: 'e.g. gatc.north or vk.ramanathan.gatc@nabl-delhi.org.mock',
      badge: 'Testing Lab',
      description: 'Govt Approved Test Centres & NABL calibration laboratories.'
    },
    public: {
      role: 'public',
      label: 'Citizen / Consumer',
      icon: 'bi-person-circle',
      color: 'info',
      defaultIdentifier: 'citizen.user',
      defaultPassword: 'Citizen@2026',
      identifierLabel: 'Citizen Mobile Number / Email ID:',
      placeholder: 'e.g. citizen.user or citizen@consumerforum.in',
      badge: 'Public Consumer',
      description: 'General public verification, consumer grievance, and compliance checks.'
    }
  };

  // Sign in form state - synchronized with active role
  // Priority: ?category= URL param → currentRole from auth → default 'business'
  const urlCategory = searchParams.get('category');
  const resolvedInitialCat = CATEGORY_CONFIG[urlCategory] ? urlCategory
    : (currentRole === 'gatc' || currentRole === 'public') ? currentRole
    : 'business';

  const [selectedCategory, setSelectedCategory] = useState(resolvedInitialCat);
  const [signInData, setSignInData] = useState({
    identifier: CATEGORY_CONFIG[resolvedInitialCat]?.defaultIdentifier || 'trader.apex',
    password: CATEGORY_CONFIG[resolvedInitialCat]?.defaultPassword || 'TraderApex@123',
    role: resolvedInitialCat
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterRole, setFilterRole] = useState('all');


  // Security Captcha Generator
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
    const newCode = generateCaptcha();
    setCaptchaCode(newCode);
    setCaptchaInput('');
  };

  // Keep selectedCategory in sync if header role changes
  React.useEffect(() => {
    if (currentRole === 'business' || currentRole === 'gatc' || currentRole === 'public') {
      const config = CATEGORY_CONFIG[currentRole];
      if (config && selectedCategory !== currentRole) {
        setSelectedCategory(currentRole);
        setSignInData({
          role: currentRole,
          identifier: config.defaultIdentifier,
          password: config.defaultPassword
        });
      }
    }
  }, [currentRole]);

  // Switch category: Immediately updates credentials, placeholders and hints, and syncs header role
  const handleCategoryChange = (categoryKey) => {
    const config = CATEGORY_CONFIG[categoryKey];
    if (!config) return;

    setSelectedCategory(categoryKey);
    switchRole(categoryKey);
    setSignInData({
      role: categoryKey,
      identifier: config.defaultIdentifier,
      password: config.defaultPassword
    });
    setCaptchaInput(captchaCode);
    setErrorMsg('');
    showToast(`Switched category to: ${config.label}`, 'info');
  };

  // Demo Accounts strictly for Traders, Labs, and Citizens (Officers and Admins excluded)
  const traderAndCitizenAccounts = [
    {
      id: 'USR-BIZ-01',
      label: 'Apex Logistics (Trader)',
      role: 'business',
      name: 'Rajesh Agrawal',
      category: 'Commercial Weighing & Logistics',
      username: 'trader.apex',
      email: 'compliance@apexlogistics.mock',
      password: 'TraderApex@123',
      icon: 'bi-shop',
      color: 'warning'
    },
    {
      id: 'USR-BIZ-02',
      label: 'Kalyan Jewellers (Trader)',
      role: 'business',
      name: 'Priya Sundaram',
      category: 'Jewellery & High-Precision Scales',
      username: 'trader.kalyan',
      email: 'standards@kalyanjewels.mock',
      password: 'KalyanGold@456',
      icon: 'bi-gem',
      color: 'warning'
    },
    {
      id: 'USR-BIZ-03',
      label: 'Bharat Agro Terminals (Trader)',
      role: 'business',
      name: 'Suresh Patil',
      category: 'Bulk Agriculture & Grain Silos',
      username: 'trader.bharat',
      email: 'ops@bharatagro.mock',
      password: 'AgroGrain@789',
      icon: 'bi-truck',
      color: 'warning'
    },
    {
      id: 'GATC-01',
      label: 'GATC Testing Lab',
      role: 'gatc',
      name: 'Dr. V. K. Ramanathan',
      category: 'Govt Approved Test Centre (GATC-DL-001)',
      username: 'gatc.north',
      email: 'vk.ramanathan.gatc@nabl-delhi.org.mock',
      password: 'GatcLab@2891',
      icon: 'bi-cpu-fill',
      color: 'success'
    },
    {
      id: 'USR-PUBLIC',
      label: 'Citizen User',
      role: 'public',
      name: 'Amit Kumar',
      category: 'Citizen & Consumer Verification',
      username: 'citizen.user',
      email: 'citizen@consumerforum.in',
      password: 'Citizen@2026',
      icon: 'bi-person-circle',
      color: 'info'
    }
  ];

  const handleFillDemo = (acc) => {
    setSelectedCategory(acc.role);
    switchRole(acc.role);
    setSignInData({ identifier: acc.username, password: acc.password, role: acc.role });
    setCaptchaInput(captchaCode);
    setErrorMsg('');
    showToast(`Filled credentials for ${acc.name} (${acc.username})`, 'info');
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (captchaInput && captchaInput.trim().toUpperCase() !== captchaCode) {
      setErrorMsg('Security Captcha code does not match. Please enter the characters shown or click Auto-Fill.');
      setCaptchaCode(generateCaptcha());
      return;
    }

    setIsSubmitting(true);
    try {
      const res = loginWithCredentials(signInData);
      if (!res.success) {
        setErrorMsg(res.error);
        setIsSubmitting(false);
        return;
      }

      if (res.role === 'business') navigate('/business');
      else if (res.role === 'gatc') navigate('/gatc');
      else navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (roleKey) => {
    login(roleKey);
    if (roleKey === 'business') navigate('/business');
    else if (roleKey === 'gatc') navigate('/gatc');
    else navigate('/');
  };

  const filteredDemoAccounts =
    filterRole === 'all'
      ? traderAndCitizenAccounts
      : traderAndCitizenAccounts.filter((acc) => acc.role === filterRole);

  const currentCategoryConfig = CATEGORY_CONFIG[selectedCategory] || CATEGORY_CONFIG.business;

  return (
    <div className="login-page-wrapper py-4 py-md-5 px-3 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '940px' }}>

        {/* Dedicated Officer / Admin Redirection Notice Banner */}
        <div className="card border-0 shadow-sm mb-4 overflow-hidden" style={{ borderLeft: '5px solid #dc3545' }}>
          <div className="card-body p-3 p-md-4 bg-white d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-start gap-3">
              <div className="bg-danger text-white rounded-circle p-2.5 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0" style={{ width: 44, height: 44 }}>
                <i className="bi bi-shield-lock-fill fs-5"></i>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-danger text-white fw-bold">RESTRICTED PORTAL</span>
                  <span className="badge bg-danger-subtle text-danger fw-semibold">Legal Metrology Officers & Directorate Admins</span>
                </div>
                <div className="text-dark fw-bold small">
                  Looking for Officer Stamping Workbench or National Admin Handover Console?
                </div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  LMO Field Officers and National Controllers use a dedicated portal with biometric / digital token authentication and supervisory takeover.
                </div>
              </div>
            </div>
            <Link
              to="/officer-login"
              className="btn btn-danger btn-sm fw-bold px-3 py-2 shadow-sm text-nowrap d-flex align-items-center justify-content-center gap-1.5"
            >
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Officer & Admin Login Portal &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Header Branding */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis border border-warning rounded-circle p-3 mb-2 shadow-sm"
            style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}
          >
            ⚖️
          </div>
          <div className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.72rem', letterSpacing: '1px' }}>
            Government of India | Department of Consumer Affairs
          </div>
          <h2 className="fw-bold text-navy-dark mb-1">
            Commercial Trader & Stakeholder Portal
          </h2>
          <p className="text-muted small mx-auto mb-3" style={{ maxWidth: '620px' }}>
            Single-sign-on verification access for Commercial Traders, Weighbridge Establishments, GATC Calibration Labs, and Citizens under the Legal Metrology Act, 2009.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="d-inline-flex bg-white p-1 rounded-pill shadow-sm border">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-4 fw-bold ${
                activeMode === 'signin' ? 'btn-primary text-white shadow-sm' : 'btn-link text-muted text-decoration-none'
              }`}
              onClick={() => { setActiveMode('signin'); setErrorMsg(''); }}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
            </button>
            <Link
              to="/signup"
              className="btn btn-sm rounded-pill px-4 fw-bold btn-link text-muted text-decoration-none"
            >
              <i className="bi bi-person-plus-fill me-1"></i> New Trader Registration
            </Link>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-4 fw-bold ${
                activeMode === 'demo' ? 'btn-warning text-dark shadow-sm' : 'btn-link text-muted text-decoration-none'
              }`}
              onClick={() => { setActiveMode('demo'); setErrorMsg(''); }}
            >
              <i className="bi bi-lightning-charge-fill me-1"></i> Quick Demo SSO
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 shadow-sm border-danger">
            <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
            <div className="flex-grow-1 small fw-semibold">{errorMsg}</div>
            <button type="button" className="btn-close" onClick={() => setErrorMsg('')} aria-label="Close"></button>
          </div>
        )}

        {/* ===== STANDARD SIGN IN MODE ===== */}
        {activeMode === 'signin' && (
          <div>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-navy text-white py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-shield-lock-fill text-warning me-2"></i>
                    Sign In to Commercial & Public Portal
                  </h5>
                  <small className="text-light-50">
                    Traders, Calibration Labs, and Consumers
                  </small>
                </div>
                <span className="badge bg-warning text-dark fw-semibold">
                  <i className="bi bi-check-circle-fill me-1"></i> Legal Metrology 2009
                </span>
              </div>

              <div className="card-body p-4 p-md-5">

                {/* 1-Click Fast Switcher Bar for Reviewers & Evaluators */}
                <div className="bg-light p-3 rounded-3 mb-4 border">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <span className="small fw-bold text-navy-dark">
                      <i className="bi bi-magic text-primary me-1"></i> Quick Test Auto-Fill:
                    </span>
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className={`btn btn-sm ${filterRole === 'all' ? 'btn-navy text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setFilterRole('all')}
                      >
                        All (5)
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${filterRole === 'business' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setFilterRole('business')}
                      >
                        Traders (3)
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${filterRole === 'gatc' ? 'btn-success text-white fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setFilterRole('gatc')}
                      >
                        Lab (1)
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${filterRole === 'public' ? 'btn-info text-dark fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => setFilterRole('public')}
                      >
                        Citizen (1)
                      </button>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {filteredDemoAccounts.map((acc) => {
                      const isSelected =
                        signInData.identifier === acc.username || signInData.identifier === acc.email;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => handleFillDemo(acc)}
                          className={`btn btn-sm d-flex align-items-center gap-2 py-1 px-2.5 ${
                            isSelected
                              ? `btn-${acc.color === 'warning' ? 'warning text-dark' : acc.color} fw-bold shadow-sm ring-2`
                              : 'btn-white border text-dark'
                          }`}
                          title={`Click to fill: ${acc.username} / ${acc.password}`}
                        >
                          <i className={`bi ${acc.icon}`}></i>
                          <span>{acc.label}</span>
                          <span className="badge bg-dark-subtle text-dark border" style={{ fontSize: '0.65rem' }}>
                            {acc.username}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSignInSubmit}>

                  {/* Role Selector Tabs (Only Trader, Lab, and Citizen — Officers and Admin are separated) */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-bold small text-navy-dark mb-0">
                        Select Access Category:
                      </label>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        Active: <strong className="text-primary">{currentCategoryConfig.label}</strong>
                      </span>
                    </div>

                    <div className="row g-2">
                      {Object.keys(CATEGORY_CONFIG).map((catKey) => {
                        const item = CATEGORY_CONFIG[catKey];
                        const isSelected = selectedCategory === catKey;
                        return (
                          <div key={catKey} className="col-12 col-md-4">
                            <button
                              type="button"
                              onClick={() => handleCategoryChange(catKey)}
                              className={`btn w-100 d-flex flex-column align-items-center justify-content-center py-2.5 border transition-all ${
                                isSelected
                                  ? 'btn-primary text-white fw-bold shadow-sm'
                                  : 'btn-light text-dark hover-shadow'
                              }`}
                              style={{ cursor: 'pointer', fontSize: '0.82rem' }}
                            >
                              <i className={`bi ${item.icon} fs-4 mb-1`}></i>
                              <span className="fw-semibold">{item.label}</span>
                              <span
                                className={`badge mt-1 ${
                                  isSelected ? 'bg-white text-primary' : 'bg-secondary-subtle text-dark'
                                }`}
                                style={{ fontSize: '0.68rem' }}
                              >
                                {item.defaultIdentifier}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Identifier Input - Dynamically labeled per category */}
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-navy-dark">
                      {currentCategoryConfig.identifierLabel}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className={`bi ${currentCategoryConfig.icon} text-primary`}></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={currentCategoryConfig.placeholder}
                        value={signInData.identifier}
                        onChange={(e) => setSignInData((p) => ({ ...p, identifier: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-bold small text-navy-dark mb-0">
                        Account Password:
                      </label>
                      {(() => {
                        const matchedAcc = traderAndCitizenAccounts.find(
                          (a) =>
                            a.username.toLowerCase() === signInData.identifier.trim().toLowerCase() ||
                            a.email.toLowerCase() === signInData.identifier.trim().toLowerCase() ||
                            a.id.toLowerCase() === signInData.identifier.trim().toLowerCase()
                        );
                        const displayPass = matchedAcc ? matchedAcc.password : currentCategoryConfig.defaultPassword;
                        return (
                          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                            Default password for {signInData.identifier}:{' '}
                            <code className="bg-light px-1.5 py-0.5 rounded text-dark fw-bold border">
                              {displayPass}
                            </code>
                          </span>
                        );
                      })()}
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-key-fill text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        placeholder="Enter password"
                        value={signInData.password}
                        onChange={(e) => setSignInData((p) => ({ ...p, password: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Captcha Security Check */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-bold small text-navy-dark mb-0">
                        Security Code (Captcha):
                      </label>
                      <button
                        type="button"
                        onClick={() => setCaptchaInput(captchaCode)}
                        className="btn btn-link btn-sm p-0 text-decoration-none small text-primary fw-semibold"
                      >
                        Auto-Fill Captcha
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="user-select-none d-flex align-items-center justify-content-center px-3 py-1.5 rounded border text-warning font-monospace fw-bold fs-5 shadow-sm"
                        style={{
                          letterSpacing: '4px',
                          textDecoration: 'line-through',
                          fontStyle: 'italic',
                          background: 'linear-gradient(135deg, #07192f 0%, #1e293b 100%)',
                          minWidth: '130px'
                        }}
                        title="Captcha Code"
                      >
                        {captchaCode}
                      </div>
                      <button
                        type="button"
                        onClick={handleRefreshCaptcha}
                        className="btn btn-outline-secondary"
                        title="Reload Captcha"
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                      <input
                        type="text"
                        maxLength="5"
                        className="form-control text-uppercase font-monospace fw-bold"
                        placeholder="Enter 5-digit code"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                      />
                      <button
                        type="button"
                        onClick={() => setCaptchaInput(captchaCode)}
                        className="btn btn-sm btn-outline-info text-nowrap d-none d-sm-inline"
                        title="Auto-fill Captcha for quick testing"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberSession" defaultChecked />
                      <label className="form-check-label small text-muted" htmlFor="rememberSession">
                        Remember session on this computer
                      </label>
                    </div>
                    <Link to="/verify" className="small text-decoration-none text-muted">
                      Need public verification?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary fw-bold py-2.5 w-100 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Authenticating Credentials...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right fs-5"></i>
                        <span>Sign In as {currentCategoryConfig.label.split('/')[0]} &rarr;</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="card-footer bg-light py-3 text-center border-top">
                <span className="text-muted small">New commercial establishment or trader applicant? </span>
                <Link to="/signup" className="btn btn-link btn-sm fw-bold text-decoration-none p-0">
                  Register for New Trader Account &rarr;
                </Link>
              </div>
            </div>

            {/* Official User Credentials Directory Table - Only Traders, Labs, Citizens */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-person-lines-fill text-primary fs-5"></i>
                  <h6 className="mb-0 fw-bold text-navy-dark">
                    Commercial & Public Directory (Traders, Labs & Citizens)
                  </h6>
                </div>
                <span className="badge bg-light text-muted border">5 Public Accounts</span>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
                  <thead className="table-light text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>
                    <tr>
                      <th className="ps-4">Stakeholder & Designation</th>
                      <th>Category</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th className="text-end pe-4">1-Click Auto-Fill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traderAndCitizenAccounts.map((acc) => (
                      <tr
                        key={acc.id}
                        className={signInData.identifier === acc.username ? 'table-warning' : ''}
                      >
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className={`rounded-circle bg-${acc.color}-subtle text-${acc.color} p-2 d-flex align-items-center justify-content-center`}
                              style={{ width: '32px', height: '32px' }}
                            >
                              <i className={`bi ${acc.icon}`}></i>
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{acc.name}</div>
                              <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                                {acc.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${acc.color}-subtle text-${acc.color} border border-${acc.color}-subtle`}
                          >
                            {acc.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <code className="text-navy fw-semibold">{acc.username}</code>
                          <div className="text-muted small" style={{ fontSize: '0.7rem' }}>
                            {acc.email}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-dark border font-monospace py-1 px-2">
                            {acc.password}
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              signInData.identifier === acc.username ? 'btn-success' : 'btn-outline-primary'
                            }`}
                            onClick={() => handleFillDemo(acc)}
                          >
                            {signInData.identifier === acc.username ? (
                              <>
                                <i className="bi bi-check2 me-1"></i>Filled
                              </>
                            ) : (
                              <>
                                <i className="bi bi-box-arrow-in-right me-1"></i>Fill & Test
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== QUICK DEMO SSO MODE ===== */}
        {activeMode === 'demo' && (
          <div>
            <div className="alert alert-warning border-warning d-flex align-items-center justify-content-between mb-4 shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-lightning-charge-fill text-warning-emphasis fs-3"></i>
                <div>
                  <strong className="text-dark">Evaluator Instant SSO (Traders & Citizens):</strong>
                  <div className="small text-muted">
                    Click any role below to test the corresponding commercial dashboard instantly without password input.
                  </div>
                </div>
              </div>
              <span className="badge bg-warning text-dark py-1.5 px-3">Instant SSO</span>
            </div>

            <div className="row g-3">
              {[
                {
                  key: 'business',
                  title: 'Business Owner / Trader',
                  subtitle: 'Apex Weighing & Logistics Ltd (TRD-2026-991)',
                  desc: 'Register commercial instruments, apply for periodic stamping & verification, view active certificates.',
                  icon: 'bi-shop',
                  color: 'warning',
                  badge: 'Trader Portal'
                },
                {
                  key: 'gatc',
                  title: 'GATC Laboratory Metrologist',
                  subtitle: 'Dr. V. K. Ramanathan (GATC-DL-001)',
                  desc: 'High-precision Class I & II lab calibration, environmental chamber logs, test certificates.',
                  icon: 'bi-cpu-fill',
                  color: 'success',
                  badge: 'Test Centre'
                },
                {
                  key: 'public',
                  title: 'Citizen / Consumer',
                  subtitle: 'Public Verification Access',
                  desc: 'Verify scale certificates by ID or QR scan, check compliance, report unverified instruments.',
                  icon: 'bi-person-circle',
                  color: 'info',
                  badge: 'Public Access'
                }
              ].map((item) => {
                const isCurrent = currentRole === item.key;
                return (
                  <div key={item.key} className="col-lg-4 col-12">
                    <div
                      className={`card border-0 shadow-sm h-100 p-3 transition-all hover-shadow ${
                        isCurrent ? 'border border-primary ring-2' : 'bg-white'
                      }`}
                      onClick={() => handleQuickDemo(item.key)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card-body d-flex flex-column gap-2 p-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div
                            className={`bg-${item.color}-subtle text-${item.color} rounded-circle p-2.5 d-flex align-items-center justify-content-center border border-${item.color}-subtle`}
                            style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}
                          >
                            <i className={`bi ${item.icon}`}></i>
                          </div>
                          <span
                            className={`badge bg-${item.color}-subtle text-${item.color} border border-${item.color}-subtle`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <h6 className="fw-bold text-navy-dark mb-0">{item.title}</h6>
                        <div className="small text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>{item.subtitle}</div>
                        <p className="small text-muted flex-grow-1 mb-2" style={{ fontSize: '0.8rem' }}>{item.desc}</p>
                        <button
                          type="button"
                          className={`btn btn-sm btn-${
                            item.color === 'warning' ? 'warning text-dark' : item.color
                          } fw-bold w-100 shadow-sm`}
                        >
                          Enter Portal &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Officer / Admin Separate Portal Callout in Demo Mode */}
            <div className="card border-0 shadow-sm mt-4 p-3 bg-white" style={{ borderLeft: '4px solid #dc3545' }}>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-danger-subtle text-danger rounded-circle p-2.5 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                    <i className="bi bi-shield-lock-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">Legal Metrology Officers & National Admin</h6>
                    <small className="text-muted">Field inspector workbench, multi-point tests, and admin duty handover console are in the dedicated Official Portal.</small>
                  </div>
                </div>
                <Link to="/officer-login" className="btn btn-danger btn-sm fw-bold text-nowrap">
                  Open Official Officer Portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-4 small text-muted">
          <i className="bi bi-shield-check me-1 text-success"></i>
          Department of Consumer Affairs | Ministry of Consumer Affairs, Food & Public Distribution | Govt. of India
        </div>
      </div>
    </div>
  );
}

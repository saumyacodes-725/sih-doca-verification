import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStakeholders } from '../../services/storageService';

export default function OfficialLoginPage() {
  const { loginWithCredentials, handoverTo, showToast, ROLE_PROFILES } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active Tab: 'lmo' or 'admin'
  const paramRole = searchParams.get('category') || searchParams.get('role');
  const initialTab = paramRole === 'admin' ? 'admin' : 'lmo';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Form State
  const [officerCode, setOfficerCode] = useState('lmo.delhi');
  const [password, setPassword] = useState('LmoDelhi@1092');
  const [adminPin, setAdminPin] = useState('AdminDoca@2026');
  const [adminId, setAdminId] = useState('admin.doca');
  const [zone, setZone] = useState('North Zone - Delhi NCR');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security Captcha
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

  // Pre-configured official stakeholders for quick selection
  const stakeholders = getStakeholders();
  const officialLMOs = stakeholders.filter((s) => s.role === 'lmo');
  const commercialTraders = stakeholders.filter((s) => s.role === 'business');

  const lmoPresets = [
    {
      id: 'LMO-01',
      name: 'Insp. Rajesh Sharma',
      badge: 'DOCA-LM-1092',
      username: 'lmo.delhi',
      password: 'LmoDelhi@1092',
      zone: 'North Zone - Delhi NCR',
      district: 'South Delhi',
      inspections: 4,
      kit: 'STAMP-KIT-DL-44'
    },
    {
      id: 'LMO-02',
      name: 'Insp. Ananya Deshmukh',
      badge: 'DOCA-LM-2041',
      username: 'lmo.mumbai',
      password: 'LmoMumbai@2041',
      zone: 'West Zone - Maharashtra',
      district: 'Thane',
      inspections: 3,
      kit: 'STAMP-KIT-MH-12'
    },
    {
      id: 'LMO-03',
      name: 'Insp. K. Venkatesh',
      badge: 'DOCA-LM-3015',
      username: 'lmo.chennai',
      password: 'LmoChennai@3015',
      zone: 'South Zone - Tamil Nadu',
      district: 'Chennai',
      inspections: 2,
      kit: 'STAMP-KIT-TN-08'
    }
  ];

  const handleSelectLmoPreset = (p) => {
    setOfficerCode(p.username);
    setPassword(p.password);
    setZone(p.zone);
    setCaptchaInput(captchaCode);
    setErrorMsg('');
    showToast(`Filled credentials for ${p.name} (${p.badge})`, 'info');
  };

  const handleSelectAdminPreset = () => {
    setAdminId('admin.doca');
    setAdminPin('AdminDoca@2026');
    setCaptchaInput(captchaCode);
    setErrorMsg('');
    showToast('Filled credentials for National Controller Dr. Anand Swaroop, IAS', 'info');
  };

  // Submit LMO Login
  const handleLmoLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (captchaInput && captchaInput.trim().toUpperCase() !== captchaCode) {
      setErrorMsg('Security Captcha does not match. Please enter the characters shown.');
      setCaptchaCode(generateCaptcha());
      return;
    }

    setIsSubmitting(true);
    try {
      const res = loginWithCredentials({ identifier: officerCode, password, role: 'lmo' });
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed for officer credentials.');
        setIsSubmitting(false);
        return;
      }
      navigate('/lmo');
    } catch (err) {
      setErrorMsg(err.message || 'Login error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (captchaInput && captchaInput.trim().toUpperCase() !== captchaCode) {
      setErrorMsg('Security Captcha does not match. Please enter the characters shown.');
      setCaptchaCode(generateCaptcha());
      return;
    }

    setIsSubmitting(true);
    try {
      const res = loginWithCredentials({ identifier: adminId, password: adminPin, role: 'admin' });
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed for Controller credentials.');
        setIsSubmitting(false);
        return;
      }
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Login error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Direct Supervisory Handover / Takeover Action
  const handleAdminDirectTakeover = (targetUser, destinationPath) => {
    handoverTo(targetUser, ROLE_PROFILES.admin);
    navigate(destinationPath);
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
              <Link to="/login" className="text-decoration-none">Public Login</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Official Enforcement Portal
            </li>
          </ol>
        </nav>

        {/* National Emblem & Department Banner */}
        <div className="card border-0 shadow-sm mb-4 bg-dark text-white overflow-hidden">
          <div
            className="p-4 p-md-5"
            style={{
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 60%, #415a77 100%)',
              borderLeft: '6px solid #e63946'
            }}
          >
            <div className="row align-items-center g-3">
              <div className="col-12 col-md-8">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="bg-danger text-white rounded-circle p-2 d-flex align-items-center justify-content-center shadow" style={{ width: 48, height: 48 }}>
                    <i className="bi bi-shield-lock-fill fs-4"></i>
                  </div>
                  <div>
                    <span className="badge bg-warning text-dark fw-bold px-2 py-1">
                      RESTRICTED GOVERNMENT PORTAL
                    </span>
                    <span className="badge bg-danger ms-2 fw-semibold">
                      Official Use Only
                    </span>
                  </div>
                </div>
                <h3 className="fw-bold text-white mb-1">
                  Enforcement & Directorate Command Portal
                </h3>
                <p className="text-white-50 mb-0 small">
                  Directorate of Legal Metrology • Department of Consumer Affairs, Govt. of India
                </p>
                <div className="text-warning-emphasis small mt-1">
                  <i className="bi bi-info-circle me-1"></i>
                  Authorized for Legal Metrology Officers (LMO) and National Directorate Controllers (Admin).
                </div>
              </div>

              <div className="col-12 col-md-4 text-md-end">
                <Link to="/login" className="btn btn-outline-light btn-sm fw-semibold">
                  <i className="bi bi-arrow-left me-1"></i> Public & Trader Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Main Official Login Form */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm bg-white h-100">
              <div className="card-header bg-white border-bottom p-0">
                {/* Role Switcher Tabs */}
                <div className="nav nav-tabs nav-fill border-0" role="tablist">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('lmo'); setCaptchaInput(captchaCode); setErrorMsg(''); }}
                    className={`nav-link py-3 fw-bold border-0 border-bottom border-3 d-flex align-items-center justify-content-center gap-2 ${
                      activeTab === 'lmo'
                        ? 'border-primary text-primary bg-primary-subtle'
                        : 'text-muted border-transparent'
                    }`}
                  >
                    <i className="bi bi-patch-check-fill fs-5"></i>
                    <span>Legal Metrology Officer (LMO)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('admin'); setCaptchaInput(captchaCode); setErrorMsg(''); }}
                    className={`nav-link py-3 fw-bold border-0 border-bottom border-3 d-flex align-items-center justify-content-center gap-2 ${
                      activeTab === 'admin'
                        ? 'border-danger text-danger bg-danger-subtle'
                        : 'text-muted border-transparent'
                    }`}
                  >
                    <i className="bi bi-shield-check fs-5"></i>
                    <span>National Controller (Admin)</span>
                  </button>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                {errorMsg && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0 fs-5"></i>
                    <div className="small fw-semibold">{errorMsg}</div>
                  </div>
                )}

                {/* Tab Content: LMO Officer Login */}
                {activeTab === 'lmo' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h5 className="fw-bold text-dark mb-0">Officer Service Authentication</h5>
                        <p className="small text-muted mb-0">Field Inspector Workbench & Digital Stamping Console</p>
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                        Zonal Wing
                      </span>
                    </div>

                    {/* Quick Officer Chips */}
                    <div className="mb-4">
                      <label className="form-label small text-muted fw-semibold mb-1">
                        Select Officer Preset (Quick Fill):
                      </label>
                      <div className="d-flex flex-wrap gap-2">
                        {lmoPresets.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectLmoPreset(p)}
                            className={`btn btn-sm ${
                              officerCode === p.username
                                ? 'btn-primary shadow-sm'
                                : 'btn-outline-secondary'
                            }`}
                          >
                            <i className="bi bi-person-badge me-1"></i>
                            {p.name.split(' ')[1]} ({p.district})
                          </button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleLmoLogin}>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-secondary">
                          Officer Badge ID / Service Username <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-person-badge text-muted"></i>
                          </span>
                          <input
                            type="text"
                            value={officerCode}
                            onChange={(e) => setOfficerCode(e.target.value)}
                            placeholder="e.g. lmo.delhi or DOCA-LM-1092"
                            className="form-control border-start-0"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-secondary">
                          Enforcement Jurisdiction Zone
                        </label>
                        <select
                          value={zone}
                          onChange={(e) => setZone(e.target.value)}
                          className="form-select"
                        >
                          <option value="North Zone - Delhi NCR">North Zone - Delhi NCR (DOCA-NZ)</option>
                          <option value="West Zone - Maharashtra">West Zone - Maharashtra (DOCA-WZ)</option>
                          <option value="South Zone - Tamil Nadu">South Zone - Tamil Nadu (DOCA-SZ)</option>
                          <option value="East Zone - West Bengal">East Zone - West Bengal (DOCA-EZ)</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label small fw-semibold text-secondary">
                          Security Password / Key <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-lock text-muted"></i>
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                      {/* Security Captcha */}
                      <div className="bg-light p-3 rounded border mb-4">
                        <div className="row align-items-center g-2">
                          <div className="col-auto">
                            <div
                              className="px-3 py-1 rounded border border-dark bg-white fw-bold fs-5 text-dark font-monospace user-select-none"
                              style={{ letterSpacing: '4px', textDecoration: 'line-through' }}
                            >
                              {captchaCode}
                            </div>
                          </div>
                          <div className="col-auto">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={handleRefreshCaptcha}
                            >
                              <i className="bi bi-arrow-clockwise"></i>
                            </button>
                          </div>
                          <div className="col">
                            <input
                              type="text"
                              value={captchaInput}
                              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                              placeholder="Enter Captcha"
                              className="form-control form-control-sm font-monospace text-uppercase"
                            />
                          </div>
                          <div className="col-auto">
                            <button
                              type="button"
                              onClick={() => setCaptchaInput(captchaCode)}
                              className="btn btn-sm btn-outline-primary fw-semibold"
                              title="Auto-fill Captcha"
                            >
                              Auto-Fill
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Authenticating LMO Officer...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Access LMO Inspection Workbench
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Tab Content: Admin / Controller Login */}
                {activeTab === 'admin' && (
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h5 className="fw-bold text-dark mb-0">National Controller Command</h5>
                        <p className="small text-muted mb-0">Supervisory Jurisdiction, Handover & National Registry</p>
                      </div>
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                        HQ Directorate
                      </span>
                    </div>

                    {/* Quick Admin Chip */}
                    <div className="mb-4">
                      <label className="form-label small text-muted fw-semibold mb-1">
                        Quick Preset:
                      </label>
                      <div>
                        <button
                          type="button"
                          onClick={handleSelectAdminPreset}
                          className="btn btn-sm btn-outline-danger fw-semibold"
                        >
                          <i className="bi bi-shield-check me-1"></i>
                          Dr. Anand Swaroop, IAS (Joint Secretary & Controller)
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleAdminLogin}>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-secondary">
                          Controller Service ID / Email <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-shield-lock text-muted"></i>
                          </span>
                          <input
                            type="text"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            placeholder="admin.doca or controller.metrology@doca.gov.in"
                            className="form-control border-start-0"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label small fw-semibold text-secondary">
                          Controller Secret Master Key <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-key text-muted"></i>
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={adminPin}
                            onChange={(e) => setAdminPin(e.target.value)}
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

                      {/* Security Captcha */}
                      <div className="bg-light p-3 rounded border mb-4">
                        <div className="row align-items-center g-2">
                          <div className="col-auto">
                            <div
                              className="px-3 py-1 rounded border border-dark bg-white fw-bold fs-5 text-dark font-monospace user-select-none"
                              style={{ letterSpacing: '4px', textDecoration: 'line-through' }}
                            >
                              {captchaCode}
                            </div>
                          </div>
                          <div className="col-auto">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={handleRefreshCaptcha}
                            >
                              <i className="bi bi-arrow-clockwise"></i>
                            </button>
                          </div>
                          <div className="col">
                            <input
                              type="text"
                              value={captchaInput}
                              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                              placeholder="Enter Captcha"
                              className="form-control form-control-sm font-monospace text-uppercase"
                            />
                          </div>
                          <div className="col-auto">
                            <button
                              type="button"
                              onClick={() => setCaptchaInput(captchaCode)}
                              className="btn btn-sm btn-outline-danger fw-semibold"
                              title="Auto-fill Captcha"
                            >
                              Auto-Fill
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-danger btn-lg fw-bold shadow-sm"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Authenticating Controller...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-shield-check me-2"></i>
                              Access National Command Console
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Admin Handover & Supervisory Control Hub */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm bg-white h-100">
              <div className="card-header bg-danger text-white p-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-left-right fs-5"></i>
                  <span className="fw-bold">Admin Handover & Supervisory Hub</span>
                </div>
                <span className="badge bg-white text-danger fw-bold">Executive Authority</span>
              </div>

              <div className="card-body p-4">
                <div className="alert alert-warning border-warning d-flex align-items-start gap-2 mb-3 py-2 px-3">
                  <i className="bi bi-shield-exclamation text-warning-emphasis fs-5 flex-shrink-0 mt-1"></i>
                  <div className="small">
                    <strong>Handover Protocol (Legal Metrology Act):</strong> National Controllers possess executive authority to supervise or take over active sessions of any LMO Officer or Commercial Trader for auditing and verification.
                  </div>
                </div>

                <h6 className="fw-bold text-navy-dark mb-2 d-flex align-items-center gap-1">
                  <i className="bi bi-patch-check-fill text-primary"></i>
                  <span>Supervise / Take Over LMO Officer</span>
                </h6>
                <p className="small text-muted mb-2">
                  Take immediate control of an officer's field inspection workbench and stamping kit:
                </p>

                <div className="list-group list-group-flush border rounded-3 mb-4">
                  {officialLMOs.map((lmo) => (
                    <div key={lmo.id} className="list-group-item d-flex justify-content-between align-items-center p-2 px-3">
                      <div>
                        <div className="fw-bold text-dark small">{lmo.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          <span className="badge bg-primary-subtle text-primary me-1">{lmo.badgeNumber || lmo.id}</span>
                          {lmo.zone || lmo.district}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAdminDirectTakeover(lmo, '/lmo')}
                        className="btn btn-sm btn-outline-primary fw-semibold"
                        title="Take over LMO inspection session under admin supervision"
                      >
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                        Supervise LMO
                      </button>
                    </div>
                  ))}
                </div>

                <h6 className="fw-bold text-navy-dark mb-2 d-flex align-items-center gap-1">
                  <i className="bi bi-shop text-warning"></i>
                  <span>Supervise / Audit Trader Account</span>
                </h6>
                <p className="small text-muted mb-2">
                  Take over a trader's portal to review scale fleet, compliance notices, and pending applications:
                </p>

                <div className="list-group list-group-flush border rounded-3 mb-4">
                  {commercialTraders.slice(0, 3).map((trd) => (
                    <div key={trd.id} className="list-group-item d-flex justify-content-between align-items-center p-2 px-3">
                      <div>
                        <div className="fw-bold text-dark small">{trd.company || trd.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                          <span className="badge bg-warning-subtle text-dark me-1">{trd.id}</span>
                          {trd.category || 'Commercial'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAdminDirectTakeover(trd, '/business')}
                        className="btn btn-sm btn-outline-warning text-dark fw-semibold"
                        title="Take over trader portal under admin supervision"
                      >
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                        Audit Trader
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-light p-3 rounded-3 text-center border">
                  <div className="small text-muted mb-2">
                    Need to reassign cases or manage cross-zone officer jurisdiction?
                  </div>
                  <button
                    onClick={() => {
                      loginWithCredentials({ identifier: 'admin.doca', password: 'AdminDoca@2026', role: 'admin' });
                      navigate('/admin/handover');
                    }}
                    className="btn btn-danger btn-sm fw-bold w-100"
                  >
                    <i className="bi bi-sliders me-1"></i>
                    Open Full Admin Handover Console
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Support & Legal Disclaimer Footer */}
        <div className="text-center text-muted small mt-4 pt-2">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
            <i className="bi bi-shield-fill-check text-success"></i>
            <span>Secured via National Metrology NIC Gateway • 256-bit AES Encryption</span>
          </div>
          <div>
            Legal Metrology Act, 2009 • Directorate of Legal Metrology, Ministry of Consumer Affairs, Food & Public Distribution, New Delhi
          </div>
        </div>
      </div>
    </div>
  );
}

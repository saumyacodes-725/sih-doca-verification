import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_HOME = { public: '/', business: '/business', lmo: '/lmo', gatc: '/gatc', admin: '/admin' };

const roleList = [
  {
    key: 'public',
    title: 'Citizen / Consumer',
    subtitle: 'Public Verification Access',
    desc: 'Verify scale certificates by ID or QR scan, check compliance, report unverified instruments.',
    icon: 'bi-person-circle',
    color: 'info',
    badge: 'Public Access'
  },
  {
    key: 'business',
    title: 'Business Owner / Trader',
    subtitle: 'business@demo.test',
    desc: 'Register commercial instruments, apply for periodic stamping & verification, view active certificates.',
    icon: 'bi-shop',
    color: 'warning',
    badge: 'Trader Portal'
  },
  {
    key: 'lmo',
    title: 'Legal Metrology Officer (LMO)',
    subtitle: 'lmo@demo.test',
    desc: 'Field verification workbench, digital checklists, multi-point weight tests, lead seal stamping.',
    icon: 'bi-patch-check-fill',
    color: 'primary',
    badge: 'Enforcement Wing'
  },
  {
    key: 'gatc',
    title: 'GATC Laboratory Metrologist',
    subtitle: 'gatc@demo.test',
    desc: 'High-precision Class I & II lab calibration, environmental chamber logs, test certificates.',
    icon: 'bi-cpu-fill',
    color: 'success',
    badge: 'Test Centre'
  },
  {
    key: 'admin',
    title: 'Legal Metrology Controller (Admin)',
    subtitle: 'admin@demo.test',
    desc: 'National allocation console, officer dispatch, certificate revocation, analytics & audit trail.',
    icon: 'bi-shield-check',
    color: 'danger',
    badge: 'National Admin'
  }
];

export default function LoginPage() {
  const { switchRole, login, register, currentRole, showToast } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'business',
    company: ''
  });

  const handleSelectDemoRole = async (roleKey) => {
    setError('');
    if (roleKey === 'public') {
      navigate('/');
      return;
    }
    setSubmitting(true);
    try {
      const profile = await switchRole(roleKey);
      navigate(ROLE_HOME[roleKey] || '/');
      return profile;
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const profile = await login(loginForm.email, loginForm.password);
      navigate(ROLE_HOME[profile.role] || '/');
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const profile = await register(registerForm);
      navigate(ROLE_HOME[profile.role] || '/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper py-5 px-3 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '950px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning-emphasis border border-warning rounded-circle p-3 mb-2" style={{ width: '60px', height: '60px', fontSize: '2rem' }}>
            ⚖️
          </div>
          <h2 className="fw-bold text-navy-dark mb-1">Trust Scale Single Sign-On (SSO) Portal</h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: '650px' }}>
            Sign in with your stakeholder account, or use a quick demo role below.
          </p>
        </div>

        {/* Login / Register Form Card */}
        <div className="card border-0 shadow-sm p-4 bg-white mb-4 mx-auto" style={{ maxWidth: '480px' }}>
          <ul className="nav nav-pills nav-fill mb-3">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Login
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setError(''); }}
              >
                Register
              </button>
            </li>
          </ul>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn btn-primary fw-bold w-100" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  minLength={6}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Account Type</label>
                <select
                  className="form-select"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm((prev) => ({ ...prev, role: e.target.value }))}
                >
                  <option value="business">Business Owner / Trader</option>
                  <option value="lmo">Legal Metrology Officer (LMO)</option>
                  <option value="gatc">GATC Laboratory Metrologist</option>
                  <option value="admin">Legal Metrology Controller (Admin)</option>
                </select>
              </div>
              {registerForm.role === 'business' && (
                <div className="mb-3">
                  <label className="form-label small fw-bold">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={registerForm.company}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              )}
              <button type="submit" className="btn btn-warning text-dark fw-bold w-100" disabled={submitting}>
                {submitting ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center small text-muted mb-3">— or use a quick demo role —</div>

        <div className="row g-3">
          {roleList.map((item) => {
            const isCurrent = currentRole === item.key;
            return (
              <div key={item.key} className="col-lg-6 col-12">
                <div
                  className={`card border-0 shadow-sm h-100 p-3 hover-shadow cursor-pointer transition-all ${
                    isCurrent ? 'ring-primary border border-primary' : 'bg-white'
                  }`}
                  onClick={() => handleSelectDemoRole(item.key)}
                >
                  <div className="card-body d-flex gap-3 align-items-start p-2">
                    <div
                      className={`bg-${item.color}-subtle text-${item.color} rounded-circle p-3 d-flex align-items-center justify-content-center border border-${item.color}-subtle flex-shrink-0`}
                      style={{ width: '56px', height: '56px', fontSize: '1.6rem' }}
                    >
                      <i className={`bi ${item.icon}`}></i>
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className={`badge bg-${item.color}-subtle text-${item.color} border border-${item.color}-subtle`}>
                          {item.badge}
                        </span>
                        {isCurrent && (
                          <span className="badge bg-primary text-white">Active Session</span>
                        )}
                      </div>
                      <h5 className="fw-bold text-navy-dark mb-1">{item.title}</h5>
                      <div className="small text-muted fw-semibold mb-2">{item.subtitle}</div>
                      <p className="small text-muted mb-3">{item.desc}</p>

                      <button
                        type="button"
                        className={`btn btn-sm btn-${item.color === 'warning' ? 'warning text-dark' : item.color} fw-bold w-100`}
                        disabled={submitting}
                      >
                        Enter as {item.title.split('/')[0]} &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4 small text-muted">
          <i className="bi bi-info-circle me-1"></i> Demo roles sign in with seeded accounts (password: Password123!) so every screen reflects real, authenticated data.
        </div>
      </div>
    </div>
  );
}

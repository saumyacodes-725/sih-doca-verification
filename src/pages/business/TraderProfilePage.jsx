import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationRead } from '../../services/storageService';

export default function TraderProfilePage() {
  const { currentUser, showToast } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    smsAlerts: true,
    emailAlerts: true,
    thirtyDayExpiry: true,
    sevenDayExpiry: true,
    immediateInspection: true
  });

  useEffect(() => {
    getNotifications(currentUser.id).then(setNotifications).catch(() => setNotifications([]));
  }, [currentUser.id]);

  const handleToggleSetting = (key) => {
    setAlertSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast('Alert preferences updated', 'info');
  };

  const handleMarkRead = async (id) => {
    await markNotificationRead(id).catch(() => {});
    getNotifications(currentUser.id).then(setNotifications).catch(() => {});
  };

  return (
    <div className="trader-profile-page py-4 px-3 bg-light min-vh-100">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="mb-4">
          <div className="small text-muted mb-1">
            <span className="text-primary">Trust Scale</span> / Business Trader / Profile & Notifications
          </div>
          <h3 className="fw-bold text-navy-dark mb-0">
            <i className="bi bi-person-badge text-warning me-2"></i> Trader Profile & Compliance Alerts
          </h3>
          <p className="text-muted small mb-0">
            Registered commercial establishment credentials and statutory notification center.
          </p>
        </div>

        <div className="row g-4">
          {/* Profile Details Card */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm bg-white p-4 h-100 rounded-3">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-building text-primary me-2"></i> Establishment Details
              </h5>

              <div className="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded border">
                <div className="bg-warning-subtle text-warning-emphasis p-3 rounded-circle fs-3">
                  <i className="bi bi-shop"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-navy-dark mb-0">{currentUser.company || 'Apex Weighing & Logistics Ltd'}</h6>
                  <span className="badge bg-primary-subtle text-primary font-monospace">
                    {currentUser.badge || 'TRD-2026-991'}
                  </span>
                </div>
              </div>

              <table className="table table-sm table-borderless small mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted" style={{ width: '40%' }}>Authorized Person:</td>
                    <td className="fw-bold text-dark">{currentUser.name}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">GSTIN / Registration:</td>
                    <td className="font-monospace fw-bold">GSTIN07AAACA1234F1Z5</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Registered Email:</td>
                    <td>{currentUser.email || 'compliance@apexlogistics.mock'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Contact Phone:</td>
                    <td>+91 98112 34567</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Principal Premise:</td>
                    <td>Plot 42, Okhla Industrial Area Phase III, South Delhi, Delhi - 110020</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Enforcement Zone:</td>
                    <td>North Zone - South Delhi Division</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Verification Status:</td>
                    <td><span className="badge bg-success-subtle text-success border">KYC VERIFIED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance Notifications & Alert Settings */}
          <div className="col-lg-6">
            {/* Notification Center */}
            <div className="card border-0 shadow-sm bg-white p-4 mb-4 rounded-3">
              <h5 className="fw-bold text-navy-dark mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center">
                <span><i className="bi bi-bell text-primary me-2"></i> Statutory Alerts</span>
                <span className="badge bg-danger rounded-pill small">{notifications.filter(n => !n.read).length} New</span>
              </h5>

              <div className="d-flex flex-column gap-2">
                {notifications.length === 0 ? (
                  <div className="text-muted small text-center py-3">No notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded border small transition-all ${
                        n.read ? 'bg-light text-muted' : 'bg-white border-warning-subtle shadow-sm'
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <strong className={`d-block ${n.read ? 'text-dark' : 'text-primary'}`}>
                          {n.title}
                        </strong>
                        <span className="text-muted" style={{ fontSize: '0.68rem' }}>{n.timestamp}</span>
                      </div>
                      <p className="mb-2 text-dark" style={{ fontSize: '0.75rem' }}>{n.message}</p>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="btn btn-sm btn-outline-secondary py-0 px-2"
                          style={{ fontSize: '0.7rem' }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Alert Preferences */}
            <div className="card border-0 shadow-sm bg-white p-4 rounded-3">
              <h6 className="fw-bold text-navy-dark mb-3 border-bottom pb-2">
                <i className="bi bi-gear-fill text-secondary me-2"></i> Expiry Alert Channels
              </h6>

              <div className="d-flex flex-column gap-2 small">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={alertSettings.smsAlerts}
                    onChange={() => handleToggleSetting('smsAlerts')}
                    id="smsSwitch"
                  />
                  <label className="form-check-label" htmlFor="smsSwitch">
                    SMS Alerts to Registered Mobile
                  </label>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={alertSettings.emailAlerts}
                    onChange={() => handleToggleSetting('emailAlerts')}
                    id="emailSwitch"
                  />
                  <label className="form-check-label" htmlFor="emailSwitch">
                    Official Email Reminders
                  </label>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={alertSettings.thirtyDayExpiry}
                    onChange={() => handleToggleSetting('thirtyDayExpiry')}
                    id="thirtyDaySwitch"
                  />
                  <label className="form-check-label" htmlFor="thirtyDaySwitch">
                    30-Day Stamping Expiry Advance Notice
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

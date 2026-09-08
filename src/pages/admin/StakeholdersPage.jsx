import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStakeholders } from '../../services/storageService';

export default function StakeholdersPage() {
  const { showToast } = useAuth();
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const stakeholders = getStakeholders();

  const filtered = stakeholders.filter((s) => {
    const matchesSearch =
      !search.trim() ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.company && s.company.toLowerCase().includes(search.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      (s.district && s.district.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-stakeholders-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / National Admin / Stakeholders
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-people-fill text-danger me-2"></i> Stakeholders & User Management
            </h3>
            <p className="text-muted small mb-0">
              Directory of Commercial Traders, Legal Metrology Officers, and GATC Testing Centres across India.
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
                  placeholder="Search by Name, Company, Email, District..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-4">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Stakeholders ({stakeholders.length})</option>
                <option value="business">Commercial Business Traders</option>
                <option value="lmo">Legal Metrology Officers (LMO)</option>
                <option value="gatc">GATC Testing Laboratories</option>
                <option value="admin">National Controllers (Admin)</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch('');
                  setRoleFilter('ALL');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Stakeholder Cards */}
        <div className="row g-3">
          {filtered.map((s) => (
            <div key={s.id} className="col-lg-4 col-md-6 col-12">
              <div className="card border-0 shadow-sm h-100 bg-white p-4 rounded-3 hover-shadow transition-all">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className={`p-2 rounded-circle ${
                        s.role === 'business'
                          ? 'bg-warning-subtle text-warning-emphasis'
                          : s.role === 'lmo'
                          ? 'bg-primary-subtle text-primary'
                          : s.role === 'gatc'
                          ? 'bg-success-subtle text-success'
                          : 'bg-danger-subtle text-danger'
                      }`}
                    >
                      <i className={`bi ${s.role === 'business' ? 'bi-shop' : s.role === 'lmo' ? 'bi-patch-check-fill' : s.role === 'gatc' ? 'bi-cpu-fill' : 'bi-shield-check'} fs-4`}></i>
                    </div>
                    <div>
                      <span className="badge bg-secondary-subtle text-dark font-monospace" style={{ fontSize: '0.68rem' }}>
                        {s.id}
                      </span>
                      <h6 className="fw-bold text-navy-dark mb-0">{s.name}</h6>
                    </div>
                  </div>
                  <span className={`badge ${s.status === 'ACTIVE' || s.status === 'ACCREDITED' ? 'bg-success' : 'bg-secondary'}`}>
                    {s.status}
                  </span>
                </div>

                <div className="small text-muted mb-3 flex-grow-1">
                  {s.company && <div className="fw-semibold text-dark mb-1"><i className="bi bi-building me-1"></i> {s.company}</div>}
                  {s.designation && <div className="text-primary fw-semibold mb-1">{s.designation}</div>}
                  {s.zone && <div><strong>Zone:</strong> {s.zone}</div>}
                  {s.gstin && <div><strong>GSTIN:</strong> <span className="font-monospace">{s.gstin}</span></div>}
                  {s.accreditationNo && <div><strong>NABL:</strong> <span className="font-monospace">{s.accreditationNo}</span></div>}
                  <div><i className="bi bi-envelope me-1"></i> {s.email}</div>
                  <div><i className="bi bi-telephone me-1"></i> {s.phone}</div>
                </div>

                <div className="border-top pt-2 d-flex justify-content-between align-items-center small">
                  <span className="text-muted">{s.state || 'Delhi'}</span>
                  <button
                    onClick={() => showToast(`User credentials verified for ${s.name}`, 'info')}
                    className="btn btn-sm btn-outline-primary py-0 px-2"
                  >
                    Verify KYC
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

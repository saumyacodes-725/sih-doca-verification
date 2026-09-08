import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInstruments } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';

export default function MyInstrumentsPage() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [allInstruments, setAllInstruments] = useState([]);

  useEffect(() => {
    getInstruments().then(setAllInstruments).catch(() => setAllInstruments([]));
  }, []);

  const myInstruments = allInstruments.filter(
    (i) => i.ownerTraderId === currentUser.id || i.ownerName.includes('Apex') || !i.ownerTraderId
  );

  const filtered = myInstruments.filter((item) => {
    const matchesSearch =
      !search.trim() ||
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      (item.stampingNumber && item.stampingNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="my-instruments-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / Business Trader Portal / Fleet Registry
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-box-seam text-warning me-2"></i> My Weighing & Measuring Instruments
            </h3>
            <p className="text-muted small mb-0">
              Manage your registered instruments, monitor stamping validity dates, and apply for verification.
            </p>
          </div>

          <Link to="/business/register" className="btn btn-warning text-dark fw-bold shadow-sm">
            <i className="bi bi-plus-circle-fill me-1"></i> Register New Instrument
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-lg-5 col-md-6">
              <label className="form-label small fw-bold text-muted mb-1">Search Fleet</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by Model, Serial No, Stamping Tag (e.g. AV-2024)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-3">
              <label className="form-label small fw-bold text-muted mb-1">Category</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="Commercial Weighing">Commercial Weighing</option>
                <option value="Industrial Weighing">Industrial Weighing</option>
                <option value="Petroleum & Liquid Volume">Petroleum & Volume</option>
                <option value="Packaging & Automated Filling">Packaging & Filling</option>
                <option value="Jewellery & Precious Metals">Jewellery & Precious Metals</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-3">
              <label className="form-label small fw-bold text-muted mb-1">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="APPLICATION_SUBMITTED">APP SUBMITTED</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="REGISTERED">REGISTERED</option>
              </select>
            </div>

            <div className="col-lg-2 col-12 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('ALL');
                  setStatusFilter('ALL');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Instruments Grid/Cards */}
        <div className="row g-3">
          {filtered.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm p-5 text-center bg-white">
                <div className="fs-1 text-muted mb-2">📦</div>
                <h5 className="fw-bold text-navy-dark">No Instruments Found</h5>
                <p className="text-muted small">No instruments matched your current search filters.</p>
                <div>
                  <Link to="/business/register" className="btn btn-sm btn-primary">
                    Register First Instrument
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            filtered.map((inst) => (
              <div key={inst.id} className="col-lg-4 col-md-6 col-12">
                <div className="card border-0 shadow-sm h-100 bg-white hover-shadow transition-all">
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-light text-primary border font-monospace">
                          {inst.id}
                        </span>
                        <StatusBadge status={inst.status} />
                      </div>

                      <h5 className="fw-bold text-navy-dark mb-1">{inst.type}</h5>
                      <div className="small text-muted mb-3">
                        {inst.manufacturer} — {inst.model}
                      </div>

                      <div className="p-3 bg-light rounded small mb-3 border">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Serial Number:</span>
                          <strong className="font-monospace text-dark">{inst.serialNumber}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Accuracy Class:</span>
                          <span className="badge bg-info-subtle text-info border">{inst.accuracyClass}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Max Capacity:</span>
                          <strong>{inst.maxCapacity} (e={inst.verificationInterval})</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Stamping Tag:</span>
                          <strong className="font-monospace text-warning-emphasis">
                            {inst.stampingNumber || 'Pending'}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between border-top pt-1 mt-1">
                          <span className="text-muted">Validity Expiry:</span>
                          <strong className={inst.status === 'VERIFIED' ? 'text-success' : 'text-danger'}>
                            {inst.expiryDate || 'N/A'}
                          </strong>
                        </div>
                      </div>

                      <div className="small text-muted mb-3">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {inst.location}
                      </div>
                    </div>

                    <div className="d-flex gap-2 border-top pt-3">
                      <Link
                        to={`/business/instruments/${inst.id}`}
                        className="btn btn-sm btn-outline-primary flex-grow-1 fw-semibold"
                      >
                        <i className="bi bi-eye me-1"></i> Full Details
                      </Link>

                      {inst.status === 'VERIFIED' && inst.activeCertificateId && (
                        <Link
                          to={`/certificate/${inst.activeCertificateId}`}
                          className="btn btn-sm btn-outline-success fw-semibold"
                          title="View Certificate"
                        >
                          <i className="bi bi-award"></i> Certificate
                        </Link>
                      )}

                      {inst.status !== 'VERIFIED' && inst.status !== 'APPLICATION_SUBMITTED' && inst.status !== 'SCHEDULED' && (
                        <Link
                          to={`/business/apply?instId=${inst.id}`}
                          className="btn btn-sm btn-warning text-dark fw-bold"
                          title="Apply for Stamping"
                        >
                          Apply Stamping
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

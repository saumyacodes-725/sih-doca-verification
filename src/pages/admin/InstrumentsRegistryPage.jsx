import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInstruments } from '../../services/storageService';
import StatusBadge from '../../components/common/StatusBadge';

export default function InstrumentsRegistryPage() {
  const { showToast } = useAuth();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInst, setSelectedInst] = useState(null);
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getInstruments().then(setInstruments).catch(() => setInstruments([]));
  }, []);

  const filtered = instruments.filter((i) => {
    const matchesSearch =
      !search.trim() ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      i.type.toLowerCase().includes(search.toLowerCase()) ||
      i.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.model.toLowerCase().includes(search.toLowerCase()) ||
      (i.stampingNumber && i.stampingNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesState = stateFilter === 'ALL' || i.state === stateFilter;
    const matchesClass = classFilter === 'ALL' || i.accuracyClass.includes(classFilter);
    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;

    return matchesSearch && matchesState && matchesClass && matchesStatus;
  });

  const handleExportCSV = () => {
    showToast('Exported National Instruments Registry to CSV', 'success');
  };

  return (
    <div className="admin-instruments-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / National Admin / Fleet Registry
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-database text-danger me-2"></i> National Weighing & Measuring Instruments Registry
            </h3>
            <p className="text-muted small mb-0">
              Master database of all registered commercial instruments across India under Section 24 of Legal Metrology Act, 2009.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button onClick={handleExportCSV} className="btn btn-outline-secondary btn-sm fw-semibold">
              <i className="bi bi-download me-1"></i> Export Registry (CSV)
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-lg-4 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by Serial, Trader, Model, Stamping Tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-3">
              <select
                className="form-select"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                <option value="ALL">All States/UTs</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-3">
              <select
                className="form-select"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="ALL">All Accuracy Classes</option>
                <option value="Class I">Class I (Special Precision)</option>
                <option value="Class II">Class II (High Accuracy)</option>
                <option value="Class III">Class III (Medium Accuracy)</option>
                <option value="Class IV">Class IV (Ordinary Accuracy)</option>
                <option value="Class 0.5">Class 0.5 (Liquid Fuel)</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses ({instruments.length})</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="APPLICATION_SUBMITTED">APP SUBMITTED</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>

            <div className="col-lg-1 col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch('');
                  setStateFilter('ALL');
                  setClassFilter('ALL');
                  setStatusFilter('ALL');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Master Registry Table */}
        <div className="card border-0 shadow-sm bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>National ID</th>
                  <th>Instrument & Model</th>
                  <th>Accuracy & Capacity</th>
                  <th>Owner Establishment</th>
                  <th>State / Zone</th>
                  <th>Stamping Tag</th>
                  <th>Status</th>
                  <th className="text-end">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inst) => (
                  <tr key={inst.id}>
                    <td>
                      <strong className="font-monospace text-primary">{inst.id}</strong>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>SN: {inst.serialNumber}</div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{inst.type}</div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{inst.manufacturer} — {inst.model}</span>
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info border mb-1">{inst.accuracyClass.split(' ')[0]}</span>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>Max: {inst.maxCapacity} (e={inst.verificationInterval})</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{inst.ownerName}</div>
                      <span className="text-muted font-monospace" style={{ fontSize: '0.68rem' }}>{inst.businessRegNo}</span>
                    </td>
                    <td>
                      <div>{inst.state}</div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{inst.district}</span>
                    </td>
                    <td>
                      {inst.stampingNumber ? (
                        <span className="badge bg-dark text-warning border font-monospace">
                          <i className="bi bi-tag-fill me-1"></i> {inst.stampingNumber}
                        </span>
                      ) : (
                        <span className="text-muted">Unstamped</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={inst.status} />
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => setSelectedInst(inst)}
                        className="btn btn-sm btn-outline-primary fw-semibold"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instrument Detail Modal */}
        {selectedInst && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1070 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-navy-dark text-white py-2 px-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-database text-warning fs-5"></i>
                    <h6 className="modal-title fw-bold mb-0">
                      National Registry Record — {selectedInst.id}
                    </h6>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedInst(null)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3 small">
                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-light-subtle h-100">
                        <h6 className="fw-bold text-navy-dark border-bottom pb-1 mb-2">Technical Profile</h6>
                        <div><strong>Instrument:</strong> {selectedInst.type}</div>
                        <div><strong>Make / Model:</strong> {selectedInst.manufacturer} / {selectedInst.model}</div>
                        <div><strong>Serial Number:</strong> <span className="font-monospace">{selectedInst.serialNumber}</span></div>
                        <div><strong>Accuracy Class:</strong> {selectedInst.accuracyClass}</div>
                        <div><strong>Max Capacity:</strong> {selectedInst.maxCapacity}</div>
                        <div><strong>Verification Interval (e):</strong> {selectedInst.verificationInterval}</div>
                        <div><strong>Pattern Approval:</strong> {selectedInst.patternApprovalNo || 'IND-LM-PA-2023-412'}</div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-3 border rounded bg-light-subtle h-100">
                        <h6 className="fw-bold text-navy-dark border-bottom pb-1 mb-2">Owner & Stamping Status</h6>
                        <div><strong>Trader:</strong> {selectedInst.ownerName}</div>
                        <div><strong>GSTIN:</strong> <span className="font-monospace">{selectedInst.businessRegNo}</span></div>
                        <div><strong>Site Address:</strong> {selectedInst.location}</div>
                        <div><strong>GPS Coordinates:</strong> {selectedInst.latitude}, {selectedInst.longitude}</div>
                        <div><strong>Stamping Tag:</strong> {selectedInst.stampingNumber || 'N/A'}</div>
                        <div><strong>Expiry Date:</strong> {selectedInst.expiryDate || 'N/A'}</div>
                        <div className="mt-2"><strong>Status:</strong> <StatusBadge status={selectedInst.status} /></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light py-2 px-3">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedInst(null)}
                  >
                    Close
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

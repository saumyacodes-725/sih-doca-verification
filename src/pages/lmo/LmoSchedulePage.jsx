import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LmoSchedulePage() {
  const { currentUser } = useAuth();

  const scheduleSlots = [
    {
      date: '2026-08-25',
      day: 'Tuesday',
      slots: [
        {
          time: '10:30 AM - 01:00 PM',
          appId: 'APP-2026-103',
          trader: 'Apex Weighing & Logistics Ltd',
          instrument: 'Electronic Retail Weighing Scale EL-900',
          location: 'Okhla Phase III Retail Hub, New Delhi',
          status: 'SCHEDULED'
        },
        {
          time: '02:30 PM - 05:00 PM',
          appId: 'APP-2026-101',
          trader: 'Apex Weighing & Logistics Ltd',
          instrument: 'Heavy Duty Electronic Weighbridge 60T',
          location: 'Container Freight Station, Tughlakabad',
          status: 'PENDING_CONFIRMATION'
        }
      ]
    },
    {
      date: '2026-08-26',
      day: 'Wednesday',
      slots: [
        {
          time: '10:30 AM - 01:00 PM',
          appId: 'APP-2026-102',
          trader: 'Kalyan Diamond & Gold Jewellers',
          instrument: 'High-Precision Micro-Analytical Balance 220g',
          location: 'T. Nagar Main Road Showroom',
          status: 'SCHEDULED'
        }
      ]
    }
  ];

  return (
    <div className="lmo-schedule-page py-4 px-3 bg-light min-vh-100">
      <div className="container-fluid px-md-4">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="small text-muted mb-1">
              <span className="text-primary">Trust Scale</span> / Enforcement Portal / Inspection Schedule
            </div>
            <h3 className="fw-bold text-navy-dark mb-0">
              <i className="bi bi-calendar-event text-primary me-2"></i> Field Verification Schedule & Roster
            </h3>
            <p className="text-muted small mb-0">
              Officer: <strong>{currentUser.name}</strong> | North Zone Enforcement Wing
            </p>
          </div>
        </div>

        {/* Schedule Calendar Cards */}
        <div className="row g-4">
          {scheduleSlots.map((dayGroup, idx) => (
            <div key={idx} className="col-lg-6 col-12">
              <div className="card border-0 shadow-sm bg-white h-100 rounded-3">
                <div className="card-header bg-navy-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-0 text-warning">{dayGroup.day}</h5>
                    <span className="small text-light-50">{dayGroup.date}</span>
                  </div>
                  <span className="badge bg-primary px-3 py-1">{dayGroup.slots.length} Inspections</span>
                </div>

                <div className="card-body p-3">
                  <div className="d-flex flex-column gap-3">
                    {dayGroup.slots.map((slot, sIdx) => (
                      <div key={sIdx} className="p-3 border rounded bg-light-subtle small">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-dark text-warning font-monospace">
                            <i className="bi bi-clock-fill me-1"></i> {slot.time}
                          </span>
                          <span className="badge bg-primary-subtle text-primary">{slot.appId}</span>
                        </div>

                        <h6 className="fw-bold text-navy-dark mb-1">{slot.instrument}</h6>
                        <div className="fw-semibold text-dark mb-1">
                          <i className="bi bi-building me-1"></i> {slot.trader}
                        </div>
                        <div className="text-muted mb-3">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i> {slot.location}
                        </div>

                        <Link
                          to={`/lmo/inspect/${slot.appId}`}
                          className="btn btn-sm btn-warning text-dark fw-bold w-100"
                        >
                          <i className="bi bi-tools me-1"></i> Launch Digital Checklist &rarr;
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

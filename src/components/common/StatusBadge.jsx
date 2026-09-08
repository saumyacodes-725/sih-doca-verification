import React from 'react';

export default function StatusBadge({ status }) {
  const norm = (status || '').toUpperCase();

  switch (norm) {
    case 'VALID':
    case 'VERIFIED':
    case 'PASSED':
    case 'COMPLETED':
      return (
        <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold px-2 py-1">
          <i className="bi bi-patch-check-fill me-1"></i>
          {norm === 'VERIFIED' ? 'VALID / VERIFIED' : norm}
        </span>
      );

    case 'EXPIRING_SOON':
    case 'EXPIRING SOON':
      return (
        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle fw-semibold px-2 py-1">
          <i className="bi bi-exclamation-triangle-fill me-1 text-warning"></i>
          EXPIRING SOON
        </span>
      );

    case 'EXPIRED':
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold px-2 py-1">
          <i className="bi bi-x-circle-fill me-1"></i>
          EXPIRED
        </span>
      );

    case 'REVOKED':
      return (
        <span className="badge bg-dark-subtle text-danger border border-danger fw-semibold px-2 py-1">
          <i className="bi bi-slash-circle-fill me-1"></i>
          REVOKED
        </span>
      );

    case 'PENDING':
    case 'PENDING_REVIEW':
    case 'REGISTERED':
      return (
        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle fw-semibold px-2 py-1">
          <i className="bi bi-clock-history me-1"></i>
          {norm === 'PENDING_REVIEW' ? 'PENDING REVIEW' : norm}
        </span>
      );

    case 'SCHEDULED':
      return (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold px-2 py-1">
          <i className="bi bi-calendar-check-fill me-1"></i>
          SCHEDULED
        </span>
      );

    case 'IN_PROGRESS':
    case 'IN PROGRESS':
    case 'APPLICATION_SUBMITTED':
      return (
        <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle fw-semibold px-2 py-1">
          <i className="bi bi-arrow-repeat me-1 spin-icon"></i>
          {norm === 'APPLICATION_SUBMITTED' ? 'APP SUBMITTED' : 'IN PROGRESS'}
        </span>
      );

    case 'FAILED':
    case 'REJECTED':
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold px-2 py-1">
          <i className="bi bi-shield-x me-1"></i>
          {norm === 'REJECTED' ? 'REJECTED / FAILED' : 'FAILED'}
        </span>
      );

    case 'APPROVED':
      return (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold px-2 py-1">
          <i className="bi bi-check2-circle me-1"></i>
          APPROVED
        </span>
      );

    default:
      return <span className="badge bg-light text-dark border px-2 py-1">{status}</span>;
  }
}

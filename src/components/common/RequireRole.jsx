import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Route guard: only lets the listed roles render `children`. Anyone else
// (including a logged-out "public" session) is bounced to /login with a
// warning toast, since routes carry no role check on their own otherwise.
export default function RequireRole({ roles, children }) {
  const { currentRole, showToast } = useAuth();
  const location = useLocation();
  const allowed = roles.includes(currentRole);

  useEffect(() => {
    if (!allowed) {
      showToast('Please log in with the correct role to access that page.', 'warning');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, location.pathname]);

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

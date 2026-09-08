import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDb, subscribeToDbChanges, resetDatabase, apiLogin, apiRegister, apiMe } from '../services/storageService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'emaap_token';
const ROLE_KEY = 'emaap_current_role';

export const ROLE_PROFILES = {
  public: {
    id: 'USR-PUBLIC',
    name: 'Citizen / Consumer',
    role: 'public',
    roleLabel: 'Citizen / Public User',
    department: 'General Public & Consumer Access',
    badge: 'Citizen Access',
    avatar: 'bi-person-circle',
    color: 'info'
  },
  business: {
    id: 'USR-BIZ-01',
    name: 'Rajesh Agrawal',
    company: 'Apex Weighing & Logistics Ltd',
    role: 'business',
    roleLabel: 'Business Owner / Trader',
    department: 'Commercial Trader (GSTIN: 07AAACA1234F1Z5)',
    badge: 'Trader ID: TRD-2026-991',
    avatar: 'bi-shop',
    color: 'warning'
  },
  lmo: {
    id: 'LMO-01',
    name: 'Insp. Rajesh Sharma',
    role: 'lmo',
    roleLabel: 'Legal Metrology Officer (LMO)',
    department: 'Field Enforcement Wing, South Delhi Zone',
    badge: 'Officer Badge: DOCA-LM-1092',
    avatar: 'bi-patch-check-fill',
    color: 'primary'
  },
  gatc: {
    id: 'GATC-01',
    name: 'Dr. V. K. Ramanathan',
    company: 'GATC Precision Metrology Lab North',
    role: 'gatc',
    roleLabel: 'GATC Lab Metrologist',
    department: 'Govt Approved Test Centre (NABL-CC-2891)',
    badge: 'GATC Lab: GATC-DL-001',
    avatar: 'bi-cpu-fill',
    color: 'success'
  },
  admin: {
    id: 'USR-ADM-01',
    name: 'Dr. Anand Swaroop, IAS',
    role: 'admin',
    roleLabel: 'Legal Metrology Controller',
    department: 'Department of Consumer Affairs (DoCA), Govt of India',
    badge: 'National Controller (Admin)',
    avatar: 'bi-shield-check',
    color: 'danger'
  }
};

// Seeded via `node backend/src/seed.js` — lets the one-click role buttons in
// the header/walkthrough bar still work instantly while going through real
// JWT auth underneath, instead of faking a session.
const DEMO_CREDENTIALS = {
  business: { email: 'business@demo.test', password: 'Password123!' },
  lmo: { email: 'lmo@demo.test', password: 'Password123!' },
  gatc: { email: 'gatc@demo.test', password: 'Password123!' },
  admin: { email: 'admin@demo.test', password: 'Password123!' }
};

function buildProfile(role, apiUser) {
  const base = ROLE_PROFILES[role] || ROLE_PROFILES.public;
  if (!apiUser) return base;
  return { ...base, ...apiUser, id: apiUser._id || apiUser.id, role };
}

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem(ROLE_KEY) || 'public';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(ROLE_KEY) || 'public';
    return ROLE_PROFILES[saved] || ROLE_PROFILES.public;
  });

  const [dbState, setDbState] = useState(() => getDb());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToDbChanges((newDb) => {
      setDbState(newDb);
    });
    return unsubscribe;
  }, []);

  // Hydrate the real session from a saved JWT on first load.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    apiMe()
      .then((user) => {
        setCurrentRole(user.role);
        setCurrentUser(buildProfile(user.role, user));
        localStorage.setItem(ROLE_KEY, user.role);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      });
  }, []);

  const showToast = (message, type = 'primary') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const applySession = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    const profile = buildProfile(user.role, user);
    setCurrentRole(user.role);
    setCurrentUser(profile);
    localStorage.setItem(ROLE_KEY, user.role);
    return profile;
  };

  // Real credential login against POST /api/auth/login. Throws on failure so
  // the caller (login form, or switchRole's demo fallback) decides how to
  // surface the error.
  const login = async (email, password) => {
    const { token, user } = await apiLogin(email, password);
    const profile = applySession(token, user);
    showToast(`Logged in successfully as ${profile.name} (${profile.roleLabel})`, 'success');
    return profile;
  };

  const register = async (payload) => {
    const { token, user } = await apiRegister(payload);
    const profile = applySession(token, user);
    showToast(`Account created — welcome, ${profile.name}!`, 'success');
    return profile;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentRole('public');
    setCurrentUser(ROLE_PROFILES.public);
    localStorage.setItem(ROLE_KEY, 'public');
    showToast('Logged out to Public portal view.', 'secondary');
  };

  // One-click demo role switch (header buttons, walkthrough bar). Performs a
  // real login against the seeded demo account for that role so every page
  // still gets a valid JWT and real per-user data ownership.
  const switchRole = async (role) => {
    if (role === 'public' || !ROLE_PROFILES[role]) {
      logout();
      return;
    }

    const creds = DEMO_CREDENTIALS[role];
    try {
      await login(creds.email, creds.password);
    } catch (error) {
      setCurrentRole(role);
      setCurrentUser(ROLE_PROFILES[role]);
      localStorage.setItem(ROLE_KEY, role);
      showToast(`Backend unavailable — showing ${ROLE_PROFILES[role].roleLabel} view without live data.`, 'warning');
    }
  };

  const handleResetData = () => {
    resetDatabase();
    showToast('Portal database restored to standard initial state.', 'warning');
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        login,
        register,
        logout,
        dbState,
        toast,
        showToast,
        handleResetData,
        ROLE_PROFILES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

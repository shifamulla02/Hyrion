/**
 * =============================================================================
 * AuthContext.jsx — GLOBAL AUTHENTICATION STATE
 * =============================================================================
 *
 * WHY THIS FILE EXISTS:
 * Auth state (current user, org, role, JWT) is needed in many places: the
 * sidebar (shows org name + user name), route guards (redirect to /login
 * if not authenticated), role-gated UI (hide "Delete" buttons from
 * non-admins), and every API call (needs the token). Rather than threading
 * this through props, we use React Context so any component can call
 * `useAuth()` and get what it needs.
 *
 * PERSISTENCE:
 * On login/register, we store the JWT and a snapshot of user/org info in
 * localStorage. On page reload, we rehydrate from localStorage so the user
 * isn't logged out just by refreshing the tab. The token itself is the
 * source of truth for the backend; what we store locally is just enough to
 * render the UI immediately without an extra round-trip.
 * =============================================================================
 */
import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "hyrion_token";
const USER_KEY = "hyrion_user";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [loading, setLoading] = useState(false);

  /**
   * Persist the AuthResponse from the backend (register or login) into
   * both React state and localStorage, so the session survives reloads.
   */
  const applySession = useCallback((authResponse) => {
    const sessionUser = {
      userId: authResponse.user_id,
      userName: authResponse.user_name,
      userEmail: authResponse.user_email,
      userRole: authResponse.user_role,
      orgId: authResponse.org_id,
      orgName: authResponse.org_name,
      orgSlug: authResponse.org_slug,
    };
    localStorage.setItem(TOKEN_KEY, authResponse.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
  }, []);

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const data = await authApi.register(payload);
        applySession(data);
        return data;
      } finally {
        setLoading(false);
      }
    },
    [applySession]
  );

  const login = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const data = await authApi.login(payload);
        applySession(data);
        return data;
      } finally {
        setLoading(false);
      }
    },
    [applySession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(user);

  /**
   * Role helpers — mirror the backend's @PreAuthorize rules so the UI can
   * hide actions the user isn't permitted to perform. The backend remains
   * the source of truth for enforcement; this is purely for UX (don't show
   * a "Delete" button that would 403).
   */
  const isAdmin = user?.userRole === "ORG_ADMIN";
  const canManageRecruitment = user?.userRole === "ORG_ADMIN" || user?.userRole === "ORG_RECRUITER";

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    canManageRecruitment,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Provider and hook are intentionally co-located in one file — the standard
// React Context pattern. This only affects Fast Refresh granularity during
// development (an HMR optimization hint), not runtime correctness.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

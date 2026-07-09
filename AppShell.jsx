/**
 * =============================================================================
 * AppShell.jsx — THE PERSISTENT APPLICATION FRAME
 * =============================================================================
 * Every authenticated page renders inside this shell: a fixed-width left
 * sidebar (navigation + org identity, Attio-style) and a content area that
 * scrolls independently. This is rendered once per route change via
 * react-router's <Outlet />, so the sidebar never remounts or flickers
 * while navigating between Jobs / Candidates / etc.
 * =============================================================================
 */
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/jobs", label: "Jobs", icon: BriefcaseIcon },
  { to: "/candidates", label: "Candidates", icon: PeopleIcon },
];

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const initials = (user?.userName || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="shell">
      <header className="shell__header">
        <div className="shell__header-left">
          <div className="shell__org">
            <div className="shell__org-mark">{(user?.orgName || "?")[0]}</div>
            <div className="shell__org-meta">
              <span className="shell__org-name">{user?.orgName}</span>
              <span className="shell__org-plan eyebrow">Workspace</span>
            </div>
          </div>

          <nav className="shell__nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `shell__nav-link ${isActive ? "shell__nav-link--active" : ""}`
                }
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="shell__user">
          <button 
            className="shell__logout" 
            onClick={() => setDarkMode(!darkMode)} 
            aria-label="Toggle Dark Mode"
            style={{ marginRight: '8px' }}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          
          <div className="shell__user-meta">
            <span className="shell__user-name">{user?.userName}</span>
            <span className="shell__user-role">{roleLabel(user?.userRole)}</span>
          </div>
          <div className="shell__user-avatar">{initials}</div>
          <button className="shell__logout" onClick={handleLogout} aria-label="Log out">
            <LogoutIcon />
          </button>
        </div>
      </header>

      <main className="shell__content">
        <Outlet />
      </main>
    </div>
  );
}

function roleLabel(role) {
  switch (role) {
    case "ORG_ADMIN":
      return "Admin";
    case "ORG_RECRUITER":
      return "Recruiter";
    case "ORG_HIRING_MANAGER":
      return "Hiring Manager";
    default:
      return "";
  }
}

/* ---- Inline icon set: minimal stroke icons, no external icon library ---- */

function DashboardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.5" y="2" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="9.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2" y="5.5" width="13" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 5.5V4a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 11 4v1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 9.5h13" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="5.5" r="2.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 14c0-2.4 1.8-4 4-4s4 1.6 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="5.5" r="1.75" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <path d="M11 10.3c1.8.2 3 1.6 3 3.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 2H3.5A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M10.5 11l3-3-3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.3 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

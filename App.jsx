/**
 * =============================================================================
 * App.jsx — ROUTE TABLE
 * =============================================================================
 * RequireGuest wraps /login and /register (bounces logged-in users away).
 * RequireAuth wraps everything inside AppShell (bounces logged-out users to
 * /login). The root path "/" redirects to /jobs, which is the default
 * landing page once authenticated.
 * =============================================================================
 */
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth, RequireGuest } from "./components/RouteGuards";
import { AppShell } from "./layouts/AppShell";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { JobsList } from "./pages/jobs/JobsList";
import { JobDetail } from "./pages/jobs/JobDetail";
import { CandidatesList } from "./pages/candidates/CandidatesList";
import { CandidateDetail } from "./pages/candidates/CandidateDetail";
import { Dashboard } from "./pages/Dashboard";

import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";

export default function App() {
  return (
    <Routes>
      <Route element={<RequireGuest />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/candidates" element={<CandidatesList />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

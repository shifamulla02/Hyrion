/**
 * =============================================================================
 * main.jsx — APPLICATION ENTRY POINT
 * =============================================================================
 * Mounts the React tree. Provider order matters: BrowserRouter outermost
 * (routing needs to exist before anything else), then AuthProvider and
 * ToastProvider as siblings since neither depends on the other — both are
 * read by components anywhere in the tree.
 *
 * All global stylesheets are imported here once, in dependency order:
 * tokens → global resets → component styles → page-specific styles.
 * =============================================================================
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/button.css";
import "./styles/form.css";
import "./styles/badge.css";
import "./styles/toast.css";
import "./styles/shell.css";
import "./styles/layout.css";
import "./styles/auth.css";
import "./styles/pipeline.css";
import "./styles/candidate-picker.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

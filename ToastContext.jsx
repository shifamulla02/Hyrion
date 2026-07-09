/**
 * =============================================================================
 * ToastContext.jsx — LIGHTWEIGHT NOTIFICATION SYSTEM
 * =============================================================================
 * Provides a `showToast(message, variant)` function accessible from anywhere
 * via useToast(). Used for confirming actions ("Job created") and surfacing
 * API errors without resorting to browser alert() dialogs, which break the
 * calm, structured feel of the rest of the product.
 * =============================================================================
 */
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, variant = "default") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.variant}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Provider and hook are intentionally co-located in one file — the standard
// React Context pattern. This only affects Fast Refresh granularity during
// development (an HMR optimization hint), not runtime correctness.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

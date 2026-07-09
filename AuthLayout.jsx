/**
 * =============================================================================
 * AuthLayout.jsx — SPLIT SCREEN FOR LOGIN / REGISTER
 * =============================================================================
 * Left panel: the form itself, generously spaced, on the paper background.
 * Right panel: an editorial "thesis" panel (Readdy-influenced) — large
 * display type stating what the product is for, with a short list of
 * what's inside, set against the near-black surface for contrast. This is
 * the one place in the app that gets to feel like a considered, designed
 * moment rather than a utility screen.
 * =============================================================================
 */
export function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__form-pane">
        <div className="auth-layout__form-inner">{children}</div>
      </div>
      <div className="auth-layout__thesis-pane">
        <div className="auth-layout__thesis-content">
          <h1 className="auth-layout__headline">Hyrion</h1>
          <span className="eyebrow auth-layout__eyebrow">Recruitment, organized</span>
          <h2 className="auth-layout__headline">
            One place to run<br />the whole hire.
          </h2>
        </div>
      </div>
    </div>
  );
}

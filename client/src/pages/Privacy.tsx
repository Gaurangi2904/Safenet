import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  LockKeyhole,
  EyeOff,
  Zap,
  Trash2,
  ArrowLeft,
  Moon,
  Sun,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  UserRound,
  Clock3,
  ChevronRight,
} from "lucide-react";

import "./Privacy.css";

/* =========================================================
   PRIVACY & HIDDEN MODE
========================================================= */

function Privacy() {
  const navigate = useNavigate();

  /* =========================================================
     THEME
  ========================================================= */

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("safenet-theme") !== "light";
  });

  /* =========================================================
     PRIVACY SETTINGS
  ========================================================= */

  const [hiddenMode, setHiddenMode] = useState(() => {
    return localStorage.getItem("safenet-hidden-mode") === "true";
  });

  const [quickExitEnabled, setQuickExitEnabled] = useState(() => {
    return localStorage.getItem("safenet-quick-exit") !== "false";
  });

  const [hideSensitiveContent, setHideSensitiveContent] = useState(() => {
    return localStorage.getItem("safenet-hide-sensitive") === "true";
  });

  const [message, setMessage] = useState("");

  /* =========================================================
     THEME EFFECT
  ========================================================= */

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "safenet-theme",
      theme
    );
  }, [darkMode]);

  /* =========================================================
     SAVE PRIVACY SETTINGS
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "safenet-hidden-mode",
      String(hiddenMode)
    );
  }, [hiddenMode]);

  useEffect(() => {
    localStorage.setItem(
      "safenet-quick-exit",
      String(quickExitEnabled)
    );
  }, [quickExitEnabled]);

  useEffect(() => {
    localStorage.setItem(
      "safenet-hide-sensitive",
      String(hideSensitiveContent)
    );
  }, [hideSensitiveContent]);

  /* =========================================================
     SHOW MESSAGE
  ========================================================= */

  const showMessage = (text: string) => {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  /* =========================================================
     HIDDEN MODE
  ========================================================= */

  const handleHiddenMode = () => {
    const nextValue = !hiddenMode;

    setHiddenMode(nextValue);

    showMessage(
      nextValue
        ? "Hidden Mode enabled."
        : "Hidden Mode disabled."
    );
  };

  /* =========================================================
     QUICK EXIT
  ========================================================= */

  const handleQuickExit = () => {
    if (!quickExitEnabled) {
      showMessage("Quick Exit is disabled.");
      return;
    }

    /*
      Quick Exit takes the user to the SAFENET landing page.
      It does not delete account data or claim to close
      the browser.
    */

    navigate("/");
  };

  /* =========================================================
     CLEAR LOCAL ACTIVITY
  ========================================================= */

  const handleClearLocalActivity = () => {
    const confirmed = window.confirm(
      "Clear locally stored SAFENET activity and preferences? Your account login will not be removed."
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("safenet_private_journal");
    localStorage.removeItem("safenet_safety_plan");
    localStorage.removeItem("safenet_support_resources");
    localStorage.removeItem("safenet_trusted_contacts");
    localStorage.removeItem("safenet_hidden-mode");
    localStorage.removeItem("safenet-hide-sensitive");

    setHiddenMode(false);
    setHideSensitiveContent(false);

    showMessage("Local SAFENET activity was cleared.");
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("safenet_user");
    localStorage.removeItem("safenet_token");

    navigate("/login");
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="privacy-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="privacy-header">

        <button
          className="privacy-back-button"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          <ArrowLeft size={18} />

          <span>
            Dashboard
          </span>
        </button>

        <div className="privacy-brand">

          <div className="privacy-brand-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <strong>
              SAFENET
            </strong>

            <span>
              Privacy & Security
            </span>
          </div>

        </div>

        <button
          className="privacy-theme-button"
          onClick={() => setDarkMode((value) => !value)}
          aria-label="Toggle theme"
          type="button"
        >
          {darkMode ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="privacy-main">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="privacy-hero">

          <div className="privacy-hero-icon">
            <LockKeyhole size={30} />
          </div>

          <div className="privacy-hero-content">

            <span className="privacy-eyebrow">
              PRIVACY & HIDDEN MODE
            </span>

            <h1>
              Your safety information should stay under your control.
            </h1>

            <p>
              Manage privacy-focused settings that help you control
              what SAFENET displays and what is stored locally on
              your device.
            </p>

            <div className="privacy-hero-tags">

              <span>
                <LockKeyhole size={14} />
                Private
              </span>

              <span>
                <EyeOff size={14} />
                Discreet
              </span>

              <span>
                <ShieldCheck size={14} />
                Safety-focused
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            STATUS
        =================================================== */}

        <section className="privacy-status">

          <div className="privacy-status-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <strong>
              Privacy controls are available
            </strong>

            <p>
              Review your settings below and choose the level
              of privacy that works for your situation.
            </p>
          </div>

          <span className="privacy-status-badge">
            Active
          </span>

        </section>

        {/* ===================================================
            SETTINGS
        =================================================== */}

        <section className="privacy-section">

          <div className="privacy-section-heading">

            <span>
              PRIVACY CONTROLS
            </span>

            <h2>
              Choose how SAFENET behaves
            </h2>

            <p>
              These settings are stored locally on this device.
            </p>

          </div>

          <div className="privacy-settings">

            {/* HIDDEN MODE */}

            <div className="privacy-setting-card">

              <div className="privacy-setting-icon">
                <EyeOff size={23} />
              </div>

              <div className="privacy-setting-content">

                <div className="privacy-setting-title">

                  <div>
                    <strong>
                      Hidden Mode
                    </strong>

                    <span>
                      Reduce the visibility of sensitive SAFENET information.
                    </span>
                  </div>

                  <button
                    className={`privacy-toggle ${
                      hiddenMode
                        ? "active"
                        : ""
                    }`}
                    onClick={handleHiddenMode}
                    type="button"
                    aria-label="Toggle Hidden Mode"
                    aria-pressed={hiddenMode}
                  >
                    <span />
                  </button>

                </div>

                <div className="privacy-setting-status">

                  <span>
                    {hiddenMode
                      ? "Hidden Mode is enabled"
                      : "Hidden Mode is disabled"}
                  </span>

                </div>

              </div>

            </div>

            {/* QUICK EXIT */}

            <div className="privacy-setting-card">

              <div className="privacy-setting-icon">
                <Zap size={23} />
              </div>

              <div className="privacy-setting-content">

                <div className="privacy-setting-title">

                  <div>
                    <strong>
                      Quick Exit
                    </strong>

                    <span>
                      Keep a fast route away from sensitive SAFENET pages.
                    </span>
                  </div>

                  <button
                    className={`privacy-toggle ${
                      quickExitEnabled
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setQuickExitEnabled(
                        (value) => !value
                      )
                    }
                    type="button"
                    aria-label="Toggle Quick Exit"
                    aria-pressed={quickExitEnabled}
                  >
                    <span />
                  </button>

                </div>

                <div className="privacy-setting-status">

                  <span>
                    {quickExitEnabled
                      ? "Quick Exit is enabled"
                      : "Quick Exit is disabled"}
                  </span>

                </div>

              </div>

            </div>

            {/* SENSITIVE CONTENT */}

            <div className="privacy-setting-card">

              <div className="privacy-setting-icon">
                <LockKeyhole size={23} />
              </div>

              <div className="privacy-setting-content">

                <div className="privacy-setting-title">

                  <div>
                    <strong>
                      Hide Sensitive Content
                    </strong>

                    <span>
                      Hide sensitive information from selected SAFENET views.
                    </span>
                  </div>

                  <button
                    className={`privacy-toggle ${
                      hideSensitiveContent
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setHideSensitiveContent(
                        (value) => !value
                      )
                    }
                    type="button"
                    aria-label="Toggle sensitive content"
                    aria-pressed={hideSensitiveContent}
                  >
                    <span />
                  </button>

                </div>

                <div className="privacy-setting-status">

                  <span>
                    {hideSensitiveContent
                      ? "Sensitive content will be hidden where supported"
                      : "Sensitive content is visible"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            QUICK EXIT CARD
        =================================================== */}

        <section className="privacy-quick-exit">

          <div className="privacy-quick-exit-icon">
            <Zap size={25} />
          </div>

          <div className="privacy-quick-exit-content">

            <span>
              QUICK EXIT
            </span>

            <h2>
              Leave this area quickly.
            </h2>

            <p>
              Use Quick Exit to return to the SAFENET landing
              page without navigating through your safety tools.
            </p>

          </div>

          <button
            onClick={handleQuickExit}
            disabled={!quickExitEnabled}
            type="button"
          >
            Quick Exit

            <ChevronRight size={18} />
          </button>

        </section>

        {/* ===================================================
            LOCAL DATA
        =================================================== */}

        <section className="privacy-data-section">

          <div className="privacy-section-heading">

            <span>
              LOCAL DATA
            </span>

            <h2>
              Manage information stored on this device
            </h2>

            <p>
              SAFENET uses local browser storage for some
              frontend features and preferences.
            </p>

          </div>

          <div className="privacy-data-grid">

            <div className="privacy-data-card">

              <div className="privacy-data-icon">
                <Smartphone size={21} />
              </div>

              <div>
                <strong>
                  Device storage
                </strong>

                <p>
                  Some safety tools save information locally
                  so it remains available on this device.
                </p>
              </div>

            </div>

            <div className="privacy-data-card">

              <div className="privacy-data-icon">
                <Clock3 size={21} />
              </div>

              <div>
                <strong>
                  Your control
                </strong>

                <p>
                  You can clear supported locally stored
                  SAFENET activity from this page.
                </p>
              </div>

            </div>

            <div className="privacy-data-card">

              <div className="privacy-data-icon">
                <UserRound size={21} />
              </div>

              <div>
                <strong>
                  Account access
                </strong>

                <p>
                  Clearing local activity does not remove
                  your SAFENET account login.
                </p>
              </div>

            </div>

          </div>

          <button
            className="privacy-clear-button"
            onClick={handleClearLocalActivity}
            type="button"
          >
            <Trash2 size={18} />

            Clear local activity

          </button>

        </section>

        {/* ===================================================
            SAFETY NOTICE
        =================================================== */}

        <section className="privacy-notice">

          <div className="privacy-notice-icon">
            <AlertTriangle size={21} />
          </div>

          <div>

            <strong>
              Important privacy note
            </strong>

            <p>
              These frontend privacy controls do not replace
              device security, account security, or emergency
              services. If you are in immediate danger, prioritize
              your physical safety and contact appropriate emergency
              support.
            </p>

          </div>

        </section>

        {/* ===================================================
            ACCOUNT ACTIONS
        =================================================== */}

        <section className="privacy-account">

          <div>
            <span>
              ACCOUNT
            </span>

            <h2>
              Need to leave SAFENET?
            </h2>

            <p>
              You can return to the login screen from here.
            </p>
          </div>

          <button
            onClick={handleLogout}
            type="button"
          >
            Logout

            <ChevronRight size={17} />
          </button>

        </section>

        {/* ===================================================
            MESSAGE
        =================================================== */}

        {message && (
          <div className="privacy-toast">
            <CheckCircle2 size={17} />

            <span>
              {message}
            </span>
          </div>
        )}

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="privacy-footer">

        <div className="privacy-footer-brand">

          <div className="privacy-footer-logo">
            <ShieldCheck size={19} />
          </div>

          <div>
            <strong>
              SAFENET
            </strong>

            <span>
              Personal Safety Network
            </span>
          </div>

        </div>

        <div className="privacy-footer-copy">

          <span>
            Private • Connected • Safety-focused
          </span>

          <span>
            © 2026 SAFENET
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Privacy;
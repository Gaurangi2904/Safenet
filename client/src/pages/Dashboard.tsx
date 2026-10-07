import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "../api/auth";

import {
  ShieldCheck,
  Siren,
  Route as RouteIcon,
  MapPin,
  Clock3,
  Users,
  Bot,
  LockKeyhole,
  FileText,
  Navigation,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Moon,
  Sun,
  HeartPulse,
  Activity,
  CircleCheck,
  MessageCircle,
  Sparkles,
  ArrowRight,
  UserRound,
  BookOpen,
  ClipboardCheck,
  MapPinned,
  GraduationCap,
  BriefcaseBusiness,
  Globe,
  HeartHandshake,
} from "lucide-react";

import "./Dashboard.css";

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();

  /* =========================================================
     THEME
  ========================================================= */

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("safenet-theme");

    return savedTheme !== "light";
  });

  /* =========================================================
     USER
  ========================================================= */

  const [userName, setUserName] = useState("User");

  /* =========================================================
     THEME EFFECT
  ========================================================= */

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    localStorage.setItem("safenet-theme", theme);

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [darkMode]);

  /* =========================================================
     AUTHENTICATED USER EFFECT
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      const token = localStorage.getItem("safenet_token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const data = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        if (data?.user?.name) {
          setUserName(data.user.name);

          localStorage.setItem(
            "safenet_user",
            JSON.stringify(data.user)
          );
        }
      } catch {
        if (!isMounted) {
          return;
        }

        localStorage.removeItem("safenet_user");
        localStorage.removeItem("safenet_token");

        navigate("/login", { replace: true });
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("safenet_user");
    localStorage.removeItem("safenet_token");

    navigate("/login");
  };

  /* =========================================================
     DASHBOARD UI
  ========================================================= */

  return (
    <div
      className={`dashboard-page ${
        darkMode ? "dashboard-dark" : "dashboard-light"
      }`}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        {/* BRAND */}

        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <ShieldCheck
              size={24}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <strong>SAFENET</strong>

            <span>
              Safety • Rights • Support
            </span>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION */}

        <nav className="dashboard-nav">

          <button
            className="dashboard-nav-item active"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/journey")}
            type="button"
          >
            <RouteIcon size={19} />
            <span>Safety Journey</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/checkin")}
            type="button"
          >
            <Clock3 size={19} />
            <span>Check-In</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/location")}
            type="button"
          >
            <MapPin size={19} />
            <span>Location Safety</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/sos")}
            type="button"
          >
            <Siren size={19} />
            <span>Emergency SOS</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/trusted-contacts")}
            type="button"
          >
            <Users size={19} />
            <span>Trusted Circle</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/domestic-safety")}
            type="button"
          >
            <ShieldCheck size={19} />
            <span>Domestic Safety</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/rights")}
            type="button"
          >
            <FileText size={19} />
            <span>Women's Rights & Laws</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/evidence-vault")}
            type="button"
          >
            <LockKeyhole size={19} />
            <span>Evidence Vault</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/documentation")}
            type="button"
          >
            <FileText size={19} />
            <span>Documentation</span>
          </button>

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/private-journal")}
            type="button"
          >
            <BookOpen size={19} />
            <span>Private Journal</span>
          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="dashboard-sidebar-bottom">

          {/* PRIVACY & SETTINGS */}

          <button
            className="dashboard-nav-item"
            onClick={() => navigate("/privacy")}
            type="button"
          >
            <Settings size={19} />
            <span>Privacy & Settings</span>
          </button>

          {/* LOGOUT */}

          <button
            className="dashboard-logout"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="dashboard-main">

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <header className="dashboard-header">

          <div className="dashboard-header-left">

            <span className="dashboard-eyebrow">
              SAFETY COMMAND CENTER
            </span>

            <h1>
              Welcome back, {userName}.
            </h1>

            <p>
              Your personal safety tools are ready when you need them.
            </p>

          </div>

          <div className="dashboard-header-actions">

            <button
              className="dashboard-theme-button"
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

            <div className="dashboard-profile">

              <div className="dashboard-profile-avatar">
                <UserRound size={19} />
              </div>

              <div>
                <strong>
                  {userName}
                </strong>

                <span>
                  Personal account
                </span>
              </div>

            </div>

          </div>

        </header>

        {/* ===================================================
            SAFETY STATUS BANNER
        =================================================== */}

        <section className="dashboard-status-banner">

          <div className="dashboard-status-icon">
            <ShieldCheck
              size={25}
              strokeWidth={1.8}
            />
          </div>

          <div className="dashboard-status-content">

            <span>
              CURRENT SAFETY STATUS
            </span>

            <strong>
              You are protected
            </strong>

            <p>
              Your SAFENET safety tools are available.
              Set up your journey, check-ins and trusted contacts.
            </p>

          </div>

          <div className="dashboard-status-badge">

            <span className="dashboard-status-dot"></span>

            Protected

          </div>

        </section>

        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <section className="dashboard-command-section">

          <div className="dashboard-section-heading">

            <div>
              <span>
                QUICK ACTIONS
              </span>

              <h2>
                What do you need right now?
              </h2>
            </div>

            <p>
              Access your most important safety tools instantly.
            </p>

          </div>

          <div className="dashboard-command-grid">

            <button
              className="dashboard-command-card dashboard-command-sos"
              onClick={() => navigate("/sos")}
              type="button"
            >
              <div className="dashboard-command-icon">
                <Siren
                  size={25}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <strong>
                  Emergency SOS
                </strong>

                <span>
                  Get immediate emergency assistance
                </span>
              </div>

              <ChevronRight size={19} />
            </button>

            <button
              className="dashboard-command-card"
              onClick={() => navigate("/journey")}
              type="button"
            >
              <div className="dashboard-command-icon">
                <RouteIcon
                  size={25}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <strong>
                  Start Safety Journey
                </strong>

                <span>
                  Share your planned journey and stay connected
                </span>
              </div>

              <ChevronRight size={19} />
            </button>

            <button
              className="dashboard-command-card"
              onClick={() => navigate("/checkin")}
              type="button"
            >
              <div className="dashboard-command-icon">
                <Clock3
                  size={25}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <strong>
                  Safety Check-In
                </strong>

                <span>
                  Let your circle know that you are safe
                </span>
              </div>

              <ChevronRight size={19} />
            </button>

            <button
              className="dashboard-command-card"
              onClick={() => navigate("/location")}
              type="button"
            >
              <div className="dashboard-command-icon">
                <MapPin
                  size={25}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <strong>
                  Location Safety
                </strong>

                <span>
                  Manage your location safety status
                </span>
              </div>

              <ChevronRight size={19} />
            </button>

          </div>

        </section>

        {/* ===================================================
            STATUS CARDS
        =================================================== */}

        <section className="dashboard-metrics">

          <div className="dashboard-metric-card">

            <div className="dashboard-metric-top">

              <div className="dashboard-metric-icon">
                <RouteIcon size={20} />
              </div>

              <span className="dashboard-metric-label">
                JOURNEY
              </span>

            </div>

            <strong>
              No active journey
            </strong>

            <p>
              Start a Safety Journey before travelling.
            </p>

            <button
              onClick={() => navigate("/journey")}
              type="button"
            >
              Start journey
              <ArrowRight size={15} />
            </button>

          </div>

          <div className="dashboard-metric-card">

            <div className="dashboard-metric-top">

              <div className="dashboard-metric-icon">
                <Clock3 size={20} />
              </div>

              <span className="dashboard-metric-label">
                CHECK-IN
              </span>

            </div>

            <strong>
              Ready
            </strong>

            <p>
              Your next safety check-in can be started anytime.
            </p>

            <button
              onClick={() => navigate("/checkin")}
              type="button"
            >
              Open check-in
              <ArrowRight size={15} />
            </button>

          </div>

          <div className="dashboard-metric-card">

            <div className="dashboard-metric-top">

              <div className="dashboard-metric-icon">
                <Navigation size={20} />
              </div>

              <span className="dashboard-metric-label">
                LOCATION
              </span>

            </div>

            <strong>
              Not enabled
            </strong>

            <p>
              Enable Location Safety when you want additional protection.
            </p>

            <button
              onClick={() => navigate("/location")}
              type="button"
            >
              Manage location
              <ArrowRight size={15} />
            </button>

          </div>

          <div className="dashboard-metric-card">

            <div className="dashboard-metric-top">

              <div className="dashboard-metric-icon">
                <Users size={20} />
              </div>

              <span className="dashboard-metric-label">
                TRUSTED CIRCLE
              </span>

            </div>

            <strong>
              Stay connected
            </strong>

            <p>
              Keep trusted people available for emergency support.
            </p>

            <button
              onClick={() => navigate("/trusted-contacts")}
              type="button"
            >
              Manage contacts
              <ArrowRight size={15} />
            </button>

          </div>

        </section>

        {/* ===================================================
            SAFETY TOOLKIT
        =================================================== */}

        <section className="dashboard-toolkit">

          <div className="dashboard-section-heading">

            <div>

              <span>
                SAFETY TOOLKIT
              </span>

              <h2>
                Tools for everyday safety
              </h2>

            </div>

            <p>
              Prepare before something goes wrong.
            </p>

          </div>

          <div className="dashboard-toolkit-grid">

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/trusted-contacts")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <Users size={22} />
              </div>

              <div>
                <strong>
                  Trusted Circle
                </strong>

                <span>
                  Add people you trust and keep them connected.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/domestic-safety")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <ShieldCheck size={22} />
              </div>

              <div>
                <strong>
                  Domestic Safety
                </strong>

                <span>
                  Explore safety planning and support for difficult home situations.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/rights")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <FileText size={22} />
              </div>

              <div>
                <strong>
                  Women's Rights & Laws
                </strong>

                <span>
                  Learn about important rights, laws and official support resources.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/documentation")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <FileText size={22} />
              </div>

              <div>
                <strong>
                  Private Documentation
                </strong>

                <span>
                  Keep a private record of important incidents.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/evidence-vault")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <LockKeyhole size={22} />
              </div>

              <div>
                <strong>
                  Evidence Vault
                </strong>

                <span>
                  Securely organize important evidence.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/private-journal")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <BookOpen size={22} />
              </div>

              <div>
                <strong>
                  Private Journal
                </strong>

                <span>
                  Privately record your thoughts and experiences.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/safety-planning")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <ClipboardCheck size={22} />
              </div>

              <div>
                <strong>
                  Safety Planning
                </strong>

                <span>
                  Prepare a personal plan for safer situations.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/support-resources")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <MapPinned size={22} />
              </div>

              <div>
                <strong>
                  Support Resources
                </strong>

                <span>
                  Keep important safety resources available when needed.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/student-safety")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <GraduationCap size={22} />
              </div>

              <div>
                <strong>
                  Student Safety
                </strong>

                <span>
                  Support for safer college and campus experiences.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/workplace-safety")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <strong>
                  Workplace Safety
                </strong>

                <span>
                  Support for workplace harassment and safer reporting.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/online-safety")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <Globe size={22} />
              </div>

              <div>
                <strong>
                  Online Safety
                </strong>

                <span>
                  Protection guidance for online abuse and digital threats.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

            <button
              className="dashboard-tool-card"
              onClick={() => navigate("/help-someone")}
              type="button"
            >
              <div className="dashboard-tool-icon">
                <HeartHandshake size={22} />
              </div>

              <div>
                <strong>
                  Help Someone
                </strong>

                <span>
                  Learn how to support someone facing an unsafe situation.
                </span>
              </div>

              <ChevronRight size={18} />
            </button>

          </div>

        </section>

        {/* ===================================================
            ACTIVITY + AI
        =================================================== */}

        <section className="dashboard-lower-grid">

          <div className="dashboard-activity-card">

            <div className="dashboard-card-heading">

              <div>

                <span>
                  RECENT ACTIVITY
                </span>

                <h2>
                  Safety timeline
                </h2>

              </div>

              <Activity size={20} />

            </div>

            <div className="dashboard-timeline">

              <div className="dashboard-timeline-item">

                <div className="dashboard-timeline-icon success">
                  <CircleCheck size={16} />
                </div>

                <div>

                  <strong>
                    SAFENET dashboard opened
                  </strong>

                  <span>
                    Your safety command center is ready.
                  </span>

                </div>

                <time>
                  Now
                </time>

              </div>

              <div className="dashboard-timeline-item">

                <div className="dashboard-timeline-icon">
                  <ShieldCheck size={16} />
                </div>

                <div>

                  <strong>
                    Safety system available
                  </strong>

                  <span>
                    Emergency tools are available from the dashboard.
                  </span>

                </div>

                <time>
                  Today
                </time>

              </div>

              <div className="dashboard-timeline-item">

                <div className="dashboard-timeline-icon">
                  <UserRound size={16} />
                </div>

                <div>

                  <strong>
                    Trusted support setup
                  </strong>

                  <span>
                    Keep your trusted circle ready for emergencies.
                  </span>

                </div>

                <time>
                  Today
                </time>

              </div>

            </div>

          </div>

          <div className="dashboard-ai-card">

            <div className="dashboard-ai-header">

              <div className="dashboard-ai-icon">
                <Bot
                  size={24}
                  strokeWidth={1.8}
                />
              </div>

              <div>

                <span>
                  SAFENET AI
                </span>

                <h2>
                  Safety Assistant
                </h2>

              </div>

              <Sparkles size={18} />

            </div>

            <p>
              Need help understanding a situation or deciding
              what safety step to take next?
            </p>

            <div className="dashboard-ai-message">

              <MessageCircle size={18} />

              <span>
                Describe your situation and SAFENET can help
                you explore safety-focused options.
              </span>

            </div>

            <button
              onClick={() => navigate("/register")}
              type="button"
            >
              Open Safety Assistant
              <ArrowRight size={17} />
            </button>

          </div>

        </section>

        {/* ===================================================
            EMERGENCY CARD
        =================================================== */}

        <section className="dashboard-emergency-card">

          <div className="dashboard-emergency-icon">
            <HeartPulse size={25} />
          </div>

          <div className="dashboard-emergency-content">

            <span>
              IN AN EMERGENCY?
            </span>

            <h2>
              Get help quickly.
            </h2>

            <p>
              If you are in immediate danger, use the SAFENET
              emergency flow to access your available safety tools.
            </p>

          </div>

          <button
            onClick={() => navigate("/sos")}
            type="button"
          >
            <Siren size={18} />
            Emergency SOS
          </button>

        </section>

        {/* ===================================================
            SAFETY TIPS
        =================================================== */}

        <section className="dashboard-tips">

          <div className="dashboard-section-heading">

            <div>

              <span>
                SAFETY REMINDER
              </span>

              <h2>
                Small preparations can make a difference.
              </h2>

            </div>

          </div>

          <div className="dashboard-tips-grid">

            <div className="dashboard-tip">

              <div className="dashboard-tip-number">
                01
              </div>

              <div>

                <strong>
                  Keep trusted contacts updated
                </strong>

                <p>
                  Make sure your trusted circle contains people
                  you can reach when necessary.
                </p>

              </div>

            </div>

            <div className="dashboard-tip">

              <div className="dashboard-tip-number">
                02
              </div>

              <div>

                <strong>
                  Plan before travelling
                </strong>

                <p>
                  Use Safety Journey and Check-In when travelling
                  somewhere where you want additional support.
                </p>

              </div>

            </div>

            <div className="dashboard-tip">

              <div className="dashboard-tip-number">
                03
              </div>

              <div>

                <strong>
                  Know your emergency options
                </strong>

                <p>
                  Keep emergency resources and SAFENET SOS
                  accessible when you need them.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="dashboard-footer">

          <div className="dashboard-footer-brand">

            <div className="dashboard-footer-logo">
              <ShieldCheck size={20} />
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

          <div className="dashboard-footer-links">

            <button
              onClick={() => navigate("/dashboard")}
              type="button"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/journey")}
              type="button"
            >
              Safety Journey
            </button>

            <button
              onClick={() => navigate("/checkin")}
              type="button"
            >
              Check-In
            </button>

            <button
              onClick={() => navigate("/location")}
              type="button"
            >
              Location Safety
            </button>

            <button
              onClick={() => navigate("/trusted-contacts")}
              type="button"
            >
              Trusted Circle
            </button>

            <button
              onClick={() => navigate("/rights")}
              type="button"
            >
              Rights & Laws
            </button>

            <button
              onClick={() => navigate("/support-resources")}
              type="button"
            >
              Support Resources
            </button>

          </div>

          <div className="dashboard-footer-copy">

            <span>
              Private • Connected • Safety-focused
            </span>

            <span>
              © 2026 SAFENET
            </span>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Crosshair,
  Heart,
  Lock,
  LockKeyhole,
  MapPin,
  Moon,
  Navigation,
  Scale,
  Shield,
  ShieldCheck,
  Smartphone,
  Sun,
  Users,
  Zap,
} from "lucide-react";

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import SOS from "./pages/SOS";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Journey from "./pages/Journey";
import CheckIn from "./pages/CheckIn";
import Location from "./pages/Location";
import Rights from "./pages/Rights";
import DomesticSafety from "./pages/DomesticSafety";
import EvidenceVault from "./pages/EvidenceVault";
import TrustedCircle from "./pages/TrustedCircle";
import Documentation from "./pages/Documentation";
import PrivateJournal from "./pages/PrivateJournal";
import SafetyPlanning from "./pages/SafetyPlanning";
import SupportResources from "./pages/SupportResources";
import StudentSafety from "./pages/StudentSafety";
import WorkplaceSafety from "./pages/WorkplaceSafety";
import OnlineSafety from "./pages/OnlineSafety";
import HelpSomeone from "./pages/HelpSomeone";
import Privacy from "./pages/Privacy";

import "./App.css";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("safenet-theme");

  if (savedTheme === "light") {
    return "light";
  }

  return "dark";
};

const features = [
  {
    icon: ShieldCheck,
    title: "Emergency SOS",
    description:
      "Get quick access to emergency support when you feel unsafe or need immediate help.",
    link: "Use SOS",
    path: "/sos",
  },
  {
    icon: Navigation,
    title: "Safe Journey",
    description:
      "Share your journey, monitor your route, and stay connected with trusted people.",
    link: "Plan a journey",
    path: "/journey",
  },
  {
    icon: Clock3,
    title: "Safety Check-In",
    description:
      "Set check-ins and let your trusted contacts know that you are safe.",
    link: "Start check-in",
    path: "/checkin",
  },
  {
    icon: MapPin,
    title: "Location Safety",
    description:
      "Access location-based safety tools and prepare for situations before they become urgent.",
    link: "Open location",
    path: "/location",
  },
  {
    icon: LockKeyhole,
    title: "Evidence Vault",
    description:
      "Keep important evidence and documentation organized securely for future reference.",
    link: "Open evidence vault",
    path: "/evidence-vault",
  },
  {
    icon: Users,
    title: "Trusted Circle",
    description:
      "Keep trusted contacts close so you can reach the people who matter when you need support.",
    link: "Manage trusted contacts",
    path: "/trusted-contacts",
  },
];

const whyChooseFeatures = [
  {
    icon: LockKeyhole,
    title: "Privacy First",
    description:
      "Your personal safety information is designed to remain private and under your control.",
  },
  {
    icon: Zap,
    title: "Quick Access",
    description:
      "Important safety tools are organized so you can reach what you need quickly.",
  },
  {
    icon: ClipboardCheck,
    title: "Document Safely",
    description:
      "Keep important notes, incidents and evidence organized for future reference.",
  },
  {
    icon: Scale,
    title: "Know Your Rights",
    description:
      "Understand your rights and find practical information for difficult situations.",
  },
  {
    icon: Users,
    title: "Trusted Support",
    description:
      "Keep trusted contacts and useful support resources close when you need them.",
  },
  {
    icon: MapPin,
    title: "Plan Ahead",
    description:
      "Prepare safety plans, journeys and check-ins before a situation becomes urgent.",
  },
];

const steps = [
  {
    number: "01",
    icon: Shield,
    title: "Create your network",
    description:
      "Create your SAFENET account and organize the people and resources you trust.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Set your safety tools",
    description:
      "Configure trusted contacts, check-ins, journeys and other personal safety tools.",
  },
  {
    number: "03",
    icon: Crosshair,
    title: "Stay connected",
    description:
      "Use SAFENET whenever you travel, check in, document an incident or need support.",
  },
  {
    number: "04",
    icon: Heart,
    title: "Get support",
    description:
      "Access emergency tools, practical information and resources when you need them.",
  },
];

function LandingPage() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return getInitialTheme() !== "light";
  });

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    localStorage.setItem("safenet-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [darkMode]);

  return (
    <div className="app">
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">
              <Shield size={22} />
            </span>

            <span className="logo-text">
              SAFENET<span>.</span>
            </span>
          </Link>

          <nav className="nav-links">
            <a href="#features" className="nav-link">
              Features
            </a>

            <a href="#why-safenet" className="nav-link">
              Why SAFENET
            </a>

            <a href="#safety-rights" className="nav-link">
              Safety
            </a>

            <a href="#how-it-works" className="nav-link">
              How It Works
            </a>
          </nav>

          <div className="nav-actions">
            <button
              className="theme-toggle"
              type="button"
              aria-label="Toggle theme"
              onClick={() => setDarkMode((current) => !current)}
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <button
              className="nav-login"
              type="button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="nav-register"
              type="button"
              onClick={() => navigate("/register")}
            >
              Get Started
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <ShieldCheck size={15} />
                Personal Safety Network
              </div>

              <h1 className="hero-title">
                Your Safety.
                <span>Always Connected.</span>
              </h1>

              <p className="hero-subtitle">
                SAFENET brings emergency support, trusted contacts, safe
                journeys, check-ins, documentation and practical safety
                resources together in one connected place.
              </p>

              <div className="hero-actions">
                <button
                  className="hero-primary-button"
                  type="button"
                  onClick={() => navigate("/register")}
                >
                  Create Your Safety Network
                  <ArrowRight size={18} />
                </button>

                <button
                  className="hero-secondary-button"
                  type="button"
                  onClick={() => navigate("/dashboard")}
                >
                  Explore Safety Dashboard
                  <Shield size={17} />
                </button>
              </div>

              <div className="hero-trust-row">
                <span className="hero-trust-item">
                  <CheckCircle2 size={16} />
                  24/7 Safety Access
                </span>

                <span className="hero-trust-item">
                  <Zap size={16} />
                  1-Tap SOS Access
                </span>

                <span className="hero-trust-item">
                  <Lock size={16} />
                  Private Safety Network
                </span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-card">
                <div className="hero-dashboard-preview">
                  <div className="preview-topbar">
                    <div className="preview-brand">
                      <ShieldCheck size={16} />
                      SAFENET
                    </div>

                    <div className="preview-status">
                      <span className="status-dot" />
                      Protected
                    </div>
                  </div>

                  <div className="preview-heading">
                    <span>Safety Command Center</span>
                    <strong>Stay connected. Stay prepared.</strong>
                  </div>

                  <div className="preview-map">
                    <div className="map-grid">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="map-route route-one" />
                    <div className="map-route route-two" />

                    <div className="map-marker marker-one">
                      <MapPin size={18} />
                    </div>

                    <div className="map-marker marker-two">
                      <ShieldCheck size={18} />
                    </div>

                    <div className="map-safe-zone">
                      <ShieldCheck size={13} />
                      Safe Zone
                    </div>
                  </div>

                  <div className="preview-actions">
                    <button
                      className="preview-action"
                      type="button"
                      onClick={() => navigate("/sos")}
                    >
                      <Zap size={18} />
                      <span>SOS</span>
                    </button>

                    <button
                      className="preview-action"
                      type="button"
                      onClick={() => navigate("/journey")}
                    >
                      <Navigation size={18} />
                      <span>Journey</span>
                    </button>

                    <button
                      className="preview-action"
                      type="button"
                      onClick={() => navigate("/checkin")}
                    >
                      <Clock3 size={18} />
                      <span>Check-In</span>
                    </button>

                    <button
                      className="preview-action"
                      type="button"
                      onClick={() => navigate("/location")}
                    >
                      <MapPin size={18} />
                      <span>Location</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="hero-floating-card top">
                <div className="hero-floating-icon">
                  <ShieldCheck size={18} />
                </div>

                <div className="hero-floating-text">
                  <strong>Safety Network</strong>
                  <span>Protected & connected</span>
                </div>
              </div>

              <div className="hero-floating-card bottom">
                <div className="hero-floating-icon">
                  <Users size={18} />
                </div>

                <div className="hero-floating-text">
                  <strong>Trusted Circle</strong>
                  <span>Connected & ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SAFETY COMMAND CENTER
            ===================================================== */}

        <section className="safety-section">
          <div className="container">
            <div className="safety-card">
              <div className="safety-header">
                <div className="safety-heading">
                  <div className="safety-heading-icon">
                    <ShieldCheck size={25} />
                  </div>

                  <div>
                    <div className="safety-kicker">SAFENET</div>

                    <h2>Safety Command Center</h2>

                    <p>
                      Your personal safety tools in one connected place.
                    </p>
                  </div>
                </div>

                <div className="safety-status">
                  <span className="safety-status-dot" />
                  Protected
                </div>
              </div>

              <p className="safety-command-description">
                Stay safe with quick access to the features that matter most
                when you are travelling, checking in, or facing an unsafe
                situation.
              </p>

              <div className="safety-action-grid">
                <button
                  className="safety-action sos"
                  type="button"
                  onClick={() => navigate("/sos")}
                >
                  <div className="safety-action-icon">
                    <Zap size={20} />
                  </div>

                  <div className="safety-action-content">
                    <strong>Emergency SOS</strong>
                    <span>Get emergency support quickly.</span>
                  </div>

                  <ChevronRight className="action-arrow" size={18} />
                </button>

                <button
                  className="safety-action"
                  type="button"
                  onClick={() => navigate("/journey")}
                >
                  <div className="safety-action-icon">
                    <Navigation size={20} />
                  </div>

                  <div className="safety-action-content">
                    <strong>Safe Journey</strong>
                    <span>Share your journey with trusted people.</span>
                  </div>

                  <ChevronRight className="action-arrow" size={18} />
                </button>

                <button
                  className="safety-action"
                  type="button"
                  onClick={() => navigate("/checkin")}
                >
                  <div className="safety-action-icon">
                    <Clock3 size={20} />
                  </div>

                  <div className="safety-action-content">
                    <strong>Check-In</strong>
                    <span>Let your contacts know you are safe.</span>
                  </div>

                  <ChevronRight className="action-arrow" size={18} />
                </button>

                <button
                  className="safety-action"
                  type="button"
                  onClick={() => navigate("/location")}
                >
                  <div className="safety-action-icon">
                    <MapPin size={20} />
                  </div>

                  <div className="safety-action-content">
                    <strong>Location Safety</strong>
                    <span>Use location tools when you need them.</span>
                  </div>

                  <ChevronRight className="action-arrow" size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
            ===================================================== */}

        <section className="section features" id="features">
          <div className="section-header">
            <div className="section-eyebrow">SAFETY TOOLS</div>

            <h2 className="section-title">
              Everything you need to stay safer.
            </h2>

            <p className="section-description">
              SAFENET combines essential safety tools and resources so you
              don't have to search for help when every second matters.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={21} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <button
                    className="feature-link"
                    type="button"
                    onClick={() => navigate(feature.path)}
                  >
                    {feature.link}
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            WHY CHOOSE SAFENET
            ===================================================== */}

        <section
          className="why-choose-section"
          id="why-safenet"
        >
          <div className="section-header">
            <div className="section-eyebrow">
              WHY SAFENET
            </div>

            <h2 className="section-title">
              Built around your safety.
            </h2>

            <p className="section-description">
              SAFENET is designed to make personal safety information,
              preparation and support easier to access when you need it.
            </p>
          </div>

          <div className="why-choose-grid">
            {whyChooseFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="why-choose-card"
                  key={item.title}
                >
                  <div className="why-choose-icon">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            SAFETY & RIGHTS
            ===================================================== */}

        <section
          className="rights-section"
          id="safety-rights"
        >
          <div className="rights-grid">
            <div className="rights-content">
              <div className="section-eyebrow">
                SAFETY & RIGHTS
              </div>

              <h2>
                Know your rights.
                <br />
                Protect your future.
              </h2>

              <p>
                SAFENET helps you access practical information about safety,
                documentation, support, and your rights when dealing with
                difficult or unsafe situations.
              </p>

              <div className="rights-list">
                <div className="right-item">
                  <div className="right-item-icon">
                    <CheckCircle2 size={14} />
                  </div>

                  <span>
                    Understand practical safety options for difficult
                    situations.
                  </span>
                </div>

                <div className="right-item">
                  <div className="right-item-icon">
                    <CheckCircle2 size={14} />
                  </div>

                  <span>
                    Organize important information and documentation for
                    future reference.
                  </span>
                </div>

                <div className="right-item">
                  <div className="right-item-icon">
                    <CheckCircle2 size={14} />
                  </div>

                  <span>
                    Find support resources and information that can help you
                    make informed decisions.
                  </span>
                </div>
              </div>

              <button
                className="hero-secondary-button"
                type="button"
                onClick={() => navigate("/rights")}
                style={{ marginTop: "28px" }}
              >
                Explore Safety & Rights
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="rights-card">
              <div className="rights-card-header">
                <div className="rights-card-icon">
                  <Scale size={22} />
                </div>

                <div>
                  <strong>Practical Safety Information</strong>

                  <span>
                    Information designed for difficult situations
                  </span>
                </div>
              </div>

              <div className="rights-items">
                <div className="rights-info-item">
                  <div className="rights-info-number">01</div>

                  <div>
                    <strong>Personal Safety</strong>

                    <p>
                      Learn practical ways to prepare for and respond to
                      unsafe situations.
                    </p>
                  </div>
                </div>

                <div className="rights-info-item">
                  <div className="rights-info-number">02</div>

                  <div>
                    <strong>Documentation</strong>

                    <p>
                      Keep useful records organized so important information
                      is easier to access later.
                    </p>
                  </div>
                </div>

                <div className="rights-info-item">
                  <div className="rights-info-number">03</div>

                  <div>
                    <strong>Support Resources</strong>

                    <p>
                      Find practical resources that can help you understand
                      your options and next steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
            ===================================================== */}

        <section
          className="how-it-works-section"
          id="how-it-works"
        >
          <div className="section-header">
            <div className="section-eyebrow">
              HOW IT WORKS
            </div>

            <h2 className="section-title">
              Simple when it matters most.
            </h2>

            <p className="section-description">
              Set up your safety network once and keep your essential safety
              tools organized in one place.
            </p>
          </div>

          <div className="how-it-works-grid">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  className="how-it-works-card"
                  key={step.number}
                >
                  <div className="step-top">
                    <span className="step-number">
                      {step.number}
                    </span>

                    <div className="step-icon">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            CTA
            ===================================================== */}

        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-icon">
              <ShieldCheck size={25} />
            </div>

            <div className="section-eyebrow">
              YOUR SAFETY MATTERS
            </div>

            <h2>
              Build your personal safety network today.
            </h2>

            <p>
              Create your SAFENET account and bring your essential safety
              tools, trusted contacts and resources together.
            </p>

            <div className="cta-actions">
              <button
                className="cta-button"
                type="button"
                onClick={() => navigate("/register")}
              >
                Get Started
                <ArrowRight size={17} />
              </button>

              <button
                className="cta-secondary"
                type="button"
                onClick={() => navigate("/login")}
              >
                Already have an account?
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="logo">
                <span className="logo-icon">
                  <Shield size={20} />
                </span>

                <span className="logo-text">
                  SAFENET<span>.</span>
                </span>
              </Link>

              <p>
                A personal safety network designed to help you stay
                connected, prepared and informed.
              </p>
            </div>

            <div className="footer-column">
              <h4>Safety</h4>

              <div className="footer-links">
                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/sos")}
                >
                  Emergency SOS
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/journey")}
                >
                  Safe Journey
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/checkin")}
                >
                  Check-In
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/location")}
                >
                  Location Safety
                </button>
              </div>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>

              <div className="footer-links">
                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/rights")}
                >
                  Rights
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/documentation")}
                >
                  Documentation
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/support-resources")}
                >
                  Support Resources
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/privacy")}
                >
                  Privacy
                </button>
              </div>
            </div>

            <div className="footer-column">
              <h4>Support</h4>

              <div className="footer-links">
                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/trusted-contacts")}
                >
                  Trusted Circle
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/help-someone")}
                >
                  Help Someone
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/online-safety")}
                >
                  Online Safety
                </button>

                <button
                  className="footer-link"
                  type="button"
                  onClick={() => navigate("/privacy")}
                >
                  Privacy & Settings
                </button>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} SAFENET. All rights reserved.
            </span>

            <div className="footer-bottom-links">
              <button
                className="footer-link"
                type="button"
                onClick={() => navigate("/privacy")}
              >
                Privacy
              </button>

              <button
                className="footer-link"
                type="button"
                onClick={() => navigate("/rights")}
              >
                Safety & Rights
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/sos" element={<SOS />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/location" element={<Location />} />

        <Route path="/rights" element={<Rights />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/domestic-safety"
          element={<DomesticSafety />}
        />

        <Route
          path="/evidence-vault"
          element={<EvidenceVault />}
        />

        <Route
          path="/trusted-contacts"
          element={<TrustedCircle />}
        />

        <Route
          path="/documentation"
          element={<Documentation />}
        />

        <Route
          path="/private-journal"
          element={<PrivateJournal />}
        />

        <Route
          path="/safety-planning"
          element={<SafetyPlanning />}
        />

        <Route
          path="/support-resources"
          element={<SupportResources />}
        />

        <Route
          path="/student-safety"
          element={<StudentSafety />}
        />

        <Route
          path="/workplace-safety"
          element={<WorkplaceSafety />}
        />

        <Route
          path="/online-safety"
          element={<OnlineSafety />}
        />

        <Route
          path="/help-someone"
          element={<HelpSomeone />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
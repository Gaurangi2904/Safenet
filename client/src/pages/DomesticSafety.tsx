import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Heart,
  HelpCircle,
  Home,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  ShieldCheck,
  Siren,
  Smartphone,
  Sun,
  Moon,
  Users,
  X,
  Zap,
} from "lucide-react";

import "./DomesticSafety.css";

type Theme = "dark" | "light";

type SafetyArea = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
};

type SafetyStep = {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("safenet-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

const safetyAreas: SafetyArea[] = [
  {
    id: "physical",
    title: "Physical abuse",
    description:
      "Physical violence or threats of physical harm can be serious safety concerns.",
    icon: <Shield size={22} />,
    examples: [
      "Hitting, pushing or kicking",
      "Choking or physical restraint",
      "Threats of physical harm",
      "Using an object to cause injury",
    ],
  },
  {
    id: "emotional",
    title: "Emotional or verbal abuse",
    description:
      "Repeated intimidation, humiliation or threatening behaviour can affect a person's safety and wellbeing.",
    icon: <Heart size={22} />,
    examples: [
      "Threatening or intimidating behaviour",
      "Repeated humiliation",
      "Insults intended to control or frighten",
      "Threats against family members",
    ],
  },
  {
    id: "economic",
    title: "Economic abuse",
    description:
      "Controlling access to money or financial resources may be an important part of an abuse situation.",
    icon: <Lock size={22} />,
    examples: [
      "Controlling access to money",
      "Preventing access to financial resources",
      "Taking or controlling important documents",
      "Interfering with financial independence",
    ],
  },
  {
    id: "control",
    title: "Controlling behaviour",
    description:
      "A pattern of threats, isolation or excessive control can create an unsafe environment.",
    icon: <Users size={22} />,
    examples: [
      "Isolating someone from trusted people",
      "Constant monitoring or intimidation",
      "Threatening to harm someone",
      "Restricting access to support",
    ],
  },
];

const safetySteps: SafetyStep[] = [
  {
    number: "01",
    title: "Move toward safety",
    description:
      "If immediate danger exists, move to a safer place if you can do so without increasing the risk.",
    icon: <ShieldCheck size={21} />,
  },
  {
    number: "02",
    title: "Contact emergency help",
    description:
      "For an immediate emergency in India, call 112 or use SAFENET's emergency access.",
    icon: <Siren size={21} />,
  },
  {
    number: "03",
    title: "Reach a trusted person",
    description:
      "Contact someone you trust and let them know what is happening if it is safe to communicate.",
    icon: <Users size={21} />,
  },
  {
    number: "04",
    title: "Preserve important information",
    description:
      "When safe, keep relevant messages, documents or incident details somewhere secure.",
    icon: <FileText size={21} />,
  },
];

function DomesticSafety() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>("01");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("safenet-theme", theme);
  }, [theme]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme");

      if (currentTheme === "light" || currentTheme === "dark") {
        setTheme(currentTheme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const selectedAreaData = useMemo(
    () => safetyAreas.find((area) => area.id === selectedArea) ?? null,
    [selectedArea]
  );

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const toggleStep = (number: string) => {
    setExpandedStep((current) => (current === number ? null : number));
  };

  return (
    <div className="domestic-page">
      {/* =========================
          HEADER
      ========================= */}
      <header className="domestic-header">
        <div className="domestic-header-inner">
          <button
            type="button"
            className="domestic-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <div className="domestic-brand">
            <div className="domestic-brand-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>Domestic Safety</span>
            </div>
          </div>

          <div className="domestic-header-actions">
            <button
              type="button"
              className="domestic-theme-button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <button
              type="button"
              className="domestic-emergency-button"
              onClick={() => setShowEmergency(true)}
            >
              <Zap size={17} />
              Emergency
            </button>
          </div>
        </div>
      </header>

      <main className="domestic-main">
        {/* =========================
            HERO
        ========================= */}
        <section className="domestic-hero">
          <div className="domestic-hero-content">
            <div className="domestic-eyebrow">
              <ShieldCheck size={15} />
              DOMESTIC SAFETY SUPPORT
            </div>

            <h1>
              You deserve to feel
              <span>safe at home.</span>
            </h1>

            <p>
              Understand warning signs, plan for safer situations, protect
              important information, and find official support resources.
            </p>

            <div className="domestic-hero-actions">
              <button
                type="button"
                className="domestic-primary-button"
                onClick={() => setShowSafetyPlan(true)}
              >
                <Shield size={18} />
                Create a Safety Plan
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="domestic-secondary-button"
                onClick={() => setShowEmergency(true)}
              >
                <Phone size={17} />
                Get Help Now
              </button>
            </div>

            <div className="domestic-hero-trust">
              <div>
                <CheckCircle2 size={16} />
                <span>Private by design</span>
              </div>

              <div>
                <CheckCircle2 size={16} />
                <span>Safety-focused guidance</span>
              </div>

              <div>
                <CheckCircle2 size={16} />
                <span>Official resources</span>
              </div>
            </div>
          </div>

          <div className="domestic-hero-card">
            <div className="domestic-hero-card-top">
              <div className="domestic-card-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <span>SAFENET SAFETY CHECK</span>
                <strong>Your safety comes first</strong>
              </div>

              <div className="domestic-active-dot" />
            </div>

            <div className="domestic-safety-meter">
              <div className="domestic-meter-ring">
                <ShieldCheck size={31} />
              </div>

              <div>
                <strong>Safety resources ready</strong>
                <span>
                  Emergency help, trusted contacts and safety planning are
                  available from SAFENET.
                </span>
              </div>
            </div>

            <div className="domestic-quick-actions">
              <button
                type="button"
                onClick={() => setShowEmergency(true)}
              >
                <Siren size={17} />
                <span>Emergency</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/rights")}
              >
                <BookOpen size={17} />
                <span>Know Your Rights</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/checkin")}
              >
                <Clock3 size={17} />
                <span>Check-In</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================
            IMPORTANT NOTICE
        ========================= */}
        <section className="domestic-notice">
          <div className="domestic-notice-icon">
            <AlertTriangle size={21} />
          </div>

          <div>
            <strong>If you are in immediate danger</strong>
            <p>
              Move to a safer place if possible and contact emergency
              services. In India, emergency assistance is available through
              112.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowEmergency(true)}
          >
            Emergency Help
            <ArrowRight size={16} />
          </button>
        </section>

        {/* =========================
            UNDERSTANDING ABUSE
        ========================= */}
        <section className="domestic-section">
          <div className="domestic-section-heading">
            <div>
              <span className="domestic-section-label">
                UNDERSTANDING DOMESTIC ABUSE
              </span>

              <h2>
                Abuse is not limited
                <span>to physical violence.</span>
              </h2>

              <p>
                Domestic safety concerns can take different forms. Recognising
                patterns can help someone decide what support they may need.
              </p>
            </div>

            <div className="domestic-section-badge">
              <Shield size={18} />
              Safety awareness
            </div>
          </div>

          <div className="domestic-area-grid">
            {safetyAreas.map((area) => (
              <button
                key={area.id}
                type="button"
                className="domestic-area-card"
                onClick={() => setSelectedArea(area.id)}
              >
                <div className={`domestic-area-icon ${area.id}`}>
                  {area.icon}
                </div>

                <div className="domestic-area-content">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>

                <div className="domestic-area-arrow">
                  <ArrowRight size={17} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* =========================
            WHAT YOU CAN DO
        ========================= */}
        <section className="domestic-section domestic-action-section">
          <div className="domestic-section-heading">
            <div>
              <span className="domestic-section-label">
                WHEN SOMETHING FEELS UNSAFE
              </span>

              <h2>
                Small safety steps
                <span>can make a difference.</span>
              </h2>

              <p>
                There is no single correct response. Choose actions that are
                appropriate and safe for your situation.
              </p>
            </div>
          </div>

          <div className="domestic-steps">
            {safetySteps.map((step) => {
              const isExpanded = expandedStep === step.number;

              return (
                <div
                  key={step.number}
                  className={`domestic-step ${
                    isExpanded ? "expanded" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="domestic-step-header"
                    onClick={() => toggleStep(step.number)}
                  >
                    <div className="domestic-step-number">
                      {step.number}
                    </div>

                    <div className="domestic-step-icon">
                      {step.icon}
                    </div>

                    <div className="domestic-step-title">
                      <strong>{step.title}</strong>
                      <span>
                        {isExpanded
                          ? "Tap to collapse"
                          : "Tap to learn more"}
                      </span>
                    </div>

                    <div className="domestic-step-chevron">
                      {isExpanded ? (
                        <ChevronUp size={19} />
                      ) : (
                        <ChevronDown size={19} />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="domestic-step-body">
                      <p>{step.description}</p>

                      {step.number === "01" && (
                        <div className="domestic-step-note">
                          <MapPin size={16} />
                          Consider a trusted public place, neighbour,
                          workplace, college or other safer location when
                          appropriate.
                        </div>
                      )}

                      {step.number === "02" && (
                        <div className="domestic-step-note emergency">
                          <Phone size={16} />
                          Emergency number in India: <strong>112</strong>
                        </div>
                      )}

                      {step.number === "03" && (
                        <div className="domestic-step-note">
                          <Users size={16} />
                          SAFENET Trusted Circle can be used to organise
                          people you choose to rely on.
                        </div>
                      )}

                      {step.number === "04" && (
                        <div className="domestic-step-note">
                          <Lock size={16} />
                          Store sensitive information only where you can
                          access it safely.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================
            SAFETY PLANNING
        ========================= */}
        <section className="domestic-plan-section">
          <div className="domestic-plan-visual">
            <div className="domestic-plan-window">
              <div className="domestic-plan-window-header">
                <div className="domestic-window-dots">
                  <span />
                  <span />
                  <span />
                </div>

                <span>SAFENET / SAFETY PLAN</span>
              </div>

              <div className="domestic-plan-checklist">
                <div className="checked">
                  <CheckCircle2 size={18} />
                  <span>Trusted person identified</span>
                </div>

                <div className="checked">
                  <CheckCircle2 size={18} />
                  <span>Emergency number available</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Safer place considered</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Important information secured</span>
                </div>
              </div>
            </div>
          </div>

          <div className="domestic-plan-content">
            <span className="domestic-section-label">
              PERSONAL SAFETY PLAN
            </span>

            <h2>
              Prepare before
              <span>you need it.</span>
            </h2>

            <p>
              A safety plan can help organise practical steps, trusted people
              and important resources before an emergency happens.
            </p>

            <div className="domestic-plan-points">
              <div>
                <CheckCircle2 size={17} />
                <span>Identify people you can safely contact.</span>
              </div>

              <div>
                <CheckCircle2 size={17} />
                <span>Think about safer places you could reach.</span>
              </div>

              <div>
                <CheckCircle2 size={17} />
                <span>Keep important documents and information accessible.</span>
              </div>

              <div>
                <CheckCircle2 size={17} />
                <span>Know how to reach emergency and support services.</span>
              </div>
            </div>

            <button
              type="button"
              className="domestic-outline-button"
              onClick={() => setShowSafetyPlan(true)}
            >
              Open Safety Planner
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* =========================
            RIGHTS CONNECTION
        ========================= */}
        <section className="domestic-rights-card">
          <div className="domestic-rights-icon">
            <BookOpen size={23} />
          </div>

          <div className="domestic-rights-content">
            <span>KNOW YOUR RIGHTS</span>

            <h2>
              Learn about legal protections
              <span>without legal jargon.</span>
            </h2>

            <p>
              SAFENET's Women&apos;s Rights &amp; Laws section provides
              general information and links to official sources.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/rights")}
          >
            Explore Rights
            <ArrowRight size={17} />
          </button>
        </section>

        {/* =========================
            SUPPORT RESOURCES
        ========================= */}
        <section className="domestic-section">
          <div className="domestic-section-heading">
            <div>
              <span className="domestic-section-label">
                OFFICIAL SUPPORT
              </span>

              <h2>
                You do not have to
                <span>figure everything out alone.</span>
              </h2>

              <p>
                Government support services can help connect women with
                emergency assistance, information and specialised support.
              </p>
            </div>
          </div>

          <div className="domestic-resource-grid">
            <div className="domestic-resource-card emergency-resource">
              <div className="domestic-resource-icon">
                <Siren size={21} />
              </div>

              <div>
                <span>EMERGENCY</span>
                <h3>112</h3>
                <p>
                  India's emergency response number for situations requiring
                  immediate assistance.
                </p>
              </div>

              <a href="tel:112" className="domestic-resource-button">
                <Phone size={16} />
                Call 112
              </a>
            </div>

            <div className="domestic-resource-card">
              <div className="domestic-resource-icon">
                <Heart size={21} />
              </div>

              <div>
                <span>WOMEN HELPLINE</span>
                <h3>181</h3>
                <p>
                  Women Helpline provides support and information and can
                  connect callers with relevant services.
                </p>
              </div>

              <a href="tel:181" className="domestic-resource-button">
                <Phone size={16} />
                Call 181
              </a>
            </div>

            <div className="domestic-resource-card">
              <div className="domestic-resource-icon">
                <Home size={21} />
              </div>

              <div>
                <span>ONE STOP CENTRES</span>
                <h3>Integrated support</h3>
                <p>
                  One Stop Centres can provide access to services including
                  medical, legal, temporary shelter, police assistance and
                  counselling.
                </p>
              </div>

              <button
                type="button"
                className="domestic-resource-button"
                onClick={() => setShowEmergency(true)}
              >
                <MapPin size={16} />
                Support options
              </button>
            </div>
          </div>
        </section>

        {/* =========================
            PRIVATE NOTE
        ========================= */}
        <section className="domestic-privacy-card">
          <div className="domestic-privacy-icon">
            <Lock size={21} />
          </div>

          <div>
            <strong>Privacy matters</strong>
            <p>
              If someone else can access your phone or account, consider
              whether viewing safety information could put you at additional
              risk. Use SAFENET features only when it is safe to do so.
            </p>
          </div>

          <Smartphone size={22} />
        </section>

        {/* =========================
            FOOTER ACTIONS
        ========================= */}
        <section className="domestic-bottom-actions">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <button
            type="button"
            className="danger"
            onClick={() => setShowEmergency(true)}
          >
            <Zap size={17} />
            Emergency Support
          </button>
        </section>
      </main>

      {/* =========================
          AREA MODAL
      ========================= */}
      {selectedAreaData && (
        <div
          className="domestic-modal-overlay"
          onClick={() => setSelectedArea(null)}
        >
          <div
            className="domestic-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="domestic-modal-close"
              onClick={() => setSelectedArea(null)}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="domestic-modal-icon">
              {selectedAreaData.icon}
            </div>

            <span className="domestic-modal-label">
              SAFETY AWARENESS
            </span>

            <h2>{selectedAreaData.title}</h2>

            <p>{selectedAreaData.description}</p>

            <div className="domestic-example-list">
              <strong>Examples may include:</strong>

              {selectedAreaData.examples.map((example) => (
                <div key={example}>
                  <CheckCircle2 size={16} />
                  <span>{example}</span>
                </div>
              ))}
            </div>

            <div className="domestic-modal-note">
              <HelpCircle size={17} />
              <span>
                This information is for general awareness and does not replace
                advice from a qualified legal or support professional.
              </span>
            </div>

            <div className="domestic-modal-actions">
              <button
                type="button"
                onClick={() => {
                  setSelectedArea(null);
                  setShowEmergency(true);
                }}
              >
                Get Support
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setSelectedArea(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          EMERGENCY MODAL
      ========================= */}
      {showEmergency && (
        <div
          className="domestic-modal-overlay"
          onClick={() => setShowEmergency(false)}
        >
          <div
            className="domestic-modal emergency-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="domestic-modal-close"
              onClick={() => setShowEmergency(false)}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="domestic-emergency-modal-icon">
              <Siren size={27} />
            </div>

            <span className="domestic-modal-label">
              NEED HELP NOW?
            </span>

            <h2>Choose the safest next step.</h2>

            <p>
              If you are in immediate danger, use emergency services. If you
              are seeking information or support, women&apos;s helpline
              services may also be available.
            </p>

            <div className="domestic-emergency-options">
              <a href="tel:112" className="domestic-emergency-option primary">
                <div>
                  <Siren size={21} />
                </div>

                <span>
                  <strong>112</strong>
                  <small>Emergency response</small>
                </span>

                <Phone size={17} />
              </a>

              <a href="tel:181" className="domestic-emergency-option">
                <div>
                  <Heart size={21} />
                </div>

                <span>
                  <strong>181</strong>
                  <small>Women Helpline</small>
                </span>

                <Phone size={17} />
              </a>
            </div>

            <div className="domestic-emergency-extra">
              <MessageCircle size={17} />

              <span>
                SAFENET can also help you organise your Trusted Circle and
                safety tools.
              </span>
            </div>

            <div className="domestic-modal-actions">
              <button
                type="button"
                onClick={() => {
                  setShowEmergency(false);
                  navigate("/sos");
                }}
              >
                Open SAFENET SOS
                <Zap size={16} />
              </button>

              <button
                type="button"
                onClick={() => setShowEmergency(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          SAFETY PLAN MODAL
      ========================= */}
      {showSafetyPlan && (
        <div
          className="domestic-modal-overlay"
          onClick={() => setShowSafetyPlan(false)}
        >
          <div
            className="domestic-modal plan-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="domestic-modal-close"
              onClick={() => setShowSafetyPlan(false)}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="domestic-modal-icon">
              <ShieldCheck size={25} />
            </div>

            <span className="domestic-modal-label">
              QUICK SAFETY PLANNER
            </span>

            <h2>Think through your next steps.</h2>

            <p>
              Use these prompts to prepare a personal plan. Do not save or
              record anything if doing so could put you at greater risk.
            </p>

            <div className="domestic-plan-modal-list">
              <div>
                <span>01</span>
                <strong>Who can I contact safely?</strong>
              </div>

              <div>
                <span>02</span>
                <strong>Where could I go if I need space?</strong>
              </div>

              <div>
                <span>03</span>
                <strong>How can I access emergency help?</strong>
              </div>

              <div>
                <span>04</span>
                <strong>Which important information should I protect?</strong>
              </div>

              <div>
                <span>05</span>
                <strong>What should I do if communication is unsafe?</strong>
              </div>
            </div>

            <div className="domestic-modal-note">
              <Lock size={17} />
              <span>
                SAFENET currently presents these as planning prompts. Personal
                plan storage can be connected to a secure backend later.
              </span>
            </div>

            <div className="domestic-modal-actions">
              <button
                type="button"
                onClick={() => setShowSafetyPlan(false)}
              >
                I Understand
                <CheckCircle2 size={16} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSafetyPlan(false);
                  navigate("/trusted-contacts");
                }}
              >
                Trusted Circle
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DomesticSafety;
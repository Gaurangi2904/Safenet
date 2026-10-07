import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  FileText,
  HeartHandshake,
  Lock,
  MessageCircle,
  Moon,
  Phone,
  Shield,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";

import "./WorkplaceSafety.css";

type SafetyTopic = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: string[];
};

const topics: SafetyTopic[] = [
  {
    id: "harassment",
    title: "Workplace Harassment",
    description:
      "Understand practical steps when workplace behaviour becomes unwanted, uncomfortable, threatening, or inappropriate.",
    icon: <Shield size={22} />,
    points: [
      "Prioritise your personal safety and move away from unsafe situations when possible.",
      "Tell someone you trust about what happened.",
      "Keep relevant messages, emails, screenshots, dates, and other records.",
      "Use an appropriate workplace complaint or support channel.",
    ],
  },
  {
    id: "posh",
    title: "POSH & Workplace Support",
    description:
      "Learn how to organise information and identify appropriate workplace channels when dealing with sexual harassment concerns.",
    icon: <BriefcaseBusiness size={22} />,
    points: [
      "Record what happened, including dates, locations, and relevant communication.",
      "Keep copies of information that may help explain the situation.",
      "Identify the appropriate internal workplace support or complaint channel.",
      "Consider trusted personal or professional support when needed.",
    ],
  },
  {
    id: "digital",
    title: "Digital Workplace Abuse",
    description:
      "Handle unwanted messages, inappropriate communication, impersonation, or harassment through workplace technology.",
    icon: <MessageCircle size={22} />,
    points: [
      "Preserve relevant emails, messages, screenshots, and account information.",
      "Avoid sharing passwords or authentication codes.",
      "Review your account and device security settings.",
      "Use appropriate reporting channels for serious or repeated abuse.",
    ],
  },
  {
    id: "retaliation",
    title: "Pressure & Retaliation Concerns",
    description:
      "Keep organised records if you experience pressure, intimidation, or concerning changes after raising a workplace issue.",
    icon: <AlertTriangle size={22} />,
    points: [
      "Keep a factual record of relevant events.",
      "Save work-related communication that may be important.",
      "Avoid deleting information that could help establish a timeline.",
      "Seek appropriate support if you feel threatened or unsafe.",
    ],
  },
  {
    id: "documentation",
    title: "Documenting an Incident",
    description:
      "Create a clear personal record without relying on memory alone.",
    icon: <FileText size={22} />,
    points: [
      "Write down what happened as soon as reasonably possible.",
      "Record the date, approximate time, location, and people involved.",
      "Keep relevant emails, messages, documents, or screenshots.",
      "Store important information somewhere you can access safely.",
    ],
  },
  {
    id: "support",
    title: "Getting Support",
    description:
      "You can seek support even when you are still deciding what you want to do next.",
    icon: <HeartHandshake size={22} />,
    points: [
      "Talk to someone you trust.",
      "Identify an appropriate workplace support or grievance channel.",
      "Consider professional or legal support when appropriate.",
      "Contact emergency services if you face immediate danger.",
    ],
  },
];

export default function WorkplaceSafety() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("safenet-theme") === "dark";
  });

  const [search, setSearch] = useState("");
  const [openTopic, setOpenTopic] = useState<string | null>("harassment");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("safenet-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setDarkMode(savedTheme === "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = darkMode ? "light" : "dark";

    setDarkMode(!darkMode);
    localStorage.setItem("safenet-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return topics;
    }

    return topics.filter((topic) => {
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.points.some((point) =>
          point.toLowerCase().includes(query)
        )
      );
    });
  }, [search]);

  const toggleTopic = (id: string) => {
    setOpenTopic((current) => (current === id ? null : id));
  };

  return (
    <div className="workplace-safety-page">
      <header className="workplace-safety-header">
        <div className="workplace-safety-header-inner">
          <button
            className="workplace-safety-back"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="workplace-safety-brand">
            <div className="workplace-safety-brand-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>Workplace Safety</span>
            </div>
          </div>

          <button
            className="workplace-safety-theme"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <main className="workplace-safety-main">
        <section className="workplace-safety-hero">
          <div className="workplace-safety-hero-icon">
            <BriefcaseBusiness size={30} />
          </div>

          <div className="workplace-safety-hero-content">
            <span className="workplace-safety-eyebrow">
              WORKPLACE SAFETY
            </span>

            <h1>Know your options. Protect your boundaries.</h1>

            <p>
              Practical guidance for workplace harassment,
              documentation, digital abuse, support, and safer
              reporting decisions.
            </p>

            <div className="workplace-safety-hero-pills">
              <span>
                <Lock size={14} />
                Private by design
              </span>

              <span>
                <FileText size={14} />
                Documentation focused
              </span>

              <span>
                <HeartHandshake size={14} />
                Support focused
              </span>
            </div>
          </div>
        </section>

        <section className="workplace-safety-alert">
          <div className="workplace-safety-alert-icon">
            <AlertTriangle size={21} />
          </div>

          <div>
            <strong>If you are in immediate danger</strong>

            <p>
              Move to a safer place if possible and contact emergency
              services or someone you trust.
            </p>
          </div>

          <button
            className="workplace-safety-emergency-button"
            onClick={() => {
              window.location.href = "tel:112";
            }}
            type="button"
          >
            <Phone size={17} />
            Call 112
          </button>
        </section>

        <section className="workplace-safety-action-grid">
          <button
            className="workplace-safety-action-card"
            onClick={() => navigate("/documentation")}
            type="button"
          >
            <div className="workplace-safety-action-icon">
              <FileText size={21} />
            </div>

            <div>
              <strong>Document an Incident</strong>
              <span>
                Keep important information organised.
              </span>
            </div>
          </button>

          <button
            className="workplace-safety-action-card"
            onClick={() => navigate("/trusted-contacts")}
            type="button"
          >
            <div className="workplace-safety-action-icon">
              <Users size={21} />
            </div>

            <div>
              <strong>Trusted Circle</strong>
              <span>
                Keep people you trust close.
              </span>
            </div>
          </button>

          <button
            className="workplace-safety-action-card"
            onClick={() => navigate("/support-resources")}
            type="button"
          >
            <div className="workplace-safety-action-icon">
              <HeartHandshake size={21} />
            </div>

            <div>
              <strong>Support Resources</strong>
              <span>
                Access important support options.
              </span>
            </div>
          </button>
        </section>

        <section className="workplace-safety-section">
          <div className="workplace-safety-section-heading">
            <div>
              <span className="workplace-safety-section-label">
                WORKPLACE GUIDE
              </span>

              <h2>Situations you may face</h2>

              <p>
                Select a topic to see practical steps and support
                options.
              </p>
            </div>

            <div className="workplace-safety-count">
              <CheckCircle2 size={17} />
              <span>{topics.length} topics</span>
            </div>
          </div>

          <div className="workplace-safety-search">
            <CircleHelp size={18} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search workplace safety topics..."
              type="search"
            />
          </div>

          <div className="workplace-safety-topics">
            {filteredTopics.length === 0 ? (
              <div className="workplace-safety-empty">
                <CircleHelp size={24} />

                <strong>No matching topics</strong>

                <span>
                  Try a different search term.
                </span>
              </div>
            ) : (
              filteredTopics.map((topic) => {
                const isOpen = openTopic === topic.id;

                return (
                  <article
                    className={`workplace-safety-topic ${
                      isOpen ? "is-open" : ""
                    }`}
                    key={topic.id}
                  >
                    <button
                      className="workplace-safety-topic-header"
                      onClick={() => toggleTopic(topic.id)}
                      type="button"
                    >
                      <div className="workplace-safety-topic-icon">
                        {topic.icon}
                      </div>

                      <div className="workplace-safety-topic-title">
                        <strong>{topic.title}</strong>

                        <span>{topic.description}</span>
                      </div>

                      <div className="workplace-safety-topic-chevron">
                        {isOpen ? (
                          <ChevronUp size={19} />
                        ) : (
                          <ChevronDown size={19} />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="workplace-safety-topic-body">
                        <h3>What you can do</h3>

                        <ul>
                          {topic.points.map((point) => (
                            <li key={point}>
                              <CheckCircle2 size={17} />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="workplace-safety-note">
          <div className="workplace-safety-note-icon">
            <Shield size={23} />
          </div>

          <div>
            <span>IMPORTANT</span>

            <h2>Keep your records factual and organised.</h2>

            <p>
              SAFENET provides general safety guidance and organisation
              tools. Workplace procedures can differ between
              organisations, so use the appropriate official support
              channel for your situation.
            </p>
          </div>
        </section>

        <section className="workplace-safety-support">
          <div className="workplace-safety-support-icon">
            <HeartHandshake size={25} />
          </div>

          <div className="workplace-safety-support-content">
            <span>YOU DESERVE SUPPORT</span>

            <h2>
              You don't have to handle a difficult workplace situation
              alone.
            </h2>

            <p>
              If something is making you feel unsafe, uncomfortable,
              threatened, or pressured, reaching out to someone you
              trust can be an important first step.
            </p>
          </div>

          <button
            className="workplace-safety-support-button"
            onClick={() => setShowHelp(true)}
            type="button"
          >
            <CircleHelp size={18} />
            What can I do?
          </button>
        </section>
      </main>

      {showHelp && (
        <div
          className="workplace-safety-modal-backdrop"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="workplace-safety-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="workplace-safety-modal-icon">
              <HeartHandshake size={25} />
            </div>

            <h2>Start with your safety</h2>

            <p>
              If you are dealing with an unsafe or uncomfortable
              workplace situation, consider these steps:
            </p>

            <ol>
              <li>
                Move somewhere safer when possible.
              </li>

              <li>
                Contact someone you trust.
              </li>

              <li>
                Keep relevant information and evidence.
              </li>

              <li>
                Identify an appropriate workplace support channel.
              </li>

              <li>
                Consider professional support when appropriate.
              </li>

              <li>
                Call emergency services if you are in immediate danger.
              </li>
            </ol>

            <div className="workplace-safety-modal-actions">
              <button
                className="workplace-safety-modal-secondary"
                onClick={() => setShowHelp(false)}
                type="button"
              >
                Close
              </button>

              <button
                className="workplace-safety-modal-primary"
                onClick={() => {
                  setShowHelp(false);
                  navigate("/trusted-contacts");
                }}
                type="button"
              >
                <Users size={17} />
                Trusted Circle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
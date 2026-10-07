import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  GraduationCap,
  HeartHandshake,
  Lock,
  MessageCircle,
  Moon,
  Phone,
  Shield,
  ShieldCheck,
  Siren,
  Sun,
  Users,
} from "lucide-react";

import "./StudentSafety.css";

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
    title: "College Harassment",
    description:
      "Understand what to do when someone repeatedly makes you uncomfortable, threatens you, or crosses personal boundaries.",
    icon: <Shield size={22} />,
    points: [
      "Move to a safer or more public location if you feel unsafe.",
      "Tell someone you trust about what happened.",
      "Keep important messages, screenshots, dates, and other records.",
      "Use your college's appropriate support or complaint channel.",
    ],
  },
  {
    id: "bullying",
    title: "Bullying & Intimidation",
    description:
      "Practical steps for situations involving repeated insults, intimidation, exclusion, threats, or harmful behaviour.",
    icon: <Users size={22} />,
    points: [
      "Do not feel pressured to handle serious threats alone.",
      "Stay around people you trust when possible.",
      "Document repeated incidents and relevant communication.",
      "Reach out to a trusted faculty member, student support team, or family member.",
    ],
  },
  {
    id: "ragging",
    title: "Ragging & Abuse",
    description:
      "Know how to respond if college activities become humiliating, threatening, coercive, or abusive.",
    icon: <GraduationCap size={22} />,
    points: [
      "Prioritise your immediate safety.",
      "Leave the situation when you can do so safely.",
      "Contact a trusted person and appropriate college authorities.",
      "Keep evidence that may help explain what happened.",
    ],
  },
  {
    id: "online",
    title: "Online & Social Media Safety",
    description:
      "Protect yourself when harassment, threats, impersonation, unwanted contact, or private content moves online.",
    icon: <MessageCircle size={22} />,
    points: [
      "Avoid sharing passwords or sensitive account information.",
      "Save threatening or abusive messages before blocking an account.",
      "Review account privacy and security settings.",
      "Use appropriate reporting channels when online abuse occurs.",
    ],
  },
  {
    id: "public",
    title: "Campus & Public Safety",
    description:
      "Simple precautions for travelling around campus, commuting, attending events, or being in unfamiliar places.",
    icon: <ShieldCheck size={22} />,
    points: [
      "Keep your phone charged when travelling.",
      "Let someone you trust know about important travel plans.",
      "Prefer well-lit and populated areas when possible.",
      "Trust your instincts and move away from situations that feel unsafe.",
    ],
  },
  {
    id: "support",
    title: "Getting Support",
    description:
      "You do not have to wait until a situation becomes an emergency before asking for help.",
    icon: <HeartHandshake size={22} />,
    points: [
      "Talk to a trusted friend, family member, faculty member, or support person.",
      "Use your institution's student support or grievance mechanism.",
      "Consider professional or legal support when appropriate.",
      "Call emergency services if you face immediate danger.",
    ],
  },
];

const quickActions = [
  {
    title: "Emergency",
    description: "Immediate danger or urgent help",
    icon: <Siren size={20} />,
    action: "112",
  },
  {
    title: "Trusted Person",
    description: "Contact someone you trust",
    icon: <Phone size={20} />,
    action: "trusted",
  },
];

export default function StudentSafety() {
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

  const handleQuickAction = (action: string) => {
    if (action === "112") {
      window.location.href = "tel:112";
      return;
    }

    if (action === "trusted") {
      navigate("/trusted-contacts");
    }
  };

  return (
    <div className="student-safety-page">
      <header className="student-safety-header">
        <div className="student-safety-header-inner">
          <button
            className="student-safety-back"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="student-safety-brand">
            <div className="student-safety-brand-icon">
              <ShieldCheck size={21} />
            </div>
            <div>
              <strong>SAFENET</strong>
              <span>Student Safety</span>
            </div>
          </div>

          <button
            className="student-safety-theme"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <main className="student-safety-main">
        <section className="student-safety-hero">
          <div className="student-safety-hero-icon">
            <GraduationCap size={30} />
          </div>

          <div className="student-safety-hero-content">
            <span className="student-safety-eyebrow">
              CAMPUS & STUDENT SAFETY
            </span>

            <h1>Know your options. Stay safer.</h1>

            <p>
              Practical guidance for harassment, bullying, ragging,
              online abuse, and unsafe situations during student life.
            </p>

            <div className="student-safety-hero-pills">
              <span>
                <Lock size={14} />
                Private by design
              </span>

              <span>
                <BookOpen size={14} />
                Practical guidance
              </span>

              <span>
                <HeartHandshake size={14} />
                Support focused
              </span>
            </div>
          </div>
        </section>

        <section className="student-safety-alert">
          <div className="student-safety-alert-icon">
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
            className="student-safety-emergency-button"
            onClick={() => (window.location.href = "tel:112")}
            type="button"
          >
            <Phone size={17} />
            Call 112
          </button>
        </section>

        <section className="student-safety-quick-grid">
          {quickActions.map((item) => (
            <button
              className="student-safety-quick-card"
              key={item.title}
              onClick={() => handleQuickAction(item.action)}
              type="button"
            >
              <div className="student-safety-quick-icon">
                {item.icon}
              </div>

              <div>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
            </button>
          ))}
        </section>

        <section className="student-safety-section">
          <div className="student-safety-section-heading">
            <div>
              <span className="student-safety-section-label">
                SAFETY GUIDE
              </span>
              <h2>Situations you may face</h2>
              <p>
                Select a topic to see practical steps and support
                options.
              </p>
            </div>

            <div className="student-safety-count">
              <CheckCircle2 size={17} />
              <span>{topics.length} topics</span>
            </div>
          </div>

          <div className="student-safety-search">
            <CircleHelp size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student safety topics..."
              type="search"
            />
          </div>

          <div className="student-safety-topics">
            {filteredTopics.length === 0 ? (
              <div className="student-safety-empty">
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
                    className={`student-safety-topic ${
                      isOpen ? "is-open" : ""
                    }`}
                    key={topic.id}
                  >
                    <button
                      className="student-safety-topic-header"
                      onClick={() => toggleTopic(topic.id)}
                      type="button"
                    >
                      <div className="student-safety-topic-icon">
                        {topic.icon}
                      </div>

                      <div className="student-safety-topic-title">
                        <strong>{topic.title}</strong>
                        <span>{topic.description}</span>
                      </div>

                      <div className="student-safety-topic-chevron">
                        {isOpen ? (
                          <ChevronUp size={19} />
                        ) : (
                          <ChevronDown size={19} />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="student-safety-topic-body">
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

        <section className="student-safety-support">
          <div className="student-safety-support-icon">
            <HeartHandshake size={25} />
          </div>

          <div className="student-safety-support-content">
            <span>YOU DESERVE SUPPORT</span>
            <h2>You don't have to handle everything alone.</h2>
            <p>
              If something is making you feel unsafe, uncomfortable,
              threatened, or pressured, reaching out to someone you
              trust can be an important first step.
            </p>
          </div>

          <button
            className="student-safety-support-button"
            onClick={() => setShowHelp(true)}
            type="button"
          >
            <CircleHelp size={18} />
            What can I do?
          </button>
        </section>

        <section className="student-safety-tools">
          <div>
            <span className="student-safety-section-label">
              SAFENET TOOLS
            </span>
            <h2>Keep your support close</h2>
            <p>
              Use SAFENET tools alongside your own trusted support
              network.
            </p>
          </div>

          <div className="student-safety-tool-grid">
            <button
              className="student-safety-tool"
              onClick={() => navigate("/trusted-contacts")}
              type="button"
            >
              <Users size={20} />
              <span>
                <strong>Trusted Circle</strong>
                <small>Manage people you trust.</small>
              </span>
            </button>

            <button
              className="student-safety-tool"
              onClick={() => navigate("/documentation")}
              type="button"
            >
              <BookOpen size={20} />
              <span>
                <strong>Documentation</strong>
                <small>Keep useful records organised.</small>
              </span>
            </button>

            <button
              className="student-safety-tool"
              onClick={() => navigate("/support-resources")}
              type="button"
            >
              <HeartHandshake size={20} />
              <span>
                <strong>Support Resources</strong>
                <small>Access important support options.</small>
              </span>
            </button>
          </div>
        </section>
      </main>

      {showHelp && (
        <div
          className="student-safety-modal-backdrop"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="student-safety-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="student-safety-modal-icon">
              <HeartHandshake size={25} />
            </div>

            <h2>Start with your safety</h2>

            <p>
              If you are dealing with an unsafe or uncomfortable
              situation, consider these steps:
            </p>

            <ol>
              <li>Move somewhere safer when possible.</li>
              <li>Contact someone you trust.</li>
              <li>Keep relevant information or evidence.</li>
              <li>Use an appropriate support or reporting channel.</li>
              <li>Call emergency services if you are in immediate danger.</li>
            </ol>

            <div className="student-safety-modal-actions">
              <button
                className="student-safety-modal-secondary"
                onClick={() => setShowHelp(false)}
                type="button"
              >
                Close
              </button>

              <button
                className="student-safety-modal-primary"
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
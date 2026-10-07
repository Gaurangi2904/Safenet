import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
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
  Sun,
  Users,
} from "lucide-react";

import "./HelpSomeone.css";

type HelpTopic = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  points: string[];
};

const topics: HelpTopic[] = [
  {
    id: "listen",
    title: "Listen Without Judging",
    description:
      "Create a supportive space where the person can speak without feeling blamed or pressured.",
    icon: <HeartHandshake size={22} />,
    points: [
      "Listen calmly and allow them to explain what happened.",
      "Take their concerns seriously.",
      "Avoid blaming them for what happened.",
      "Let them decide how much they are comfortable sharing.",
    ],
  },
  {
    id: "safety",
    title: "Focus on Immediate Safety",
    description:
      "When someone may be in immediate danger, safety should come before everything else.",
    icon: <Shield size={22} />,
    points: [
      "Ask whether they are currently somewhere safe.",
      "Help them move to a safer place if possible.",
      "Contact a trusted person who can provide immediate support.",
      "Call emergency services when there is an immediate threat to life or physical safety.",
    ],
  },
  {
    id: "avoid",
    title: "What to Avoid Saying",
    description:
      "Certain reactions can unintentionally make someone feel blamed, isolated, or afraid to ask for help again.",
    icon: <MessageCircle size={22} />,
    points: [
      "Avoid asking why they did not leave or fight back.",
      "Do not suggest that the situation is their fault.",
      "Avoid forcing them to confront the person involved.",
      "Do not pressure them to make a decision before they are ready.",
    ],
  },
  {
    id: "evidence",
    title: "Help Preserve Evidence",
    description:
      "If documentation may be useful later, help the person keep relevant information organised.",
    icon: <FileText size={22} />,
    points: [
      "Help record dates, times, locations, usernames, or other relevant details.",
      "Keep screenshots and important records in a safe location.",
      "Avoid unnecessarily forwarding sensitive photographs, videos, or messages.",
      "Use SAFENET documentation or Evidence Vault tools when appropriate.",
    ],
  },
  {
    id: "trusted",
    title: "Build a Support Circle",
    description:
      "A person may feel less isolated when they know there are people they can contact.",
    icon: <Users size={22} />,
    points: [
      "Ask who they already trust.",
      "Help them identify one or two reliable people.",
      "Offer to accompany them when they seek appropriate support.",
      "Respect their privacy and avoid sharing their situation without a good reason.",
    ],
  },
  {
    id: "online",
    title: "When the Situation Is Online",
    description:
      "Online abuse can involve threats, stalking, impersonation, harassment, or unwanted sharing of private information.",
    icon: <Lock size={22} />,
    points: [
      "Help preserve relevant digital evidence before it disappears.",
      "Encourage account-security measures such as stronger passwords and multi-factor authentication.",
      "Use appropriate platform reporting tools.",
      "Help them access SAFENET Online Safety and Evidence Vault resources.",
    ],
  },
];

export default function HelpSomeone() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("safenet-theme") === "dark";
  });

  const [search, setSearch] = useState("");
  const [openTopic, setOpenTopic] = useState<string | null>("listen");
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
    <div className="help-someone-page">
      <header className="help-someone-header">
        <div className="help-someone-header-inner">
          <button
            className="help-someone-back"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="help-someone-brand">
            <div className="help-someone-brand-icon">
              <Shield size={21} />
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>Help Someone</span>
            </div>
          </div>

          <button
            className="help-someone-theme"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <main className="help-someone-main">
        <section className="help-someone-hero">
          <div className="help-someone-hero-icon">
            <HeartHandshake size={30} />
          </div>

          <div className="help-someone-hero-content">
            <span className="help-someone-eyebrow">
              SUPPORT SOMEONE SAFELY
            </span>

            <h1>You can be part of someone's safety network.</h1>

            <p>
              Learn practical ways to listen, support, document,
              and connect someone with appropriate help without
              taking control away from them.
            </p>

            <div className="help-someone-hero-pills">
              <span>
                <HeartHandshake size={14} />
                Listen
              </span>

              <span>
                <Shield size={14} />
                Support
              </span>

              <span>
                <Users size={14} />
                Connect
              </span>
            </div>
          </div>
        </section>

        <section className="help-someone-alert">
          <div className="help-someone-alert-icon">
            <AlertTriangle size={21} />
          </div>

          <div>
            <strong>If someone is in immediate danger</strong>

            <p>
              Help them move somewhere safer if possible and
              contact emergency services or a trusted person.
            </p>
          </div>

          <button
            className="help-someone-emergency-button"
            onClick={() => {
              window.location.href = "tel:112";
            }}
            type="button"
          >
            <Phone size={17} />
            Call 112
          </button>
        </section>

        <section className="help-someone-action-grid">
          <button
            className="help-someone-action-card"
            onClick={() => navigate("/trusted-contacts")}
            type="button"
          >
            <div className="help-someone-action-icon">
              <Users size={21} />
            </div>

            <div>
              <strong>Trusted Circle</strong>
              <span>
                Connect with people who can provide support.
              </span>
            </div>
          </button>

          <button
            className="help-someone-action-card"
            onClick={() => navigate("/documentation")}
            type="button"
          >
            <div className="help-someone-action-icon">
              <FileText size={21} />
            </div>

            <div>
              <strong>Documentation</strong>
              <span>
                Organise important incident information.
              </span>
            </div>
          </button>

          <button
            className="help-someone-action-card"
            onClick={() => navigate("/support-resources")}
            type="button"
          >
            <div className="help-someone-action-icon">
              <HeartHandshake size={21} />
            </div>

            <div>
              <strong>Support Resources</strong>
              <span>
                Find useful support and emergency options.
              </span>
            </div>
          </button>
        </section>

        <section className="help-someone-section">
          <div className="help-someone-section-heading">
            <div>
              <span className="help-someone-section-label">
                SUPPORT GUIDE
              </span>

              <h2>How you can help</h2>

              <p>
                Choose a situation to see practical guidance.
              </p>
            </div>

            <div className="help-someone-count">
              <CheckCircle2 size={17} />
              <span>{topics.length} topics</span>
            </div>
          </div>

          <div className="help-someone-search">
            <CircleHelp size={18} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search support topics..."
              type="search"
            />
          </div>

          <div className="help-someone-topics">
            {filteredTopics.length === 0 ? (
              <div className="help-someone-empty">
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
                    className={`help-someone-topic ${
                      isOpen ? "is-open" : ""
                    }`}
                    key={topic.id}
                  >
                    <button
                      className="help-someone-topic-header"
                      onClick={() => toggleTopic(topic.id)}
                      type="button"
                    >
                      <div className="help-someone-topic-icon">
                        {topic.icon}
                      </div>

                      <div className="help-someone-topic-title">
                        <strong>{topic.title}</strong>

                        <span>{topic.description}</span>
                      </div>

                      <div className="help-someone-topic-chevron">
                        {isOpen ? (
                          <ChevronUp size={19} />
                        ) : (
                          <ChevronDown size={19} />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="help-someone-topic-body">
                        <h3>Helpful steps</h3>

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

        <section className="help-someone-note">
          <div className="help-someone-note-icon">
            <Shield size={23} />
          </div>

          <div>
            <span>IMPORTANT</span>

            <h2>Support their choices whenever possible.</h2>

            <p>
              Helping someone does not always mean making decisions
              for them. Listen, respect their boundaries, and help
              them understand the options available to them.
            </p>
          </div>
        </section>

        <section className="help-someone-support">
          <div className="help-someone-support-icon">
            <CircleHelp size={25} />
          </div>

          <div className="help-someone-support-content">
            <span>NOT SURE WHAT TO DO?</span>

            <h2>Start with safety, listening, and support.</h2>

            <p>
              You do not have to solve everything alone. Focus on
              immediate safety and help the person connect with
              appropriate support.
            </p>
          </div>

          <button
            className="help-someone-support-button"
            onClick={() => setShowHelp(true)}
            type="button"
          >
            <CircleHelp size={18} />
            Quick Guide
          </button>
        </section>
      </main>

      {showHelp && (
        <div
          className="help-someone-modal-backdrop"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="help-someone-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="help-someone-modal-icon">
              <HeartHandshake size={25} />
            </div>

            <h2>Start here</h2>

            <p>
              If someone comes to you for help, consider these
              steps first:
            </p>

            <ol>
              <li>
                Ask whether they are currently somewhere safe.
              </li>

              <li>
                Listen without blaming or judging them.
              </li>

              <li>
                Ask what kind of support they would like.
              </li>

              <li>
                Help preserve important information when needed.
              </li>

              <li>
                Help them connect with a trusted person or
                appropriate support resource.
              </li>

              <li>
                Contact emergency services when there is an
                immediate danger.
              </li>
            </ol>

            <div className="help-someone-modal-actions">
              <button
                className="help-someone-modal-secondary"
                onClick={() => setShowHelp(false)}
                type="button"
              >
                Close
              </button>

              <button
                className="help-someone-modal-primary"
                onClick={() => {
                  setShowHelp(false);
                  navigate("/support-resources");
                }}
                type="button"
              >
                <HeartHandshake size={17} />
                Support Resources
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
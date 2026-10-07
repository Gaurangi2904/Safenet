import { useEffect, useMemo, useState } from "react";
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
  ShieldCheck,
  Smartphone,
  Sun,
  Users,
} from "lucide-react";

import "./OnlineSafety.css";

type SafetyTopic = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: string[];
};

const topics: SafetyTopic[] = [
  {
    id: "cyberstalking",
    title: "Cyberstalking & Repeated Contact",
    description:
      "Practical steps when someone repeatedly contacts, monitors, threatens, or follows you through digital platforms.",
    icon: <MessageCircle size={22} />,
    points: [
      "Avoid responding if continued contact is making you feel unsafe.",
      "Save relevant messages, usernames, profile links, dates, and screenshots.",
      "Review privacy and account-security settings.",
      "Block or report the account when appropriate.",
    ],
  },
  {
    id: "impersonation",
    title: "Fake & Impersonation Accounts",
    description:
      "What to consider when someone creates a fake profile or appears to be pretending to be you.",
    icon: <Users size={22} />,
    points: [
      "Take screenshots of the profile and relevant content.",
      "Save the profile URL or username.",
      "Report the account through the platform's reporting mechanism.",
      "Tell trusted people if the impersonation is affecting your safety or reputation.",
    ],
  },
  {
    id: "threats",
    title: "Threatening Messages",
    description:
      "Steps to consider when online communication includes threats, intimidation, or serious harassment.",
    icon: <AlertTriangle size={22} />,
    points: [
      "Do not delete threatening messages before preserving relevant information.",
      "Save screenshots and other available evidence.",
      "Tell someone you trust about the situation.",
      "Contact emergency services if you face immediate physical danger.",
    ],
  },
  {
    id: "private-content",
    title: "Private Content & Sharing Concerns",
    description:
      "Supportive guidance when private photographs, videos, conversations, or information may be shared without your permission.",
    icon: <Lock size={22} />,
    points: [
      "Preserve relevant evidence without forwarding sensitive content unnecessarily.",
      "Review the privacy and security settings of affected accounts.",
      "Report harmful content through the relevant platform.",
      "Seek appropriate support if you feel threatened, pressured, or unsafe.",
    ],
  },
  {
    id: "account-security",
    title: "Account Security",
    description:
      "Strengthen your accounts against unauthorised access and reduce avoidable security risks.",
    icon: <ShieldCheck size={22} />,
    points: [
      "Use strong, unique passwords for important accounts.",
      "Enable multi-factor authentication where available.",
      "Never share passwords or authentication codes with others.",
      "Review active sessions and connected devices regularly.",
    ],
  },
  {
    id: "evidence",
    title: "Preserving Digital Evidence",
    description:
      "Keep useful information organised so you can explain what happened later if needed.",
    icon: <FileText size={22} />,
    points: [
      "Record dates, times, usernames, profile links, and relevant context.",
      "Keep screenshots or other records in a safe location.",
      "Avoid editing or altering original information unnecessarily.",
      "Use SAFENET documentation tools to organise important records.",
    ],
  },
];

export default function OnlineSafety() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("safenet-theme") === "dark";
  });

  const [search, setSearch] = useState("");
  const [openTopic, setOpenTopic] = useState<string | null>(
    "cyberstalking"
  );
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
    <div className="online-safety-page">
      <header className="online-safety-header">
        <div className="online-safety-header-inner">
          <button
            className="online-safety-back"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="online-safety-brand">
            <div className="online-safety-brand-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>Online Safety</span>
            </div>
          </div>

          <button
            className="online-safety-theme"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <main className="online-safety-main">
        <section className="online-safety-hero">
          <div className="online-safety-hero-icon">
            <Smartphone size={30} />
          </div>

          <div className="online-safety-hero-content">
            <span className="online-safety-eyebrow">
              ONLINE & CYBER SAFETY
            </span>

            <h1>Stay safer in the digital world.</h1>

            <p>
              Practical guidance for cyberstalking, impersonation,
              threats, private-content concerns, account security,
              and digital evidence.
            </p>

            <div className="online-safety-hero-pills">
              <span>
                <Lock size={14} />
                Privacy focused
              </span>

              <span>
                <Shield size={14} />
                Security focused
              </span>

              <span>
                <FileText size={14} />
                Evidence focused
              </span>
            </div>
          </div>
        </section>

        <section className="online-safety-alert">
          <div className="online-safety-alert-icon">
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
            className="online-safety-emergency-button"
            onClick={() => {
              window.location.href = "tel:112";
            }}
            type="button"
          >
            <Phone size={17} />
            Call 112
          </button>
        </section>

        <section className="online-safety-action-grid">
          <button
            className="online-safety-action-card"
            onClick={() => navigate("/evidence-vault")}
            type="button"
          >
            <div className="online-safety-action-icon">
              <FileText size={21} />
            </div>

            <div>
              <strong>Evidence Vault</strong>
              <span>
                Organise important digital evidence.
              </span>
            </div>
          </button>

          <button
            className="online-safety-action-card"
            onClick={() => navigate("/trusted-contacts")}
            type="button"
          >
            <div className="online-safety-action-icon">
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
            className="online-safety-action-card"
            onClick={() => navigate("/support-resources")}
            type="button"
          >
            <div className="online-safety-action-icon">
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

        <section className="online-safety-section">
          <div className="online-safety-section-heading">
            <div>
              <span className="online-safety-section-label">
                DIGITAL SAFETY GUIDE
              </span>

              <h2>Situations you may face</h2>

              <p>
                Select a topic to see practical steps and support
                options.
              </p>
            </div>

            <div className="online-safety-count">
              <CheckCircle2 size={17} />
              <span>{topics.length} topics</span>
            </div>
          </div>

          <div className="online-safety-search">
            <CircleHelp size={18} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search online safety topics..."
              type="search"
            />
          </div>

          <div className="online-safety-topics">
            {filteredTopics.length === 0 ? (
              <div className="online-safety-empty">
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
                    className={`online-safety-topic ${
                      isOpen ? "is-open" : ""
                    }`}
                    key={topic.id}
                  >
                    <button
                      className="online-safety-topic-header"
                      onClick={() => toggleTopic(topic.id)}
                      type="button"
                    >
                      <div className="online-safety-topic-icon">
                        {topic.icon}
                      </div>

                      <div className="online-safety-topic-title">
                        <strong>{topic.title}</strong>

                        <span>{topic.description}</span>
                      </div>

                      <div className="online-safety-topic-chevron">
                        {isOpen ? (
                          <ChevronUp size={19} />
                        ) : (
                          <ChevronDown size={19} />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="online-safety-topic-body">
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

        <section className="online-safety-note">
          <div className="online-safety-note-icon">
            <Shield size={23} />
          </div>

          <div>
            <span>SAFETY REMINDER</span>

            <h2>Preserve evidence before deleting or blocking.</h2>

            <p>
              If an online situation may need to be reported later,
              consider preserving relevant information first. Avoid
              unnecessarily forwarding sensitive content to other
              people.
            </p>
          </div>
        </section>

        <section className="online-safety-support">
          <div className="online-safety-support-icon">
            <HeartHandshake size={25} />
          </div>

          <div className="online-safety-support-content">
            <span>YOU DESERVE SUPPORT</span>

            <h2>
              Online abuse is still a real safety concern.
            </h2>

            <p>
              If something online is making you feel threatened,
              pressured, or unsafe, you can reach out to someone you
              trust and use appropriate reporting or support channels.
            </p>
          </div>

          <button
            className="online-safety-support-button"
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
          className="online-safety-modal-backdrop"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="online-safety-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="online-safety-modal-icon">
              <HeartHandshake size={25} />
            </div>

            <h2>Start with your safety</h2>

            <p>
              If you are dealing with an unsafe online situation,
              consider these steps:
            </p>

            <ol>
              <li>
                Move somewhere safer if there is a physical safety
                concern.
              </li>

              <li>
                Preserve relevant digital information.
              </li>

              <li>
                Contact someone you trust.
              </li>

              <li>
                Use the platform's reporting tools when appropriate.
              </li>

              <li>
                Review your account security.
              </li>

              <li>
                Call emergency services if you are in immediate
                danger.
              </li>
            </ol>

            <div className="online-safety-modal-actions">
              <button
                className="online-safety-modal-secondary"
                onClick={() => setShowHelp(false)}
                type="button"
              >
                Close
              </button>

              <button
                className="online-safety-modal-primary"
                onClick={() => {
                  setShowHelp(false);
                  navigate("/evidence-vault");
                }}
                type="button"
              >
                <FileText size={17} />
                Evidence Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
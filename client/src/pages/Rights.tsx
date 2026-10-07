import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  Heart,
  HelpCircle,
  Home,
  Info,
  Lock,
  MapPin,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Users,
  Briefcase,
  Baby,
  Scale,
  X,
  Zap,
} from "lucide-react";
import "./Rights.css";

type Theme = "dark" | "light";

type LawCategory = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: ReactNode;
  colorClass: string;
  situations: string[];
  rights: string[];
  actions: string[];
  source: string;
  sourceUrl: string;
};

const lawCategories: LawCategory[] = [
  {
    id: "domestic-violence",
    title: "Domestic Violence",
    shortTitle: "Protection from abuse at home",
    description:
      "The law addresses physical, sexual, verbal or emotional, and economic abuse in a domestic relationship.",
    icon: <Home size={22} />,
    colorClass: "rights-red",
    situations: [
      "Physical abuse",
      "Sexual abuse",
      "Verbal or emotional abuse",
      "Economic abuse",
      "Threats or intimidation",
      "Abuse involving a child in your care",
    ],
    rights: [
      "The law provides protections and remedies for an aggrieved woman facing domestic violence.",
      "A woman has a statutory right to reside in a shared household, subject to the law and applicable court orders.",
      "The Act provides for protection orders and residence orders.",
      "The Act also provides for monetary relief, custody orders, compensation and interim or ex parte orders in appropriate cases.",
    ],
    actions: [
      "Move to a safer place if there is immediate danger.",
      "Contact emergency services when urgent assistance is required.",
      "Preserve relevant evidence where it is safe to do so.",
      "Seek help from a Protection Officer, service provider, police, legal services authority or court as appropriate.",
    ],
    source: "Protection of Women from Domestic Violence Act, 2005",
    sourceUrl:
      "https://www.indiacode.nic.in/bitstream/123456789/2021/5/A2005-43.pdf",
  },
  {
    id: "dowry",
    title: "Dowry & Harassment",
    shortTitle: "Know the law around dowry",
    description:
      "India has legislation specifically dealing with the giving, taking and demanding of dowry.",
    icon: <Scale size={22} />,
    colorClass: "rights-gold",
    situations: [
      "Demand for dowry",
      "Pressure for money or property",
      "Harassment connected with dowry",
      "Marriage-related financial demands",
      "Threats connected with dowry",
    ],
    rights: [
      "The Dowry Prohibition Act, 1961 is a central law concerning dowry.",
      "The law prohibits the giving or taking of dowry as defined by the Act.",
      "Demanding dowry is also addressed by the Act.",
      "Specific legal consequences depend on the facts and applicable provisions.",
    ],
    actions: [
      "Keep messages, payment records and other relevant material safely.",
      "Avoid confronting someone alone if doing so could increase danger.",
      "Seek legal assistance for your particular circumstances.",
      "Use emergency or women-support services when immediate protection is needed.",
    ],
    source: "Dowry Prohibition Act, 1961",
    sourceUrl: "https://wcd.gov.in/women/legislations",
  },
  {
    id: "workplace",
    title: "Workplace Harassment",
    shortTitle: "POSH protections at work",
    description:
      "The POSH framework provides a legal mechanism for prevention, prohibition and redressal of sexual harassment of women at the workplace.",
    icon: <Briefcase size={22} />,
    colorClass: "rights-purple",
    situations: [
      "Unwelcome sexual behaviour",
      "Sexual comments or advances",
      "Workplace intimidation of a sexual nature",
      "Unwelcome physical contact",
      "Sexual harassment by colleagues",
      "Harassment involving a person connected with work",
    ],
    rights: [
      "The Sexual Harassment of Women at Workplace Act, 2013 establishes a framework for prevention, prohibition and redressal.",
      "Covered workplaces are required to have mechanisms for handling complaints under the Act.",
      "The law provides for Internal Committees in applicable workplaces.",
      "The Act also contains provisions concerning complaints, inquiry and confidentiality.",
    ],
    actions: [
      "Record dates, places, messages and other relevant details.",
      "Identify the appropriate Internal Committee or complaint mechanism.",
      "Follow the applicable complaint procedure.",
      "Seek legal assistance if you need help understanding your options.",
    ],
    source:
      "Sexual Harassment of Women at Workplace Act, 2013",
    sourceUrl: "https://wcd.gov.in/women/legislations",
  },
  {
    id: "child-safety",
    title: "Child & Student Safety",
    shortTitle: "Protection for children",
    description:
      "Children have specific legal protections, including legislation addressing sexual offences against children and child marriage.",
    icon: <Baby size={22} />,
    colorClass: "rights-blue",
    situations: [
      "Sexual abuse of a child",
      "Sexual harassment of a child",
      "Child exploitation",
      "Child marriage",
      "Unsafe situations involving a minor",
      "Threats or coercion involving a child",
    ],
    rights: [
      "The Protection of Children from Sexual Offences Act, 2012 provides a legal framework for protection of children from sexual offences.",
      "The Prohibition of Child Marriage Act, 2006 addresses child marriage.",
      "Children in immediate danger can require urgent protection and assistance.",
      "Legal processes involving children have specific safeguards and procedures.",
    ],
    actions: [
      "Prioritize the child's immediate safety.",
      "For an emergency, contact 112.",
      "The National Child Helpline is 1098.",
      "Do not put a child at additional risk while collecting evidence.",
    ],
    source:
      "Protection of Children from Sexual Offences Act, 2012 / Prohibition of Child Marriage Act, 2006",
    sourceUrl: "https://wcd.gov.in/women/legislations",
  },
  {
    id: "online-abuse",
    title: "Online & Cyber Abuse",
    shortTitle: "Safety in the digital world",
    description:
      "Online harassment can involve threats, impersonation, abusive communication, privacy violations or other unlawful activity.",
    icon: <Smartphone size={22} />,
    colorClass: "rights-cyan",
    situations: [
      "Online threats",
      "Cyberstalking",
      "Impersonation",
      "Non-consensual sharing",
      "Account harassment",
      "Suspicious or abusive messages",
    ],
    rights: [
      "Different forms of online abuse can be governed by different laws depending on the conduct and circumstances.",
      "The Ministry of Women and Child Development lists the Information Technology Act, 2000 among relevant legislation.",
      "Digital privacy and personal-data issues may also involve the Digital Personal Data Protection Act, 2023.",
      "The applicable legal route depends on the specific incident.",
    ],
    actions: [
      "Save relevant screenshots, URLs, usernames and timestamps.",
      "Do not share sensitive evidence publicly.",
      "Secure your account and change compromised passwords.",
      "For cybercrime assistance, the National Portal lists 1930 as the Cyber Crime Helpline.",
    ],
    source: "Ministry of Women & Child Development legislation resources",
    sourceUrl: "https://wcd.gov.in/women/legislations",
  },
  {
    id: "public-safety",
    title: "Stalking & Public Harassment",
    shortTitle: "Know what to do in public",
    description:
      "Repeated unwanted contact, threats or harassment in public spaces can require immediate safety action and appropriate reporting.",
    icon: <MapPin size={22} />,
    colorClass: "rights-orange",
    situations: [
      "Repeated unwanted following",
      "Threatening behaviour",
      "Public harassment",
      "Unwanted contact",
      "Unsafe travel situations",
      "Harassment near college or work",
    ],
    rights: [
      "The legal provisions applicable to stalking or harassment depend on the conduct and circumstances.",
      "Immediate threats can require emergency assistance.",
      "A person can seek help from police and other support services.",
      "SAFENET should provide information and safety guidance without replacing professional legal advice.",
    ],
    actions: [
      "Move towards a populated or safer location.",
      "Contact your trusted circle.",
      "Use emergency services when there is immediate danger.",
      "Record useful details only when it is safe to do so.",
    ],
    source: "Government of India legal and emergency resources",
    sourceUrl: "https://www.india.gov.in/directory/helpline",
  },
  {
    id: "pregnancy",
    title: "Pregnancy & Reproductive Rights",
    shortTitle: "Access reliable information",
    description:
      "Women may need reliable information about maternity protections, reproductive healthcare and related legal frameworks.",
    icon: <Heart size={22} />,
    colorClass: "rights-pink",
    situations: [
      "Pregnancy-related workplace concerns",
      "Pressure or coercion",
      "Maternity benefits",
      "Reproductive healthcare information",
      "Medical privacy concerns",
      "Need for professional support",
    ],
    rights: [
      "The Ministry of Women and Child Development lists the Maternity Benefit Act and its 2017 amendment among relevant legislation.",
      "The Ministry also lists the Medical Termination of Pregnancy Act, 1971 among relevant legislation.",
      "Healthcare and legal rights depend on the specific circumstances and applicable law.",
      "SAFENET should direct users to qualified professionals for individual medical or legal decisions.",
    ],
    actions: [
      "Use qualified medical professionals for medical decisions.",
      "Keep important medical documents secure.",
      "Seek legal assistance when workplace or legal rights are involved.",
      "Use emergency services if there is immediate danger.",
    ],
    source: "Ministry of Women & Child Development legislation resources",
    sourceUrl: "https://wcd.gov.in/women/legislations",
  },
  {
    id: "privacy",
    title: "Privacy & Personal Safety",
    shortTitle: "Protect your personal information",
    description:
      "A safety platform should help users understand privacy risks while keeping sensitive information protected.",
    icon: <Lock size={22} />,
    colorClass: "rights-green",
    situations: [
      "Someone accessing your account",
      "Location privacy concerns",
      "Sharing sensitive information",
      "Device access by another person",
      "Digital identity concerns",
      "Need for a private safety plan",
    ],
    rights: [
      "The Ministry of Women and Child Development lists the Digital Personal Data Protection Act, 2023 among relevant legislation.",
      "Privacy obligations and rights can depend on the type of data and circumstances.",
      "SAFENET should minimize unnecessary collection of sensitive information.",
      "Users should understand what information they choose to store or share.",
    ],
    actions: [
      "Use strong passwords and device security.",
      "Review account and location-sharing settings.",
      "Avoid storing unnecessary sensitive information.",
      "Use SAFENET's privacy controls when they become available.",
    ],
    source: "Digital Personal Data Protection Act, 2023",
    sourceUrl: "https://wcd.gov.in/women/legislations",
  },
];

const quickTopics = [
  { label: "Domestic Violence", id: "domestic-violence" },
  { label: "Dowry", id: "dowry" },
  { label: "Workplace", id: "workplace" },
  { label: "Student Safety", id: "child-safety" },
  { label: "Cyber Abuse", id: "online-abuse" },
  { label: "Public Safety", id: "public-safety" },
  { label: "Pregnancy", id: "pregnancy" },
  { label: "Privacy", id: "privacy" },
];

function Rights() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("safenet-theme");

    return saved === "light" ? "light" : "dark";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLaw, setSelectedLaw] =
    useState<LawCategory | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("safenet-theme", theme);
  }, [theme]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current =
        document.documentElement.getAttribute("data-theme");

      if (current === "light" || current === "dark") {
        setTheme(current);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  const filteredLaws = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return lawCategories;
    }

    return lawCategories.filter((law) => {
      const searchableText = [
        law.title,
        law.shortTitle,
        law.description,
        law.source,
        ...law.situations,
        ...law.rights,
        ...law.actions,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery]);

  const scrollToTopics = () => {
    document
      .getElementById("rights-library")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const openTopic = (id: string) => {
    const law = lawCategories.find((item) => item.id === id);

    if (law) {
      setSelectedLaw(law);
    }
  };

  return (
    <div className="rights-page">
      <header className="rights-navbar">
        <div className="rights-navbar-inner">
          <button
            type="button"
            className="rights-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <div className="rights-brand">
            <span className="rights-brand-icon">
              <ShieldCheck size={19} />
            </span>

            <span>
              SAFENET<span className="rights-brand-dot">.</span>
            </span>
          </div>

          <div className="rights-nav-actions">
            <button
              type="button"
              className="rights-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <span>☀</span>
              ) : (
                <span>☾</span>
              )}
            </button>

            <button
              type="button"
              className="rights-sos-button"
              onClick={() => setShowEmergency(true)}
            >
              <Zap size={15} />
              Emergency
            </button>
          </div>
        </div>
      </header>

      <main className="rights-main">
        <section className="rights-hero">
          <div className="rights-hero-glow" />

          <div className="rights-container rights-hero-grid">
            <div className="rights-hero-content">
              <div className="rights-eyebrow">
                <BookOpen size={15} />
                WOMEN'S RIGHTS & SAFETY
              </div>

              <h1>
                Know your rights.
                <span>Know your options.</span>
              </h1>

              <p>
                A simple, safety-focused guide to important laws,
                protections and support pathways in India.
              </p>

              <div className="rights-hero-actions">
                <button
                  type="button"
                  className="rights-primary-button"
                  onClick={scrollToTopics}
                >
                  Explore Rights
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  className="rights-secondary-button"
                  onClick={() => setShowEmergency(true)}
                >
                  <Shield size={17} />
                  Get Help
                </button>
              </div>

              <div className="rights-hero-note">
                <Info size={15} />
                <span>
                  SAFENET provides general information, not legal advice.
                </span>
              </div>
            </div>

            <div className="rights-hero-card">
              <div className="rights-hero-card-top">
                <div className="rights-card-label">
                  <ShieldCheck size={17} />
                  SAFENET RIGHTS LIBRARY
                </div>

                <span className="rights-secure-pill">
                  <Lock size={12} />
                  Private
                </span>
              </div>

              <div className="rights-hero-stat">
                <strong>{lawCategories.length}</strong>
                <span>Safety topics</span>
              </div>

              <div className="rights-hero-list">
                <div>
                  <CheckCircle2 size={16} />
                  <span>Understand common situations</span>
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  <span>Learn available legal frameworks</span>
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  <span>Find practical next steps</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rights-container rights-info-strip">
          <div className="rights-info-item">
            <ShieldCheck size={19} />
            <div>
              <strong>Safety first</strong>
              <span>Get to a safe place when necessary.</span>
            </div>
          </div>

          <div className="rights-info-item">
            <FileText size={19} />
            <div>
              <strong>Document safely</strong>
              <span>Keep useful records when it is safe.</span>
            </div>
          </div>

          <div className="rights-info-item">
            <Users size={19} />
            <div>
              <strong>Get support</strong>
              <span>Use trusted people and official services.</span>
            </div>
          </div>
        </section>

        <section
          id="rights-library"
          className="rights-container rights-library"
        >
          <div className="rights-section-heading">
            <div>
              <div className="rights-section-label">
                RIGHTS LIBRARY
              </div>

              <h2>Find information for your situation</h2>

              <p>
                Search a topic or choose one of the safety areas below.
              </p>
            </div>
          </div>

          <div className="rights-search-box">
            <Search size={19} />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search domestic violence, dowry, workplace..."
              aria-label="Search rights and laws"
            />

            {searchQuery && (
              <button
                type="button"
                className="rights-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="rights-quick-topics">
            {quickTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => openTopic(topic.id)}
              >
                {topic.label}
                <ChevronDown size={14} />
              </button>
            ))}
          </div>

          {filteredLaws.length > 0 ? (
            <div className="rights-grid">
              {filteredLaws.map((law) => (
                <article
                  key={law.id}
                  className="rights-law-card"
                >
                  <div
                    className={`rights-law-icon ${law.colorClass}`}
                  >
                    {law.icon}
                  </div>

                  <div className="rights-law-card-content">
                    <div className="rights-law-card-top">
                      <span className="rights-topic-tag">
                        SAFETY TOPIC
                      </span>
                    </div>

                    <h3>{law.title}</h3>

                    <p className="rights-law-short">
                      {law.shortTitle}
                    </p>

                    <p className="rights-law-description">
                      {law.description}
                    </p>

                    <div className="rights-law-preview">
                      <div>
                        <CheckCircle2 size={15} />
                        <span>
                          {law.rights.length} key points
                        </span>
                      </div>

                      <div>
                        <ArrowRight size={15} />
                        <span>
                          {law.actions.length} action steps
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rights-learn-button"
                      onClick={() => setSelectedLaw(law)}
                    >
                      Learn more
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rights-empty-state">
              <Search size={30} />

              <h3>No matching topic found</h3>

              <p>
                Try searching for another safety or rights topic.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        <section className="rights-container rights-help-section">
          <div className="rights-help-card">
            <div className="rights-help-icon">
              <HelpCircle size={25} />
            </div>

            <div className="rights-help-content">
              <div className="rights-section-label">
                NEED HELP UNDERSTANDING?
              </div>

              <h2>
                Your situation may involve more than one area.
              </h2>

              <p>
                SAFENET will eventually connect this library with
                incident reporting, evidence protection, safety
                planning and a verified support assistant.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rights-help-button"
            >
              Back to Safety Center
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="rights-container rights-disclaimer">
          <div className="rights-disclaimer-icon">
            <AlertTriangle size={19} />
          </div>

          <div>
            <strong>Important</strong>

            <p>
              This library is for general awareness and does not
              replace a lawyer, police officer, medical professional,
              counsellor or other qualified professional. Laws and
              procedures can change, and the applicable law depends on
              the facts of an individual situation.
            </p>
          </div>
        </section>
      </main>

      <footer className="rights-footer">
        <div className="rights-container rights-footer-inner">
          <div className="rights-footer-brand">
            <ShieldCheck size={18} />

            <span>
              SAFENET<span>.</span>
            </span>
          </div>

          <span>
            Safety information should be clear, accessible and
            responsibly sourced.
          </span>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Safety Dashboard
            <ArrowRight size={14} />
          </button>
        </div>
      </footer>

      {selectedLaw && (
        <div
          className="rights-modal-overlay"
          onClick={() => setSelectedLaw(null)}
        >
          <div
            className="rights-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rights-modal-header">
              <div className="rights-modal-title">
                <div
                  className={`rights-law-icon ${selectedLaw.colorClass}`}
                >
                  {selectedLaw.icon}
                </div>

                <div>
                  <span className="rights-topic-tag">
                    RIGHTS GUIDE
                  </span>

                  <h2>{selectedLaw.title}</h2>
                </div>
              </div>

              <button
                type="button"
                className="rights-modal-close"
                onClick={() => setSelectedLaw(null)}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="rights-modal-body">
              <p className="rights-modal-description">
                {selectedLaw.description}
              </p>

              <div className="rights-modal-section">
                <h3>
                  <AlertTriangle size={17} />
                  Situations covered by this topic
                </h3>

                <div className="rights-situation-list">
                  {selectedLaw.situations.map((item) => (
                    <div key={item}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rights-modal-section">
                <h3>
                  <Scale size={17} />
                  Key information
                </h3>

                <div className="rights-point-list">
                  {selectedLaw.rights.map((item) => (
                    <div key={item}>
                      <span className="rights-point-number">
                        ✓
                      </span>

                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rights-modal-section">
                <h3>
                  <ShieldCheck size={17} />
                  Practical next steps
                </h3>

                <div className="rights-point-list">
                  {selectedLaw.actions.map((item) => (
                    <div key={item}>
                      <span className="rights-point-number">
                        →
                      </span>

                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rights-source-card">
                <div>
                  <FileText size={17} />

                  <div>
                    <strong>Official source</strong>
                    <span>{selectedLaw.source}</span>
                  </div>
                </div>

                <a
                  href={selectedLaw.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open source
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="rights-modal-footer">
              <button
                type="button"
                className="rights-modal-secondary"
                onClick={() => setSelectedLaw(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="rights-modal-primary"
                onClick={() => {
                  setSelectedLaw(null);
                  setShowEmergency(true);
                }}
              >
                <Zap size={15} />
                Need immediate help
              </button>
            </div>
          </div>
        </div>
      )}

      {showEmergency && (
        <div
          className="rights-modal-overlay"
          onClick={() => setShowEmergency(false)}
        >
          <div
            className="rights-emergency-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rights-emergency-header">
              <div className="rights-emergency-icon">
                <Zap size={22} />
              </div>

              <button
                type="button"
                onClick={() => setShowEmergency(false)}
                className="rights-modal-close"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="rights-emergency-content">
              <span className="rights-section-label">
                EMERGENCY SUPPORT
              </span>

              <h2>If you are in immediate danger</h2>

              <p>
                Move to a safer location if possible and contact
                appropriate emergency services.
              </p>

              <div className="rights-emergency-list">
                <a href="tel:112">
                  <div>
                    <strong>112</strong>
                    <span>Integrated emergency response</span>
                  </div>

                  <ArrowRight size={17} />
                </a>

                <a href="tel:181">
                  <div>
                    <strong>181</strong>
                    <span>Women Helpline</span>
                  </div>

                  <ArrowRight size={17} />
                </a>

                <a href="tel:1930">
                  <div>
                    <strong>1930</strong>
                    <span>Cyber Crime Helpline</span>
                  </div>

                  <ArrowRight size={17} />
                </a>

                <a href="tel:1098">
                  <div>
                    <strong>1098</strong>
                    <span>Child Helpline</span>
                  </div>

                  <ArrowRight size={17} />
                </a>
              </div>

              <div className="rights-emergency-note">
                <Info size={15} />

                <span>
                  Helpline availability and procedures can vary.
                  Verify current official information when possible.
                </span>
              </div>
            </div>

            <div className="rights-emergency-footer">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rights;
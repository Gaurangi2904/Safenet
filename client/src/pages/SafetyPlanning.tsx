import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Heart,
  LockKeyhole,
  MapPin,
  Moon,
  Phone,
  Plus,
  ShieldCheck,
  Sun,
  Trash2,
  Users,
  X,
} from "lucide-react";
import "./SafetyPlanning.css";

type SafetyPlan = {
  emergencySteps: string[];
  contacts: string[];
  safePlaces: string[];
  emergencyNumbers: string[];
  importantItems: string[];
  notes: string;
};

const STORAGE_KEY = "safenet_safety_plan";
const THEME_KEY = "safenet-theme";

const defaultPlan: SafetyPlan = {
  emergencySteps: [
    "Move to a safer location if possible.",
    "Contact someone you trust.",
    "Call emergency services when immediate help is needed.",
  ],
  contacts: [],
  safePlaces: [],
  emergencyNumbers: ["112 — Emergency", "181 — Women Helpline"],
  importantItems: [
    "Phone and charger",
    "Identification documents",
    "Essential medicines",
  ],
  notes: "",
};

function SafetyPlanning() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState<SafetyPlan>(defaultPlan);
  const [newContact, setNewContact] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newItem, setNewItem] = useState("");
  const [notes, setNotes] = useState("");
  const [openSections, setOpenSections] = useState({
    emergency: true,
    contacts: true,
    places: true,
    numbers: true,
    items: true,
    notes: true,
  });
  const [savedMessage, setSavedMessage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedPlan = localStorage.getItem(STORAGE_KEY);

    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan) as SafetyPlan;
        setPlan(parsedPlan);
        setNotes(parsedPlan.notes || "");
      } catch {
        setPlan(defaultPlan);
        setNotes("");
      }
    }

    const storedTheme = localStorage.getItem(THEME_KEY);
    const dark = storedTheme !== "light";

    setIsDark(dark);
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
  }, []);

  const completedSections = useMemo(() => {
    let count = 0;

    if (plan.emergencySteps.length > 0) count++;
    if (plan.contacts.length > 0) count++;
    if (plan.safePlaces.length > 0) count++;
    if (plan.emergencyNumbers.length > 0) count++;
    if (plan.importantItems.length > 0) count++;
    if (plan.notes.trim()) count++;

    return count;
  }, [plan]);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    setIsDark(!isDark);
    localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const addContact = () => {
    const value = newContact.trim();

    if (!value) return;

    setPlan((current) => ({
      ...current,
      contacts: [...current.contacts, value],
    }));

    setNewContact("");
  };

  const addPlace = () => {
    const value = newPlace.trim();

    if (!value) return;

    setPlan((current) => ({
      ...current,
      safePlaces: [...current.safePlaces, value],
    }));

    setNewPlace("");
  };

  const addItem = () => {
    const value = newItem.trim();

    if (!value) return;

    setPlan((current) => ({
      ...current,
      importantItems: [...current.importantItems, value],
    }));

    setNewItem("");
  };

  const removeContact = (index: number) => {
    setPlan((current) => ({
      ...current,
      contacts: current.contacts.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const removePlace = (index: number) => {
    setPlan((current) => ({
      ...current,
      safePlaces: current.safePlaces.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const removeItem = (index: number) => {
    setPlan((current) => ({
      ...current,
      importantItems: current.importantItems.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const savePlan = () => {
    const updatedPlan = {
      ...plan,
      notes,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlan));
    setPlan(updatedPlan);

    setSavedMessage(true);

    window.setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
  };

  const clearPlan = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlan(defaultPlan);
    setNotes("");
    setShowDeleteModal(false);
  };

  return (
    <div className="safety-planning-page">
      <header className="safety-planning-header">
        <div className="safety-planning-header-left">
          <button
            className="safety-planning-back"
            onClick={() => navigate("/dashboard")}
            type="button"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="safety-planning-eyebrow">
              <ShieldCheck size={16} />
              SAFENET SAFETY TOOLKIT
            </div>

            <h1>Safety Planning</h1>
            <p>Create a personal plan for safer decisions and preparedness.</p>
          </div>
        </div>

        <button
          className="safety-planning-theme"
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </header>

      <main className="safety-planning-main">
        <section className="safety-planning-hero">
          <div className="safety-planning-hero-icon">
            <ClipboardCheck size={30} />
          </div>

          <div className="safety-planning-hero-content">
            <span className="safety-planning-label">PERSONAL SAFETY PLAN</span>
            <h2>Prepare before you need help.</h2>
            <p>
              Organize trusted people, safer places, emergency information and
              important items in one private plan.
            </p>
          </div>

          <div className="safety-planning-progress">
            <strong>{completedSections}/6</strong>
            <span>sections prepared</span>
          </div>
        </section>

        {savedMessage && (
          <div className="safety-planning-saved">
            <CheckCircle2 size={18} />
            Safety plan saved on this device.
          </div>
        )}

        <section className="safety-planning-notice">
          <LockKeyhole size={19} />

          <div>
            <strong>Private by default</strong>
            <span>
              Your current safety plan is stored locally in this browser.
              Backend synchronization can be added later.
            </span>
          </div>
        </section>

        <div className="safety-planning-grid">
          <section className="safety-planning-card">
            <button
              className="safety-planning-card-header"
              onClick={() => toggleSection("emergency")}
              type="button"
            >
              <div className="safety-planning-card-title">
                <div className="safety-planning-card-icon emergency">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <strong>Emergency Steps</strong>
                  <span>Actions to consider during immediate danger</span>
                </div>
              </div>

              {openSections.emergency ? (
                <ChevronUp size={19} />
              ) : (
                <ChevronDown size={19} />
              )}
            </button>

            {openSections.emergency && (
              <div className="safety-planning-card-body">
                <div className="safety-planning-step-list">
                  {plan.emergencySteps.map((step, index) => (
                    <div className="safety-planning-step" key={step}>
                      <span>{index + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="safety-planning-card">
            <button
              className="safety-planning-card-header"
              onClick={() => toggleSection("contacts")}
              type="button"
            >
              <div className="safety-planning-card-title">
                <div className="safety-planning-card-icon contacts">
                  <Users size={20} />
                </div>

                <div>
                  <strong>People I Can Contact</strong>
                  <span>Trusted people who may be able to help</span>
                </div>
              </div>

              {openSections.contacts ? (
                <ChevronUp size={19} />
              ) : (
                <ChevronDown size={19} />
              )}
            </button>

            {openSections.contacts && (
              <div className="safety-planning-card-body">
                <div className="safety-planning-add-row">
                  <input
                    type="text"
                    value={newContact}
                    onChange={(event) => setNewContact(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addContact();
                    }}
                    placeholder="Name or contact"
                  />

                  <button onClick={addContact} type="button">
                    <Plus size={17} />
                    Add
                  </button>
                </div>

                {plan.contacts.length > 0 ? (
                  <div className="safety-planning-item-list">
                    {plan.contacts.map((contact, index) => (
                      <div
                        className="safety-planning-list-item"
                        key={`${contact}-${index}`}
                      >
                        <div className="safety-planning-list-item-main">
                          <Users size={17} />
                          <span>{contact}</span>
                        </div>

                        <button
                          onClick={() => removeContact(index)}
                          type="button"
                          aria-label={`Remove ${contact}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="safety-planning-empty">
                    Add someone you would feel comfortable contacting.
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="safety-planning-card">
            <button
              className="safety-planning-card-header"
              onClick={() => toggleSection("places")}
              type="button"
            >
              <div className="safety-planning-card-title">
                <div className="safety-planning-card-icon places">
                  <MapPin size={20} />
                </div>

                <div>
                  <strong>Safer Places</strong>
                  <span>Places you could go if you need support</span>
                </div>
              </div>

              {openSections.places ? (
                <ChevronUp size={19} />
              ) : (
                <ChevronDown size={19} />
              )}
            </button>

            {openSections.places && (
              <div className="safety-planning-card-body">
                <div className="safety-planning-add-row">
                  <input
                    type="text"
                    value={newPlace}
                    onChange={(event) => setNewPlace(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addPlace();
                    }}
                    placeholder="Place name or description"
                  />

                  <button onClick={addPlace} type="button">
                    <Plus size={17} />
                    Add
                  </button>
                </div>

                {plan.safePlaces.length > 0 ? (
                  <div className="safety-planning-item-list">
                    {plan.safePlaces.map((place, index) => (
                      <div
                        className="safety-planning-list-item"
                        key={`${place}-${index}`}
                      >
                        <div className="safety-planning-list-item-main">
                          <MapPin size={17} />
                          <span>{place}</span>
                        </div>

                        <button
                          onClick={() => removePlace(index)}
                          type="button"
                          aria-label={`Remove ${place}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="safety-planning-empty">
                    Add a trusted location, public place, institution or other
                    place you may consider safer.
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="safety-planning-card">
            <button
              className="safety-planning-card-header"
              onClick={() => toggleSection("numbers")}
              type="button"
            >
              <div className="safety-planning-card-title">
                <div className="safety-planning-card-icon numbers">
                  <Phone size={20} />
                </div>

                <div>
                  <strong>Emergency Numbers</strong>
                  <span>Important numbers to keep available</span>
                </div>
              </div>

              {openSections.numbers ? (
                <ChevronUp size={19} />
              ) : (
                <ChevronDown size={19} />
              )}
            </button>

            {openSections.numbers && (
              <div className="safety-planning-card-body">
                <div className="safety-planning-number-list">
                  {plan.emergencyNumbers.map((number) => (
                    <div
                      className="safety-planning-number"
                      key={number}
                    >
                      <Phone size={17} />
                      <span>{number}</span>
                    </div>
                  ))}
                </div>

                <p className="safety-planning-small-note">
                  Verify emergency and support numbers for your location before
                  relying on them.
                </p>
              </div>
            )}
          </section>

          <section className="safety-planning-card">
            <button
              className="safety-planning-card-header"
              onClick={() => toggleSection("items")}
              type="button"
            >
              <div className="safety-planning-card-title">
                <div className="safety-planning-card-icon items">
                  <Heart size={20} />
                </div>

                <div>
                  <strong>Important Items</strong>
                  <span>Things you may want ready in advance</span>
                </div>
              </div>

              {openSections.items ? (
                <ChevronUp size={19} />
              ) : (
                <ChevronDown size={19} />
              )}
            </button>

            {openSections.items && (
              <div className="safety-planning-card-body">
                <div className="safety-planning-add-row">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(event) => setNewItem(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addItem();
                    }}
                    placeholder="Add an important item"
                  />

                  <button onClick={addItem} type="button">
                    <Plus size={17} />
                    Add
                  </button>
                </div>

                <div className="safety-planning-item-list">
                  {plan.importantItems.map((item, index) => (
                    <div
                      className="safety-planning-list-item"
                      key={`${item}-${index}`}
                    >
                      <div className="safety-planning-list-item-main">
                        <CheckCircle2 size={17} />
                        <span>{item}</span>
                      </div>

                      <button
                        onClick={() => removeItem(index)}
                        type="button"
                        aria-label={`Remove ${item}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="safety-planning-card">
            <button
              className="safety-planning-card-header"
              onClick={() => toggleSection("notes")}
              type="button"
            >
              <div className="safety-planning-card-title">
                <div className="safety-planning-card-icon notes">
                  <ClipboardCheck size={20} />
                </div>

                <div>
                  <strong>Personal Safety Notes</strong>
                  <span>Private information useful to your plan</span>
                </div>
              </div>

              {openSections.notes ? (
                <ChevronUp size={19} />
              ) : (
                <ChevronDown size={19} />
              )}
            </button>

            {openSections.notes && (
              <div className="safety-planning-card-body">
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Write anything you want to remember for your personal safety plan..."
                  rows={7}
                />
              </div>
            )}
          </section>
        </div>

        <section className="safety-planning-bottom">
          <div>
            <strong>Your plan stays under your control.</strong>
            <span>
              Save your changes when you are ready. You can clear this local
              plan at any time.
            </span>
          </div>

          <div className="safety-planning-actions">
            <button
              className="safety-planning-clear"
              onClick={() => setShowDeleteModal(true)}
              type="button"
            >
              <Trash2 size={17} />
              Clear Plan
            </button>

            <button
              className="safety-planning-save"
              onClick={savePlan}
              type="button"
            >
              <CheckCircle2 size={18} />
              Save Safety Plan
            </button>
          </div>
        </section>

        <section className="safety-planning-footer-note">
          <LockKeyhole size={17} />
          <span>
            SAFENET is a safety-support tool. In an immediate emergency, seek
            appropriate emergency assistance.
          </span>
        </section>
      </main>

      {showDeleteModal && (
        <div
          className="safety-planning-modal-overlay"
          onMouseDown={() => setShowDeleteModal(false)}
        >
          <div
            className="safety-planning-delete-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="safety-planning-delete-icon">
              <Trash2 size={24} />
            </div>

            <h3>Clear safety plan?</h3>

            <p>
              This will remove the safety plan saved on this device. This
              action cannot be undone.
            </p>

            <div className="safety-planning-delete-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                type="button"
              >
                Cancel
              </button>

              <button onClick={clearPlan} type="button">
                Clear Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SafetyPlanning;
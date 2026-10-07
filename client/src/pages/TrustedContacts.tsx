import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Mail,
  Moon,
  Phone,
  Plus,
  ShieldCheck,
  Star,
  Sun,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import "./TrustedContacts.css";

import {
  createTrustedContact,
  deleteTrustedContact,
  getTrustedContacts,
  updateTrustedContact,
} from "../api/trustedContacts";

import type {
  TrustedContact as ApiTrustedContact,
} from "../api/trustedContacts";

type Theme = "dark" | "light";

type TrustedContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  isPrimary: boolean;
};

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("safenet-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

function TrustedContacts() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const [contacts, setContacts] = useState<TrustedContact[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("safenet-theme", theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const loadContacts = async () => {
      const token = localStorage.getItem("safenet_token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getTrustedContacts();

        if (!isMounted) {
          return;
        }

        const backendContacts: ApiTrustedContact[] =
          Array.isArray(data?.contacts)
            ? data.contacts
            : [];

        const formattedContacts: TrustedContact[] =
          backendContacts.map((contact) => ({
            id: contact.id,
            name: contact.name,
            relation: contact.relation ?? "Trusted Contact",
            phone: contact.phone,
            email: "",
            isPrimary: contact.isPrimary,
          }));

        setContacts(formattedContacts);
      } catch (error) {
        console.error(
          "Failed to load trusted contacts:",
          error
        );

        if (!isMounted) {
          return;
        }

        setErrorMessage(
          "Unable to load your trusted contacts."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  const resetForm = () => {
    setName("");
    setRelation("");
    setPhone("");
    setEmail("");
    setIsPrimary(false);
  };

  const handleAddContact = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      /*
       * The current backend TrustedContact model does not
       * contain an email field, so email is intentionally
       * not sent to the backend.
       */
      const data = await createTrustedContact({
        name: name.trim(),
        phone: phone.trim(),
        relation:
          relation.trim() || "Trusted Contact",
        isPrimary,
      });

      const createdContact = data?.contact;

      if (!createdContact) {
        throw new Error(
          "Trusted contact was not returned by the server."
        );
      }

      const newContact: TrustedContact = {
        id: createdContact.id,
        name: createdContact.name,
        relation:
          createdContact.relation ??
          "Trusted Contact",
        phone: createdContact.phone,
        email: "",
        isPrimary: createdContact.isPrimary,
      };

      setContacts((current) => {
        if (newContact.isPrimary) {
          return [
            ...current.map((contact) => ({
              ...contact,
              isPrimary: false,
            })),
            newContact,
          ];
        }

        return [...current, newContact];
      });

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to add trusted contact:",
        error
      );

      setErrorMessage(
        "Unable to save the trusted contact."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    const selectedContact = contacts.find(
      (contact) => contact.id === id
    );

    if (!selectedContact) {
      return;
    }

    try {
      setErrorMessage("");

      await updateTrustedContact(id, {
        name: selectedContact.name,
        phone: selectedContact.phone,
        relation: selectedContact.relation,
        isPrimary: true,
      });

      const otherPrimaryContacts = contacts.filter(
        (contact) =>
          contact.id !== id && contact.isPrimary
      );

      for (const contact of otherPrimaryContacts) {
        await updateTrustedContact(contact.id, {
          name: contact.name,
          phone: contact.phone,
          relation: contact.relation,
          isPrimary: false,
        });
      }

      setContacts((current) =>
        current.map((contact) => ({
          ...contact,
          isPrimary: contact.id === id,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to set primary contact:",
        error
      );

      setErrorMessage(
        "Unable to update the primary contact."
      );
    }
  };

  const handleDelete = async (id: string) => {
    const contactToDelete = contacts.find(
      (contact) => contact.id === id
    );

    if (!contactToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${contactToDelete.name} from your Trusted Circle?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");

      await deleteTrustedContact(id);

      setContacts((current) =>
        current.filter(
          (contact) => contact.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete trusted contact:",
        error
      );

      setErrorMessage(
        "Unable to delete the trusted contact."
      );
    }
  };

  return (
    <div className="trusted-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="trusted-header">
        <div className="trusted-header-inner">
          <button
            className="trusted-back-button"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <ArrowLeft size={18} />

            <span>
              Dashboard
            </span>
          </button>

          <div className="trusted-brand">
            <div className="trusted-brand-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>
                SAFENET
              </strong>

              <span>
                Trusted Circle
              </span>
            </div>
          </div>

          <button
            className="trusted-theme-button"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="trusted-main">
        <section className="trusted-hero">
          <div className="trusted-hero-content">
            <div className="trusted-eyebrow">
              <Users size={15} />

              SAFETY NETWORK
            </div>

            <h1>
              Your Trusted Circle
            </h1>

            <p>
              Keep the people you trust close and ready to
              support you when you need them.
            </p>
          </div>

          <div className="trusted-hero-status">
            <div className="trusted-status-icon">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <strong>
                {contacts.length}{" "}
                {contacts.length === 1
                  ? "contact"
                  : "contacts"}
              </strong>

              <span>
                In your safety circle
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            SAFETY NOTICE
        ===================================================== */}

        <section className="trusted-notice">
          <div className="trusted-notice-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <strong>
              Keep trusted people available
            </strong>

            <p>
              Add family members, friends or other people
              you trust. Your Trusted Circle is designed
              to make important support contacts easy to
              access.
            </p>
          </div>
        </section>

        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {errorMessage && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              background: "rgba(239, 68, 68, 0.08)",
              color: "inherit",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* =====================================================
            CONTACTS SECTION
        ===================================================== */}

        <section className="trusted-section">
          <div className="trusted-section-heading">
            <div>
              <span>
                YOUR CONTACTS
              </span>

              <h2>
                Trusted people
              </h2>
            </div>

            <button
              className="trusted-add-button"
              onClick={() =>
                setShowForm((value) => !value)
              }
              type="button"
            >
              <Plus size={18} />

              Add Contact
            </button>
          </div>

          {/* =================================================
              LOADING STATE
          ================================================= */}

          {loading && (
            <div className="trusted-empty">
              <div className="trusted-empty-icon">
                <Users size={28} />
              </div>

              <h3>
                Loading your Trusted Circle
              </h3>

              <p>
                Getting your trusted contacts securely from
                SAFENET.
              </p>
            </div>
          )}

          {/* =================================================
              ADD FORM
          ================================================= */}

          {!loading && showForm && (
            <form
              className="trusted-form"
              onSubmit={handleAddContact}
            >
              <div className="trusted-form-heading">
                <div className="trusted-form-icon">
                  <UserRound size={20} />
                </div>

                <div>
                  <h3>
                    Add trusted contact
                  </h3>

                  <p>
                    Add someone you can rely on for support.
                  </p>
                </div>
              </div>

              <div className="trusted-form-grid">
                <div className="trusted-field">
                  <label htmlFor="trusted-name">
                    Full name
                  </label>

                  <input
                    id="trusted-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="e.g. Priya Sharma"
                    required
                  />
                </div>

                <div className="trusted-field">
                  <label htmlFor="trusted-relation">
                    Relationship
                  </label>

                  <input
                    id="trusted-relation"
                    type="text"
                    value={relation}
                    onChange={(event) =>
                      setRelation(event.target.value)
                    }
                    placeholder="e.g. Mother, Friend"
                  />
                </div>

                <div className="trusted-field">
                  <label htmlFor="trusted-phone">
                    Phone number
                  </label>

                  <input
                    id="trusted-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="Phone number"
                    required
                  />
                </div>

                <div className="trusted-field">
                  <label htmlFor="trusted-email">
                    Email
                  </label>

                  <input
                    id="trusted-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Email address"
                  />
                </div>
              </div>

              <label className="trusted-primary-option">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(event) =>
                    setIsPrimary(event.target.checked)
                  }
                />

                <span>
                  Make this my primary trusted contact
                </span>
              </label>

              <div className="trusted-form-actions">
                <button
                  type="button"
                  className="trusted-cancel-button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="trusted-save-button"
                  disabled={saving}
                >
                  <Plus size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Contact"}
                </button>
              </div>
            </form>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            contacts.length === 0 &&
            !showForm && (
              <div className="trusted-empty">
                <div className="trusted-empty-icon">
                  <Users size={28} />
                </div>

                <h3>
                  Your Trusted Circle is empty
                </h3>

                <p>
                  Add someone you trust so they can be part
                  of your personal safety network.
                </p>

                <button
                  className="trusted-empty-button"
                  onClick={() =>
                    setShowForm(true)
                  }
                  type="button"
                >
                  <Plus size={17} />

                  Add Your First Contact
                </button>
              </div>
            )}

          {/* =================================================
              CONTACT LIST
          ================================================= */}

          {!loading && contacts.length > 0 && (
            <div className="trusted-contact-list">
              {contacts.map((contact) => (
                <article
                  className={`trusted-contact-card ${
                    contact.isPrimary
                      ? "trusted-contact-primary"
                      : ""
                  }`}
                  key={contact.id}
                >
                  <div className="trusted-contact-avatar">
                    <UserRound size={23} />
                  </div>

                  <div className="trusted-contact-info">
                    <div className="trusted-contact-name-row">
                      <h3>
                        {contact.name}
                      </h3>

                      {contact.isPrimary && (
                        <span className="trusted-primary-badge">
                          <Star size={12} />

                          Primary
                        </span>
                      )}
                    </div>

                    <span className="trusted-contact-relation">
                      {contact.relation}
                    </span>

                    <div className="trusted-contact-details">
                      <span>
                        <Phone size={14} />

                        {contact.phone}
                      </span>

                      {contact.email && (
                        <span>
                          <Mail size={14} />

                          {contact.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="trusted-contact-actions">
                    {!contact.isPrimary && (
                      <button
                        type="button"
                        className="trusted-secondary-action"
                        onClick={() =>
                          handleSetPrimary(
                            contact.id
                          )
                        }
                      >
                        <Star size={15} />

                        Set Primary
                      </button>
                    )}

                    <button
                      type="button"
                      className="trusted-delete-button"
                      onClick={() =>
                        handleDelete(contact.id)
                      }
                      aria-label={`Delete ${contact.name}`}
                      title="Delete contact"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            SAFETY GUIDANCE
        ===================================================== */}

        <section className="trusted-guidance">
          <div className="trusted-guidance-heading">
            <ShieldCheck size={20} />

            <div>
              <span>
                SAFETY TIP
              </span>

              <h2>
                Choose people you can reach when needed.
              </h2>
            </div>
          </div>

          <div className="trusted-guidance-grid">
            <div>
              <strong>
                Keep details current
              </strong>

              <p>
                Review phone numbers and contact details
                regularly.
              </p>
            </div>

            <div>
              <strong>
                Choose trusted people
              </strong>

              <p>
                Select people you genuinely trust and feel
                comfortable contacting.
              </p>
            </div>

            <div>
              <strong>
                Use emergency tools when necessary
              </strong>

              <p>
                In immediate danger, use the appropriate
                emergency services available to you.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER NAVIGATION
        ===================================================== */}

        <section className="trusted-footer-actions">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />

            Back to Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/sos")}
          >
            Emergency SOS

            <ChevronRight size={17} />
          </button>
        </section>
      </main>
    </div>
  );
}

export default TrustedContacts;
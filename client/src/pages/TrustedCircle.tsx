import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Edit3,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import "./TrustedCircle.css";

type TrustedContact = {
  id: string;
  name: string;
  phone: string;
  relation: string;
  email: string;
  isPrimary: boolean;
};

const STORAGE_KEY = "safenet_trusted_contacts";

const defaultContacts: TrustedContact[] = [];

const relationOptions = [
  "Parent",
  "Sibling",
  "Friend",
  "Partner",
  "Relative",
  "Teacher",
  "Colleague",
  "Other",
];

function TrustedCircle() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return defaultContacts;
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : defaultContacts;
    } catch {
      return defaultContacts;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("Friend");
  const [email, setEmail] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("safenet-theme");

    if (
      savedTheme === "dark" ||
      savedTheme === "light"
    ) {
      document.documentElement.setAttribute(
        "data-theme",
        savedTheme
      );
    }
  }, []);

  const primaryContact = useMemo(
    () => contacts.find((contact) => contact.isPrimary),
    [contacts]
  );

  const resetForm = () => {
    setName("");
    setPhone("");
    setRelation("Friend");
    setEmail("");
    setIsPrimary(false);
    setEditingId(null);
    setMessage("");
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (contact: TrustedContact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelation(contact.relation);
    setEmail(contact.email);
    setIsPrimary(contact.isPrimary);
    setMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setMessage("Name and phone number are required.");
      return;
    }

    const contact: TrustedContact = {
      id: editingId ?? crypto.randomUUID(),
      name: name.trim(),
      phone: phone.trim(),
      relation,
      email: email.trim(),
      isPrimary,
    };

    setContacts((current) => {
      let updated: TrustedContact[];

      if (editingId) {
        updated = current.map((item) =>
          item.id === editingId ? contact : item
        );
      } else {
        updated = [...current, contact];
      }

      if (contact.isPrimary) {
        updated = updated.map((item) => ({
          ...item,
          isPrimary: item.id === contact.id,
        }));
      }

      return updated;
    });

    closeModal();
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this trusted contact?"
    );

    if (!confirmed) {
      return;
    }

    setContacts((current) =>
      current.filter((contact) => contact.id !== id)
    );
  };

  const makePrimary = (id: string) => {
    setContacts((current) =>
      current.map((contact) => ({
        ...contact,
        isPrimary: contact.id === id,
      }))
    );
  };

  const callContact = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const emailContact = (emailAddress: string) => {
    window.location.href = `mailto:${emailAddress}`;
  };

  return (
    <div className="trusted-circle-page">
      <header className="trusted-circle-header">
        <button
          className="trusted-circle-back"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={19} />
          <span>Dashboard</span>
        </button>

        <div className="trusted-circle-header-content">
          <div className="trusted-circle-title-icon">
            <ShieldCheck size={28} />
          </div>

          <div>
            <p className="trusted-circle-eyebrow">
              SAFENET SAFETY NETWORK
            </p>

            <h1>Trusted Circle</h1>

            <p>
              Keep the people you trust close when you need
              support.
            </p>
          </div>
        </div>

        <button
          className="trusted-circle-add-button"
          type="button"
          onClick={openAddModal}
        >
          <Plus size={19} />
          Add Contact
        </button>
      </header>

      <main className="trusted-circle-main">
        <section className="trusted-circle-intro">
          <div>
            <span className="trusted-circle-badge">
              <ShieldCheck size={15} />
              PRIVATE & SECURE
            </span>

            <h2>Your safety network</h2>

            <p>
              Add people you trust so they can be reached
              quickly during an emergency or difficult
              situation.
            </p>
          </div>

          <div className="trusted-circle-stats">
            <div>
              <strong>{contacts.length}</strong>
              <span>Trusted contacts</span>
            </div>

            <div>
              <strong>{primaryContact ? "1" : "0"}</strong>
              <span>Primary contact</span>
            </div>
          </div>
        </section>

        {primaryContact && (
          <section className="trusted-circle-primary">
            <div className="primary-contact-icon">
              <Star size={21} />
            </div>

            <div className="primary-contact-info">
              <span>PRIMARY CONTACT</span>
              <strong>{primaryContact.name}</strong>
              <p>
                {primaryContact.relation} · {primaryContact.phone}
              </p>
            </div>

            <button
              type="button"
              onClick={() => callContact(primaryContact.phone)}
            >
              <Phone size={17} />
              Call
            </button>
          </section>
        )}

        <section className="trusted-circle-section">
          <div className="trusted-circle-section-heading">
            <div>
              <p className="section-label">YOUR CONTACTS</p>
              <h2>People you trust</h2>
            </div>

            <button
              className="trusted-circle-small-add"
              type="button"
              onClick={openAddModal}
            >
              <Plus size={17} />
              Add
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="trusted-circle-empty">
              <div className="trusted-circle-empty-icon">
                <UserRound size={30} />
              </div>

              <h3>Your Trusted Circle is empty</h3>

              <p>
                Add a trusted person who can support you
                when you need help.
              </p>

              <button
                type="button"
                onClick={openAddModal}
              >
                <Plus size={18} />
                Add your first contact
              </button>
            </div>
          ) : (
            <div className="trusted-circle-grid">
              {contacts.map((contact) => (
                <article
                  className="trusted-contact-card"
                  key={contact.id}
                >
                  <div className="trusted-contact-top">
                    <div className="trusted-contact-avatar">
                      {contact.name
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="trusted-contact-heading">
                      <div className="trusted-contact-name-row">
                        <h3>{contact.name}</h3>

                        {contact.isPrimary && (
                          <span className="primary-label">
                            <Star size={12} />
                            Primary
                          </span>
                        )}
                      </div>

                      <span>{contact.relation}</span>
                    </div>
                  </div>

                  <div className="trusted-contact-details">
                    <div>
                      <Phone size={16} />
                      <span>{contact.phone}</span>
                    </div>

                    {contact.email && (
                      <div>
                        <Mail size={16} />
                        <span>{contact.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="trusted-contact-actions">
                    <button
                      type="button"
                      onClick={() =>
                        callContact(contact.phone)
                      }
                    >
                      <Phone size={16} />
                      Call
                    </button>

                    {contact.email && (
                      <button
                        type="button"
                        onClick={() =>
                          emailContact(contact.email)
                        }
                      >
                        <Mail size={16} />
                        Email
                      </button>
                    )}

                    {!contact.isPrimary && (
                      <button
                        type="button"
                        onClick={() =>
                          makePrimary(contact.id)
                        }
                      >
                        <Star size={16} />
                        Primary
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(contact)
                      }
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>

                    <button
                      className="danger-action"
                      type="button"
                      onClick={() =>
                        handleDelete(contact.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="trusted-circle-safety-note">
          <div>
            <ShieldCheck size={22} />
          </div>

          <div>
            <h3>Safety note</h3>
            <p>
              Only add people you genuinely trust. Contact
              information is currently stored locally on this
              device. Backend synchronization can be added
              later.
            </p>
          </div>
        </section>
      </main>

      {showModal && (
        <div
          className="trusted-circle-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="trusted-circle-modal">
            <div className="trusted-circle-modal-header">
              <div>
                <span>
                  {editingId
                    ? "UPDATE CONTACT"
                    : "NEW CONTACT"}
                </span>

                <h2>
                  {editingId
                    ? "Edit trusted contact"
                    : "Add trusted contact"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="trusted-form-grid">
                <label>
                  <span>Name *</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Full name"
                  />
                </label>

                <label>
                  <span>Phone *</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="+91 XXXXX XXXXX"
                  />
                </label>

                <label>
                  <span>Relation</span>
                  <select
                    value={relation}
                    onChange={(event) =>
                      setRelation(event.target.value)
                    }
                  >
                    {relationOptions.map((option) => (
                      <option
                        value={option}
                        key={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="name@example.com"
                  />
                </label>
              </div>

              <label className="primary-checkbox">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(event) =>
                    setIsPrimary(event.target.checked)
                  }
                />

                <span>
                  <strong>Set as primary contact</strong>
                  <small>
                    This person will appear at the top of
                    your Trusted Circle.
                  </small>
                </span>

                <Check size={18} />
              </label>

              {message && (
                <div className="trusted-form-message">
                  {message}
                </div>
              )}

              <div className="trusted-circle-modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit">
                  {editingId
                    ? "Save Changes"
                    : "Add Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrustedCircle;
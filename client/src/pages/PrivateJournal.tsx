import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Lock,
  Plus,
  Search,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import "./PrivateJournal.css";

import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  updateJournalEntry,
} from "../api/journal";

import type {
  JournalEntry as ApiJournalEntry,
} from "../api/journal";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
};

const THEME_KEY = "safenet-theme";

const moodOptions = [
  "Calm",
  "Okay",
  "Worried",
  "Sad",
  "Angry",
  "Scared",
  "Hopeful",
];

function PrivateJournal() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] =
    useState<JournalEntry | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("Okay");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);

    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const loadEntries = async () => {
      const token = localStorage.getItem("safenet_token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getJournalEntries();

        if (!isMounted) {
          return;
        }

        const backendEntries: ApiJournalEntry[] =
          Array.isArray(data?.journalEntries)
            ? data.journalEntries
            : [];

        const formattedEntries: JournalEntry[] =
          backendEntries.map((entry) => ({
            id: entry.id,
            title: entry.title,
            content: entry.content,
            mood: "Okay",
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
          }));

        setEntries(formattedEntries);
      } catch (error) {
        console.error(
          "Failed to load journal entries:",
          error
        );

        if (!isMounted) {
          return;
        }

        setErrorMessage(
          "Unable to load your journal entries."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEntries();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return entries;
    }

    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.mood.toLowerCase().includes(query)
    );
  }, [entries, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openNewEntry = () => {
    setEditingEntry(null);
    setTitle("");
    setContent("");
    setMood("Okay");
    setSavedMessage("");
    setErrorMessage("");
    setShowModal(true);
  };

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setSavedMessage("");
    setErrorMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingEntry(null);
    setTitle("");
    setContent("");
    setMood("Okay");
    setSavedMessage("");
  };

  const saveEntry = async () => {
    if (!title.trim() || !content.trim()) {
      setSavedMessage(
        "Please add a title and journal entry."
      );
      return;
    }

    try {
      setSaving(true);
      setSavedMessage("");
      setErrorMessage("");

      if (editingEntry) {
        const data = await updateJournalEntry(
          editingEntry.id,
          {
            title: title.trim(),
            content: content.trim(),
          }
        );

        const updatedEntry = data?.journalEntry;

        if (!updatedEntry) {
          throw new Error(
            "Updated journal entry was not returned."
          );
        }

        setEntries((currentEntries) =>
          currentEntries.map((entry) =>
            entry.id === editingEntry.id
              ? {
                  ...entry,
                  title: updatedEntry.title,
                  content: updatedEntry.content,
                  updatedAt: updatedEntry.updatedAt,
                }
              : entry
          )
        );
      } else {
        const data = await createJournalEntry({
          title: title.trim(),
          content: content.trim(),
        });

        const createdEntry = data?.journalEntry;

        if (!createdEntry) {
          throw new Error(
            "Created journal entry was not returned."
          );
        }

        const newEntry: JournalEntry = {
          id: createdEntry.id,
          title: createdEntry.title,
          content: createdEntry.content,
          mood,
          createdAt: createdEntry.createdAt,
          updatedAt: createdEntry.updatedAt,
        };

        setEntries((currentEntries) => [
          newEntry,
          ...currentEntries,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(
        "Failed to save journal entry:",
        error
      );

      setSavedMessage(
        "Unable to save the journal entry. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    try {
      setErrorMessage("");

      await deleteJournalEntry(deleteId);

      setEntries((currentEntries) =>
        currentEntries.filter(
          (entry) => entry.id !== deleteId
        )
      );

      setDeleteId(null);
    } catch (error) {
      console.error(
        "Failed to delete journal entry:",
        error
      );

      setErrorMessage(
        "Unable to delete the journal entry."
      );
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="private-journal-page">
      <header className="private-journal-header">
        <div className="private-journal-header-left">
          <button
            className="journal-back-button"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <ArrowLeft size={19} />
            <span>Dashboard</span>
          </button>

          <div className="journal-title-block">
            <div className="journal-title-icon">
              <BookOpen size={22} />
            </div>

            <div>
              <h1>Private Journal</h1>
              <p>
                A private space for your thoughts and
                experiences
              </p>
            </div>
          </div>
        </div>

        <button
          className="journal-theme-button"
          onClick={() =>
            setTheme(
              theme === "dark" ? "light" : "dark"
            )
          }
          type="button"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </header>

      <main className="private-journal-content">
        <section className="journal-security-banner">
          <div className="journal-security-icon">
            <Lock size={22} />
          </div>

          <div>
            <h2>Your journal is private</h2>
            <p>
              Your entries are securely associated with
              your SAFENET account.
            </p>
          </div>

          <Shield
            size={26}
            className="journal-security-shield"
          />
        </section>

        {errorMessage && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "12px",
              border:
                "1px solid rgba(239, 68, 68, 0.35)",
              background:
                "rgba(239, 68, 68, 0.08)",
            }}
          >
            {errorMessage}
          </div>
        )}

        <section className="journal-toolbar">
          <div className="journal-search">
            <Search size={19} />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search your journal..."
            />

            {searchQuery && (
              <button
                onClick={clearSearch}
                type="button"
                className="journal-clear-search"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <button
            className="journal-new-button"
            onClick={openNewEntry}
            type="button"
          >
            <Plus size={19} />
            <span>New Entry</span>
          </button>
        </section>

        <section className="journal-stats">
          <div className="journal-stat-card">
            <div className="journal-stat-icon">
              <BookOpen size={20} />
            </div>

            <div>
              <strong>{entries.length}</strong>
              <span>Total Entries</span>
            </div>
          </div>

          <div className="journal-stat-card">
            <div className="journal-stat-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <strong>
                {entries.length > 0
                  ? new Date(
                      entries[0].updatedAt
                    ).toLocaleDateString("en-IN")
                  : "—"}
              </strong>

              <span>Last Updated</span>
            </div>
          </div>

          <div className="journal-stat-card">
            <div className="journal-stat-icon">
              <Lock size={20} />
            </div>

            <div>
              <strong>Private</strong>
              <span>SAFENET Account</span>
            </div>
          </div>
        </section>

        <section className="journal-section-heading">
          <div>
            <h2>Your Entries</h2>

            <p>
              {searchQuery
                ? `${filteredEntries.length} matching ${
                    filteredEntries.length === 1
                      ? "entry"
                      : "entries"
                  }`
                : "Record thoughts, experiences, concerns, or anything you want to remember."}
            </p>
          </div>
        </section>

        {loading ? (
          <section className="journal-empty-state">
            <div className="journal-empty-icon">
              <BookOpen size={34} />
            </div>

            <h3>
              Loading your journal
            </h3>

            <p>
              Getting your private entries securely from
              SAFENET.
            </p>
          </section>
        ) : filteredEntries.length === 0 ? (
          <section className="journal-empty-state">
            <div className="journal-empty-icon">
              <BookOpen size={34} />
            </div>

            <h3>
              {searchQuery
                ? "No matching entries"
                : "Your journal is empty"}
            </h3>

            <p>
              {searchQuery
                ? "Try a different search term."
                : "Create your first private journal entry whenever you are ready."}
            </p>

            {!searchQuery && (
              <button
                className="journal-empty-button"
                onClick={openNewEntry}
                type="button"
              >
                <Plus size={18} />
                Create First Entry
              </button>
            )}
          </section>
        ) : (
          <section className="journal-entry-list">
            {filteredEntries.map((entry) => (
              <article
                className="journal-entry-card"
                key={entry.id}
              >
                <div className="journal-entry-top">
                  <div>
                    <div className="journal-entry-title-row">
                      <h3>{entry.title}</h3>

                      <span className="journal-mood-badge">
                        {entry.mood}
                      </span>
                    </div>

                    <p className="journal-entry-date">
                      {formatDate(entry.updatedAt)}

                      {entry.updatedAt !==
                        entry.createdAt &&
                        " • Edited"}
                    </p>
                  </div>

                  <div className="journal-entry-actions">
                    <button
                      onClick={() =>
                        openEditEntry(entry)
                      }
                      type="button"
                      aria-label={`Edit ${entry.title}`}
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      onClick={() =>
                        setDeleteId(entry.id)
                      }
                      type="button"
                      aria-label={`Delete ${entry.title}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <p className="journal-entry-content">
                  {entry.content}
                </p>

                <div className="journal-entry-footer">
                  <span>
                    <Lock size={14} />
                    Private entry
                  </span>

                  <span>
                    <CheckCircle2 size={14} />
                    Saved securely
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="journal-safety-note">
          <Shield size={21} />

          <div>
            <strong>Safety reminder</strong>

            <p>
              If writing about an unsafe situation could
              put you at risk, consider using a safer device
              or account and avoid storing sensitive
              information where someone else may access it.
            </p>
          </div>
        </section>
      </main>

      {showModal && (
        <div
          className="journal-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="journal-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="journal-modal-header">
              <div>
                <h2>
                  {editingEntry
                    ? "Edit Entry"
                    : "New Journal Entry"}
                </h2>

                <p>
                  Your entry is saved securely to your
                  SAFENET account.
                </p>
              </div>

              <button
                className="journal-modal-close"
                onClick={closeModal}
                type="button"
                aria-label="Close"
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            <div className="journal-form">
              <div className="journal-form-group">
                <label htmlFor="journal-title">
                  Title
                </label>

                <input
                  id="journal-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Give your entry a title"
                  maxLength={120}
                />
              </div>

              <div className="journal-form-group">
                <label htmlFor="journal-mood">
                  How are you feeling?
                </label>

                <select
                  id="journal-mood"
                  value={mood}
                  onChange={(event) =>
                    setMood(event.target.value)
                  }
                >
                  {moodOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="journal-form-group">
                <label htmlFor="journal-content">
                  Your thoughts
                </label>

                <textarea
                  id="journal-content"
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  placeholder="Write whatever you want to remember..."
                  rows={10}
                />
              </div>

              {savedMessage && (
                <div className="journal-form-message">
                  {savedMessage}
                </div>
              )}

              <div className="journal-form-actions">
                <button
                  className="journal-cancel-button"
                  onClick={closeModal}
                  type="button"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="journal-save-button"
                  onClick={saveEntry}
                  type="button"
                  disabled={saving}
                >
                  <CheckCircle2 size={18} />

                  {saving
                    ? "Saving..."
                    : editingEntry
                    ? "Update Entry"
                    : "Save Entry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div
          className="journal-modal-overlay"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="journal-delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="journal-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2>
              Delete this entry?
            </h2>

            <p>
              This journal entry will be permanently
              removed from your SAFENET account.
            </p>

            <div className="journal-delete-actions">
              <button
                className="journal-cancel-button"
                onClick={() =>
                  setDeleteId(null)
                }
                type="button"
              >
                Cancel
              </button>

              <button
                className="journal-delete-button"
                onClick={confirmDelete}
                type="button"
              >
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrivateJournal;
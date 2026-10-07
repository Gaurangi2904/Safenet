import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  Edit3,
  FileText,
  Filter,
  Import,
  MapPin,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Sun,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import "./Documentation.css";

import {
  createIncident,
  deleteIncident,
  getIncidents,
  updateIncident,
} from "../api/incidents";

import type { Incident } from "../api/incidents";

type Theme = "dark" | "light";

type DocumentationItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  peopleInvolved: string;
  description: string;
  actionTaken: string;
  status: "Recorded" | "Follow-up" | "Resolved";
  createdAt: string;
  updatedAt: string;
};

const categories = [
  "Incident",
  "Harassment",
  "Domestic Safety",
  "Workplace",
  "Online / Cyber",
  "Stalking",
  "Public Safety",
  "Legal",
  "Other",
];

const statuses: DocumentationItem["status"][] = [
  "Recorded",
  "Follow-up",
  "Resolved",
];

const categoryToBackend: Record<string, string> = {
  Incident: "OTHER",
  Harassment: "HARASSMENT",
  "Domestic Safety": "DOMESTIC_ABUSE",
  Workplace: "WORKPLACE_HARASSMENT",
  "Online / Cyber": "ONLINE_HARASSMENT",
  Stalking: "STALKING",
  "Public Safety": "PUBLIC_HARASSMENT",
  Legal: "OTHER",
  Other: "OTHER",
};

const backendToCategory: Record<string, string> = {
  DOMESTIC_ABUSE: "Domestic Safety",
  HARASSMENT: "Harassment",
  STALKING: "Stalking",
  ONLINE_HARASSMENT: "Online / Cyber",
  DOWRY_HARASSMENT: "Domestic Safety",
  PREGNANCY_REPRODUCTIVE_COERCION: "Domestic Safety",
  COLLEGE_HARASSMENT: "Harassment",
  WORKPLACE_HARASSMENT: "Workplace",
  PUBLIC_HARASSMENT: "Public Safety",
  THREATS: "Incident",
  OTHER: "Other",
};

const documentationMarker = "SAFENET_DOCUMENTATION";

type StoredDescription = {
  description: string;
  location: string;
  peopleInvolved: string;
  actionTaken: string;
};

const buildBackendDescription = ({
  description,
  location,
  peopleInvolved,
  actionTaken,
}: StoredDescription) => {
  return JSON.stringify({
    marker: documentationMarker,
    description,
    location,
    peopleInvolved,
    actionTaken,
  });
};

const parseBackendDescription = (
  value: string | null
): StoredDescription => {
  if (!value) {
    return {
      description: "",
      location: "",
      peopleInvolved: "",
      actionTaken: "",
    };
  }

  try {
    const parsed = JSON.parse(value);

    if (parsed?.marker === documentationMarker) {
      return {
        description: parsed.description || "",
        location: parsed.location || "",
        peopleInvolved: parsed.peopleInvolved || "",
        actionTaken: parsed.actionTaken || "",
      };
    }
  } catch {
    // Existing plain-text incident description.
  }

  return {
    description: value,
    location: "",
    peopleInvolved: "",
    actionTaken: "",
  };
};

const backendStatusToUi = (
  status: string
): DocumentationItem["status"] => {
  if (status === "RESOLVED") {
    return "Resolved";
  }

  if (status === "OPEN") {
    return "Follow-up";
  }

  return "Recorded";
};

const uiStatusToBackend = (
  status: DocumentationItem["status"]
) => {
  if (status === "Resolved") {
    return "RESOLVED";
  }

  if (status === "Follow-up") {
    return "OPEN";
  }

  return "DRAFT";
};

const incidentToDocumentation = (
  incident: Incident
): DocumentationItem => {
  const parsed = parseBackendDescription(incident.description);

  return {
    id: incident.id,
    title: incident.title,
    category:
      backendToCategory[incident.category] || "Other",
    date: incident.occurredAt
      ? incident.occurredAt.slice(0, 10)
      : incident.createdAt.slice(0, 10),
    location: parsed.location,
    peopleInvolved: parsed.peopleInvolved,
    description: parsed.description,
    actionTaken: parsed.actionTaken,
    status: backendStatusToUi(incident.status),
    createdAt: incident.createdAt,
    updatedAt: incident.updatedAt,
  };
};

const documentationToBackend = (
  item: DocumentationItem
) => {
  return {
    category: categoryToBackend[item.category] || "OTHER",
    subCategory: item.category,
    severity: "MEDIUM",
    status: uiStatusToBackend(item.status),
    title: item.title,
    description: buildBackendDescription({
      description: item.description,
      location: item.location,
      peopleInvolved: item.peopleInvolved,
      actionTaken: item.actionTaken,
    }),
    occurredAt: item.date
      ? new Date(`${item.date}T12:00:00`).toISOString()
      : undefined,
  };
};

function Documentation() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("safenet-theme");

    return savedTheme === "light" ? "light" : "dark";
  });

  const [records, setRecords] = useState<DocumentationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All categories");
  const [statusFilter, setStatusFilter] =
    useState("All statuses");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Incident");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [peopleInvolved, setPeopleInvolved] = useState("");
  const [description, setDescription] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [status, setStatus] =
    useState<DocumentationItem["status"]>("Recorded");

  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("safenet-theme");

    const nextTheme: Theme =
      savedTheme === "light" ? "light" : "dark";

    setTheme(nextTheme);
    document.documentElement.setAttribute(
      "data-theme",
      nextTheme
    );
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("safenet-theme", theme);
  }, [theme]);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getIncidents();

        const incidents: Incident[] =
          response?.incidents || [];

        setRecords(
          incidents.map(incidentToDocumentation)
        );
      } catch (err) {
        console.error(
          "Failed to load documentation:",
          err
        );

        setError(
          "Unable to load your documentation records."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.title.toLowerCase().includes(query) ||
        record.category.toLowerCase().includes(query) ||
        record.location.toLowerCase().includes(query) ||
        record.peopleInvolved
          .toLowerCase()
          .includes(query) ||
        record.description
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "All categories" ||
        record.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All statuses" ||
        record.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    records,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  const followUpCount = records.filter(
    (record) => record.status === "Follow-up"
  ).length;

  const resolvedCount = records.filter(
    (record) => record.status === "Resolved"
  ).length;

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Incident");
    setDate("");
    setLocation("");
    setPeopleInvolved("");
    setDescription("");
    setActionTaken("");
    setStatus("Recorded");
  };

  const openNewRecord = () => {
    resetForm();

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    setDate(today);
    setShowModal(true);
    setNotice("");
    setError("");
  };

  const handleEdit = (
    record: DocumentationItem
  ) => {
    setEditingId(record.id);
    setTitle(record.title);
    setCategory(record.category);
    setDate(record.date);
    setLocation(record.location);
    setPeopleInvolved(record.peopleInvolved);
    setDescription(record.description);
    setActionTaken(record.actionTaken);
    setStatus(record.status);

    setShowModal(true);
    setNotice("");
    setError("");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe what happened.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setNotice("");

      const localRecord: DocumentationItem = {
        id:
          editingId ||
          crypto.randomUUID(),
        title: title.trim(),
        category,
        date,
        location: location.trim(),
        peopleInvolved: peopleInvolved.trim(),
        description: description.trim(),
        actionTaken: actionTaken.trim(),
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const backendData =
        documentationToBackend(localRecord);

      if (editingId) {
        const response =
          await updateIncident(
            editingId,
            backendData
          );

        const updatedIncident: Incident =
          response.incident;

        const updatedRecord =
          incidentToDocumentation(
            updatedIncident
          );

        setRecords((current) =>
          current.map((record) =>
            record.id === editingId
              ? updatedRecord
              : record
          )
        );

        setNotice(
          "Documentation record updated successfully."
        );
      } else {
        const response =
          await createIncident(
            backendData
          );

        const createdIncident: Incident =
          response.incident;

        const createdRecord =
          incidentToDocumentation(
            createdIncident
          );

        setRecords((current) => [
          createdRecord,
          ...current,
        ]);

        setNotice(
          "Documentation record saved successfully."
        );
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(
        "Failed to save documentation:",
        err
      );

      setError(
        "Unable to save this documentation record. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this documentation record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setNotice("");

      await deleteIncident(id);

      setRecords((current) =>
        current.filter(
          (record) => record.id !== id
        )
      );

      setNotice(
        "Documentation record deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete documentation:",
        err
      );

      setError(
        "Unable to delete this documentation record."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      application: "SAFENET",
      exportedAt: new Date().toISOString(),
      records,
    };

    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      `safenet-documentation-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    setNotice(
      "Documentation exported successfully."
    );
  };

  const handleImport = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(
          String(reader.result)
        );

        if (
          !parsed ||
          !Array.isArray(parsed.records)
        ) {
          throw new Error(
            "Invalid documentation file"
          );
        }

        const importedRecords =
          parsed.records
            .filter(
              (item: DocumentationItem) =>
                item?.title &&
                item?.description
            )
            .map(
              (
                item: DocumentationItem
              ) => ({
                ...item,
                id: crypto.randomUUID(),
                createdAt:
                  item.createdAt ||
                  new Date().toISOString(),
                updatedAt:
                  new Date().toISOString(),
              })
            );

        setRecords((current) => [
          ...importedRecords,
          ...current,
        ]);

        setNotice(
          `${importedRecords.length} record(s) imported into the current view.`
        );
      } catch (err) {
        console.error(
          "Import error:",
          err
        );

        setError(
          "The selected file is not a valid SAFENET documentation export."
        );
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  return (
    <div className="documentation-page">
      <header className="documentation-header">
        <div className="documentation-header-left">
          <button
            className="documentation-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="documentation-brand">
            <div className="documentation-brand-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>Private Documentation</span>
            </div>
          </div>
        </div>

        <button
          className="documentation-theme-button"
          onClick={() =>
            setTheme((current) =>
              current === "dark"
                ? "light"
                : "dark"
            )
          }
          type="button"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>
      </header>

      <main className="documentation-main">
        <section className="documentation-hero">
          <div className="documentation-hero-content">
            <span className="documentation-eyebrow">
              <FileText size={16} />
              Private safety records
            </span>

            <h1>
              Document what happened.
              <br />
              Keep your record organized.
            </h1>

            <p>
              Record important incidents,
              keep details organized, and
              maintain a private history you
              can refer to when needed.
            </p>

            <div className="documentation-hero-meta">
              <ShieldCheck size={16} />
              <span>
                Your records are securely
                associated with your SAFENET
                account.
              </span>
            </div>
          </div>
        </section>

        <section className="documentation-actions">
          <div className="documentation-action-group">
            <button
              className="documentation-secondary-button"
              onClick={handleExport}
              type="button"
              disabled={loading}
            >
              <Download size={17} />
              Export
            </button>

            <label className="documentation-secondary-button documentation-import-button">
              <Import size={17} />
              Import
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                hidden
              />
            </label>
          </div>

          <button
            className="documentation-primary-button"
            onClick={openNewRecord}
            type="button"
            disabled={actionLoading}
          >
            <Plus size={18} />
            New Record
          </button>
        </section>

        <section className="documentation-security-banner">
          <div className="documentation-security-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <strong>
              Your documentation stays
              connected to your account
            </strong>

            <p>
              Records are stored through
              SAFENET's authenticated backend
              so they can be accessed from
              your account when you sign in.
            </p>
          </div>
        </section>

        {error && (
          <div
            className="documentation-notice documentation-notice-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {notice && !error && (
          <div
            className="documentation-notice"
            role="status"
          >
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        <section className="documentation-stats">
          <div className="documentation-stat-card">
            <div className="documentation-stat-icon">
              <ClipboardList size={21} />
            </div>

            <div>
              <span>Total records</span>
              <strong>{records.length}</strong>
            </div>
          </div>

          <div className="documentation-stat-card">
            <div className="documentation-stat-icon">
              <Filter size={21} />
            </div>

            <div>
              <span>Follow-up</span>
              <strong>{followUpCount}</strong>
            </div>
          </div>

          <div className="documentation-stat-card">
            <div className="documentation-stat-icon">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Resolved</span>
              <strong>{resolvedCount}</strong>
            </div>
          </div>
        </section>

        <section className="documentation-records-section">
          <div className="documentation-section-heading">
            <div>
              <span className="documentation-section-eyebrow">
                Your records
              </span>

              <h2>
                Incident timeline
              </h2>
            </div>

            <span className="documentation-record-count">
              {filteredRecords.length}{" "}
              {filteredRecords.length === 1
                ? "record"
                : "records"}
            </span>
          </div>

          <div className="documentation-filters">
            <div className="documentation-search">
              <Search size={18} />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search your records..."
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              aria-label="Filter by category"
            >
              <option>
                All categories
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              aria-label="Filter by status"
            >
              <option>
                All statuses
              </option>

              {statuses.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          {loading ? (
            <div className="documentation-empty-state">
              <ClipboardList size={32} />
              <h3>
                Loading your records...
              </h3>
              <p>
                Please wait while SAFENET
                loads your documentation.
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="documentation-empty-state">
              <ClipboardList size={34} />

              <h3>
                No documentation records
              </h3>

              <p>
                {records.length === 0
                  ? "Create your first private documentation record to keep important events organized."
                  : "No records match your current search or filters."}
              </p>

              {records.length === 0 && (
                <button
                  className="documentation-primary-button"
                  onClick={openNewRecord}
                  type="button"
                >
                  <Plus size={18} />
                  Create First Record
                </button>
              )}
            </div>
          ) : (
            <div className="documentation-timeline">
              {filteredRecords.map(
                (record) => (
                  <article
                    className="documentation-record-card"
                    key={record.id}
                  >
                    <div className="documentation-record-line" />

                    <div className="documentation-record-dot">
                      <FileText size={16} />
                    </div>

                    <div className="documentation-record-content">
                      <div className="documentation-record-header">
                        <div>
                          <span className="documentation-record-category">
                            {record.category}
                          </span>

                          <h3>
                            {record.title}
                          </h3>
                        </div>

                        <div className="documentation-record-actions">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                record
                              )
                            }
                            disabled={
                              actionLoading
                            }
                            aria-label="Edit record"
                          >
                            <Edit3
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                record.id
                              )
                            }
                            disabled={
                              actionLoading
                            }
                            aria-label="Delete record"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="documentation-record-meta">
                        <span>
                          <CalendarDays
                            size={15}
                          />
                          {record.date}
                        </span>

                        {record.location && (
                          <span>
                            <MapPin
                              size={15}
                            />
                            {record.location}
                          </span>
                        )}

                        {record.peopleInvolved && (
                          <span>
                            <Users
                              size={15}
                            />
                            {
                              record.peopleInvolved
                            }
                          </span>
                        )}
                      </div>

                      <div className="documentation-record-description">
                        <p>
                          {record.description}
                        </p>
                      </div>

                      {record.actionTaken && (
                        <div className="documentation-action-taken">
                          <strong>
                            Action taken
                          </strong>

                          <p>
                            {
                              record.actionTaken
                            }
                          </p>
                        </div>
                      )}

                      <div className="documentation-record-footer">
                        <span
                          className={`documentation-status documentation-status-${record.status
                            .toLowerCase()
                            .replace(
                              "-",
                              "-"
                            )}`}
                        >
                          {record.status}
                        </span>

                        <span className="documentation-updated">
                          Updated{" "}
                          {new Date(
                            record.updatedAt
                          ).toLocaleDateString()}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              record
                            )
                          }
                          disabled={
                            actionLoading
                          }
                        >
                          View / Edit
                        </button>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        <section className="documentation-safety-note">
          <div className="documentation-safety-note-icon">
            <UserRound size={21} />
          </div>

          <div>
            <strong>
              Document only what feels safe
            </strong>

            <p>
              You never need to record
              information that could put
              you or someone else at risk.
              Keep descriptions factual and
              use the information only when
              it is useful to you.
            </p>
          </div>
        </section>
      </main>

      <section className="documentation-emergency-strip">
        <div>
          <strong>
            Need immediate help?
          </strong>

          <span>
            Use SAFENET Emergency SOS if
            you are in immediate danger.
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/sos")
          }
        >
          Emergency SOS
        </button>
      </section>

      <footer className="documentation-footer">
        <span>
          © {new Date().getFullYear()}{" "}
          SAFENET
        </span>

        <span>
          Private documentation &
          personal safety tools
        </span>
      </footer>

      {showModal && (
        <div
          className="documentation-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="documentation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="documentation-modal-title"
          >
            <div className="documentation-modal-header">
              <div>
                <span className="documentation-section-eyebrow">
                  Private record
                </span>

                <h2 id="documentation-modal-title">
                  {editingId
                    ? "Edit documentation"
                    : "Create documentation"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="documentation-form">
              <div className="documentation-form-grid">
                <label>
                  <span>
                    Title *
                  </span>

                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value
                      )
                    }
                    placeholder="Example: Workplace incident"
                  />
                </label>

                <label>
                  <span>
                    Category
                  </span>

                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value
                      )
                    }
                  >
                    {categories.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  <span>
                    Date *
                  </span>

                  <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  <span>
                    Location
                  </span>

                  <input
                    type="text"
                    value={location}
                    onChange={(event) =>
                      setLocation(
                        event.target.value
                      )
                    }
                    placeholder="Where did it happen?"
                  />
                </label>

                <label>
                  <span>
                    People involved
                  </span>

                  <input
                    type="text"
                    value={peopleInvolved}
                    onChange={(event) =>
                      setPeopleInvolved(
                        event.target.value
                      )
                    }
                    placeholder="Names or roles"
                  />
                </label>

                <label>
                  <span>
                    Status
                  </span>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target
                          .value as DocumentationItem["status"]
                      )
                    }
                  >
                    {statuses.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>

              <label>
                <span>
                  What happened? *
                </span>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe what happened as clearly and factually as you can."
                  rows={6}
                />
              </label>

              <label>
                <span>
                  Action taken
                </span>

                <textarea
                  value={actionTaken}
                  onChange={(event) =>
                    setActionTaken(
                      event.target.value
                    )
                  }
                  placeholder="Describe any action already taken or planned."
                  rows={4}
                />
              </label>

              <div className="documentation-form-note">
                <ShieldCheck
                  size={17}
                />

                <span>
                  Keep the information factual
                  and include only details that
                  are safe for you to store.
                </span>
              </div>

              {error && (
                <div
                  className="documentation-notice documentation-notice-error"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="documentation-modal-actions">
                <button
                  type="button"
                  className="documentation-secondary-button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="documentation-primary-button"
                  onClick={handleSave}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Save Record"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documentation;
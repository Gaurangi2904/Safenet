import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  File as FileIcon,
  FileImage,
  FileText,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import "./EvidenceVault.css";

type EvidenceItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  hash: string;
  createdAt: string;
};

const STORAGE_KEY = "safenet_evidence_vault";

const categories = [
  "Incident",
  "Harassment",
  "Domestic Safety",
  "Workplace",
  "Online / Cyber",
  "Legal Document",
  "Other",
];

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) {
    return <FileImage size={21} />;
  }

  if (
    fileType.includes("pdf") ||
    fileType.includes("text") ||
    fileType.includes("document")
  ) {
    return <FileText size={21} />;
  }

  return <FileIcon size={21} />;
}

async function createFileHash(file: File) {
  const buffer = await file.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    buffer
  );

  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  );

  return hashArray
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
}

function EvidenceVault() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("safenet-theme") !== "light";
  });

  const [evidence, setEvidence] = useState<EvidenceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const parsed: unknown = JSON.parse(saved);

      return Array.isArray(parsed)
        ? (parsed as EvidenceItem[])
        : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("Incident");
  const [description, setDescription] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    localStorage.setItem(
      "safenet-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(evidence)
    );
  }, [evidence]);

  const filteredEvidence = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return evidence.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.fileName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    evidence,
    searchQuery,
    selectedCategory,
  ]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
  };

  const resetForm = () => {
    setTitle("");
    setCategory("Incident");
    setDescription("");
    setSelectedFile(null);
    setShowAddModal(false);
    setIsProcessing(false);
  };

  const handleAddEvidence = async () => {
    if (!title.trim()) {
      setNotice(
        "Please enter an evidence title."
      );
      return;
    }

    if (!selectedFile) {
      setNotice("Please select a file.");
      return;
    }

    setNotice("");
    setIsProcessing(true);

    try {
      const hash =
        await createFileHash(selectedFile);

      const newEvidence: EvidenceItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        description: description.trim(),
        fileName: selectedFile.name,
        fileType:
          selectedFile.type || "unknown",
        fileSize: selectedFile.size,
        hash,
        createdAt:
          new Date().toISOString(),
      };

      setEvidence((current) => [
        newEvidence,
        ...current,
      ]);

      setNotice(
        "Evidence added securely to this device."
      );

      setTimeout(() => {
        resetForm();
      }, 700);
    } catch {
      setNotice(
        "The evidence could not be processed. Please try again."
      );

      setIsProcessing(false);
    }
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Delete this evidence record from this device?"
    );

    if (!confirmed) {
      return;
    }

    setEvidence((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    setNotice(
      "Evidence record deleted."
    );
  };

  const handleExport = () => {
    if (evidence.length === 0) {
      setNotice(
        "There is no evidence record to export."
      );
      return;
    }

    const exportData = {
      exportedAt:
        new Date().toISOString(),
      application: "SAFENET",
      records: evidence,
    };

    const blob = new Blob(
      [
        JSON.stringify(
          exportData,
          null,
          2
        ),
      ],
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
      "safenet-evidence-records.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setNotice(
      "Evidence record exported."
    );
  };

  const totalSize = evidence.reduce(
    (total, item) =>
      total + item.fileSize,
    0
  );

  return (
    <div
      className={`evidence-page ${
        darkMode
          ? "evidence-dark"
          : "evidence-light"
      }`}
    >
      {/* =========================
          HEADER
      ========================= */}

      <header className="evidence-header">
        <div className="evidence-header-inner">
          <button
            className="evidence-back-button"
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="evidence-brand">
            <div className="evidence-brand-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>Evidence Vault</span>
            </div>
          </div>

          <button
            className="evidence-theme-button"
            type="button"
            onClick={() =>
              setDarkMode(
                (current) => !current
              )
            }
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <span>☀</span>
            ) : (
              <span>☾</span>
            )}
          </button>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="evidence-main">
        <section className="evidence-hero">
          <div>
            <div className="evidence-eyebrow">
              PRIVATE SAFETY TOOL
            </div>

            <h1>Evidence Vault</h1>

            <p>
              Keep a private record of important
              evidence related to incidents,
              harassment, safety concerns, or
              legal documentation.
            </p>
          </div>

          <div className="evidence-hero-actions">
            <button
              className="evidence-secondary-button"
              type="button"
              onClick={handleExport}
            >
              <Download size={17} />
              Export Records
            </button>

            <button
              className="evidence-primary-button"
              type="button"
              onClick={() => {
                setNotice("");
                setShowAddModal(true);
              }}
            >
              <Plus size={18} />
              Add Evidence
            </button>
          </div>
        </section>

        {/* =========================
            PRIVACY BANNER
        ========================= */}

        <section className="evidence-security-banner">
          <div className="evidence-security-icon">
            <LockKeyhole size={22} />
          </div>

          <div>
            <strong>
              Private device storage
            </strong>

            <p>
              This frontend version keeps evidence
              records in your browser's local storage.
              Backend encryption and secure cloud storage
              can be connected later.
            </p>
          </div>

          <div className="evidence-security-status">
            <CheckCircle2 size={16} />
            Local
          </div>
        </section>

        {/* =========================
            STATS
        ========================= */}

        <section className="evidence-stats">
          <div className="evidence-stat-card">
            <span>Total Records</span>
            <strong>
              {evidence.length}
            </strong>
          </div>

          <div className="evidence-stat-card">
            <span>Categories</span>

            <strong>
              {
                new Set(
                  evidence.map(
                    (item) =>
                      item.category
                  )
                ).size
              }
            </strong>
          </div>

          <div className="evidence-stat-card">
            <span>Stored Size</span>

            <strong>
              {formatFileSize(
                totalSize
              )}
            </strong>
          </div>

          <div className="evidence-stat-card">
            <span>Integrity</span>

            <strong className="integrity-text">
              SHA-256
            </strong>
          </div>
        </section>

        {/* =========================
            SEARCH / FILTER
        ========================= */}

        <section className="evidence-controls">
          <div className="evidence-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search evidence..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
            />
          </div>

          <div className="evidence-filters">
            <button
              type="button"
              className={
                selectedCategory === "All"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(
                  "All"
                )
              }
            >
              All
            </button>

            {categories.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    selectedCategory ===
                    item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedCategory(
                      item
                    )
                  }
                >
                  {item}
                </button>
              )
            )}
          </div>
        </section>

        {/* =========================
            NOTICE
        ========================= */}

        {notice && (
          <div className="evidence-notice">
            <CheckCircle2 size={17} />

            <span>
              {notice}
            </span>

            <button
              type="button"
              onClick={() =>
                setNotice("")
              }
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =========================
            EVIDENCE LIST
        ========================= */}

        <section className="evidence-list-section">
          <div className="evidence-section-heading">
            <div>
              <span>
                YOUR RECORDS
              </span>

              <h2>
                Evidence library
              </h2>
            </div>

            <span>
              {filteredEvidence.length}{" "}
              record
              {filteredEvidence.length !==
              1
                ? "s"
                : ""}
            </span>
          </div>

          {filteredEvidence.length ===
          0 ? (
            <div className="evidence-empty">
              <div className="evidence-empty-icon">
                <Upload size={28} />
              </div>

              <h3>
                No evidence records yet
              </h3>

              <p>
                Add screenshots, documents,
                photos, incident records, or
                other important files to begin
                building your private evidence
                library.
              </p>

              <button
                type="button"
                onClick={() => {
                  setNotice("");
                  setShowAddModal(true);
                }}
              >
                <Plus size={17} />
                Add Your First Evidence
              </button>
            </div>
          ) : (
            <div className="evidence-list">
              {filteredEvidence.map(
                (item) => (
                  <article
                    className="evidence-item"
                    key={item.id}
                  >
                    <div className="evidence-file-icon">
                      {getFileIcon(
                        item.fileType
                      )}
                    </div>

                    <div className="evidence-item-content">
                      <div className="evidence-item-top">
                        <div>
                          <h3>
                            {item.title}
                          </h3>

                          <div className="evidence-item-meta">
                            <span>
                              {item.category}
                            </span>

                            <span>
                              {item.fileName}
                            </span>
                          </div>
                        </div>

                        <div className="evidence-item-actions">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            aria-label="Delete evidence"
                            title="Delete evidence"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        </div>
                      </div>

                      {item.description && (
                        <p className="evidence-description">
                          {
                            item.description
                          }
                        </p>
                      )}

                      <div className="evidence-item-footer">
                        <span>
                          <Clock3
                            size={14}
                          />

                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </span>

                        <span>
                          {formatFileSize(
                            item.fileSize
                          )}
                        </span>

                        <span className="evidence-hash">
                          SHA-256:{" "}
                          {item.hash.slice(
                            0,
                            16
                          )}
                          ...
                        </span>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        {/* =========================
            SAFETY NOTE
        ========================= */}

        <section className="evidence-safety-note">
          <div>
            <ShieldCheck size={21} />
          </div>

          <div>
            <strong>
              Evidence safety reminder
            </strong>

            <p>
              Keep original files whenever
              possible. Do not edit or overwrite
              important evidence. For serious
              incidents, consider obtaining
              appropriate legal or professional
              guidance about preserving evidence.
            </p>
          </div>
        </section>
      </main>

      {/* =========================
          ADD EVIDENCE MODAL
      ========================= */}

      {showAddModal && (
        <div
          className="evidence-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !isProcessing
            ) {
              resetForm();
            }
          }}
        >
          <div className="evidence-modal">
            <div className="evidence-modal-header">
              <div>
                <span>
                  NEW RECORD
                </span>

                <h2>
                  Add Evidence
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={isProcessing}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="evidence-form">
              <label>
                Evidence title

                <input
                  type="text"
                  placeholder="Example: Harassment screenshot"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Category

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
                Description

                <textarea
                  placeholder="Add a short description or context..."
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                />
              </label>

              <label className="evidence-file-upload">
                <span>
                  <Upload size={21} />

                  <strong>
                    {selectedFile
                      ? selectedFile.name
                      : "Choose evidence file"}
                  </strong>

                  <small>
                    Screenshots, images, PDFs,
                    documents and other files
                  </small>
                </span>

                <input
                  type="file"
                  onChange={
                    handleFileChange
                  }
                />
              </label>

              {selectedFile && (
                <div className="selected-file">
                  <FileIcon size={17} />

                  <span>
                    {selectedFile.name}
                  </span>

                  <small>
                    {formatFileSize(
                      selectedFile.size
                    )}
                  </small>
                </div>
              )}

              {notice && (
                <div className="evidence-form-notice">
                  {notice}
                </div>
              )}

              <div className="evidence-modal-actions">
                <button
                  type="button"
                  className="evidence-cancel-button"
                  onClick={resetForm}
                  disabled={isProcessing}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="evidence-save-button"
                  onClick={
                    handleAddEvidence
                  }
                  disabled={
                    isProcessing
                  }
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <LockKeyhole
                        size={17}
                      />
                      Save Evidence
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvidenceVault;
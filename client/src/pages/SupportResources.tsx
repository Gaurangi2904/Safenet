import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Heart,
  Hospital,
  LockKeyhole,
  MapPin,
  Moon,
  Phone,
  Search,
  ShieldAlert,
  Star,
  Sun,
  Users,
  X,
} from "lucide-react";
import "./SupportResources.css";

type ResourceCategory =
  | "All"
  | "Emergency"
  | "Medical"
  | "Women Support"
  | "College"
  | "Workplace"
  | "Legal";

type SupportResource = {
  id: string;
  name: string;
  category: Exclude<ResourceCategory, "All">;
  description: string;
  phone?: string;
  location?: string;
  website?: string;
  important?: boolean;
};

const STORAGE_KEY = "safenet_support_resources";
const THEME_KEY = "safenet-theme";

const resources: SupportResource[] = [
  {
    id: "emergency-112",
    name: "Emergency Response",
    category: "Emergency",
    description:
      "For immediate emergencies requiring police, fire or ambulance assistance.",
    phone: "112",
    location: "India",
    important: true,
  },
  {
    id: "women-181",
    name: "Women Helpline",
    category: "Women Support",
    description:
      "Women Helpline support information for women seeking assistance.",
    phone: "181",
    location: "India",
    important: true,
  },
  {
    id: "cyber-1930",
    name: "Cyber Crime Helpline",
    category: "Legal",
    description:
      "Helpline for reporting or seeking assistance regarding cyber-related financial crime.",
    phone: "1930",
    location: "India",
    important: true,
  },
  {
    id: "child-1098",
    name: "Child Helpline",
    category: "Women Support",
    description:
      "Support resource for children who may need immediate assistance.",
    phone: "1098",
    location: "India",
    important: true,
  },
  {
    id: "medical-support",
    name: "Nearest Medical Support",
    category: "Medical",
    description:
      "Use this category to record a hospital, clinic or medical professional you trust.",
    location: "Add your trusted medical location",
  },
  {
    id: "college-support",
    name: "College / Institution Support",
    category: "College",
    description:
      "Keep details of your college authority, student support office or other trusted institutional contact.",
    location: "Add your institution",
  },
  {
    id: "workplace-support",
    name: "Workplace Support",
    category: "Workplace",
    description:
      "Keep details of HR, manager, Internal Committee or another workplace support contact.",
    location: "Add your workplace",
  },
  {
    id: "legal-support",
    name: "Legal Support",
    category: "Legal",
    description:
      "Keep details of a legal professional, legal-aid service or organization you trust.",
    location: "Add your legal support resource",
  },
];

const categories: ResourceCategory[] = [
  "All",
  "Emergency",
  "Medical",
  "Women Support",
  "College",
  "Workplace",
  "Legal",
];

function SupportResources() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] =
    useState<ResourceCategory>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<SupportResource | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    const storedSaved = localStorage.getItem(STORAGE_KEY);

    if (storedSaved) {
      try {
        const parsed = JSON.parse(storedSaved);

        if (Array.isArray(parsed)) {
          setSavedResources(parsed);
        }
      } catch {
        setSavedResources([]);
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

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    setIsDark(!isDark);
    localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const toggleSaved = (resourceId: string) => {
    setSavedResources((current) => {
      const updated = current.includes(resourceId)
        ? current.filter((id) => id !== resourceId)
        : [...current, resourceId];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  const filteredResources = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "All" || resource.category === activeCategory;

      const matchesSearch =
        !query ||
        resource.name.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.location?.toLowerCase().includes(query);

      const matchesSaved =
        !showSavedOnly || savedResources.includes(resource.id);

      return matchesCategory && matchesSearch && matchesSaved;
    });
  }, [activeCategory, searchTerm, showSavedOnly, savedResources]);

  const savedCount = savedResources.length;

  const getCategoryIcon = (category: SupportResource["category"]) => {
    switch (category) {
      case "Emergency":
        return <ShieldAlert size={20} />;
      case "Medical":
        return <Hospital size={20} />;
      case "Women Support":
        return <Heart size={20} />;
      case "College":
        return <Building2 size={20} />;
      case "Workplace":
        return <Users size={20} />;
      case "Legal":
        return <CheckCircle2 size={20} />;
      default:
        return <MapPin size={20} />;
    }
  };

  const getCategoryClass = (
    category: SupportResource["category"],
  ) => {
    switch (category) {
      case "Emergency":
        return "emergency";
      case "Medical":
        return "medical";
      case "Women Support":
        return "women";
      case "College":
        return "college";
      case "Workplace":
        return "workplace";
      case "Legal":
        return "legal";
      default:
        return "general";
    }
  };

  return (
    <div className="support-resources-page">
      <header className="support-resources-header">
        <div className="support-resources-header-left">
          <button
            className="support-resources-back"
            onClick={() => navigate("/dashboard")}
            type="button"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="support-resources-eyebrow">
              <ShieldAlert size={15} />
              SAFENET SUPPORT NETWORK
            </div>

            <h1>Safe Places & Support</h1>

            <p>
              Keep important safety resources available when you need them.
            </p>
          </div>
        </div>

        <button
          className="support-resources-theme"
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </header>

      <main className="support-resources-main">
        <section className="support-resources-hero">
          <div className="support-resources-hero-icon">
            <MapPin size={29} />
          </div>

          <div className="support-resources-hero-content">
            <span>SAFETY RESOURCE DIRECTORY</span>

            <h2>Know where to turn for support.</h2>

            <p>
              Organize emergency, medical, institutional, workplace and other
              support resources in one place.
            </p>
          </div>

          <div className="support-resources-stat">
            <strong>{savedCount}</strong>
            <span>saved resources</span>
          </div>
        </section>

        <section className="support-resources-notice">
          <LockKeyhole size={18} />

          <div>
            <strong>Your saved resources stay on this device</strong>
            <span>
              SAFENET currently stores your saved-resource preferences locally.
              Backend synchronization can be added later.
            </span>
          </div>
        </section>

        <section className="support-resources-toolbar">
          <div className="support-resources-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search support resources..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                type="button"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className={`support-resources-saved-filter ${
              showSavedOnly ? "active" : ""
            }`}
            onClick={() => setShowSavedOnly((current) => !current)}
            type="button"
          >
            <Star size={16} />
            Saved
          </button>
        </section>

        <section className="support-resources-categories">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? "active" : ""}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </section>

        <section className="support-resources-results-header">
          <div>
            <strong>Support resources</strong>
            <span>
              {filteredResources.length} resource
              {filteredResources.length === 1 ? "" : "s"} available
            </span>
          </div>
        </section>

        {filteredResources.length > 0 ? (
          <section className="support-resources-grid">
            {filteredResources.map((resource) => {
              const isSaved = savedResources.includes(resource.id);

              return (
                <article
                  className="support-resource-card"
                  key={resource.id}
                >
                  <div className="support-resource-card-top">
                    <div
                      className={`support-resource-icon ${getCategoryClass(
                        resource.category,
                      )}`}
                    >
                      {getCategoryIcon(resource.category)}
                    </div>

                    <button
                      className={`support-resource-star ${
                        isSaved ? "saved" : ""
                      }`}
                      onClick={() => toggleSaved(resource.id)}
                      type="button"
                      aria-label={
                        isSaved
                          ? `Remove ${resource.name} from saved resources`
                          : `Save ${resource.name}`
                      }
                    >
                      <Star
                        size={18}
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="support-resource-category">
                    {resource.category}
                  </div>

                  <h3>{resource.name}</h3>

                  <p>{resource.description}</p>

                  {resource.phone && (
                    <div className="support-resource-detail">
                      <Phone size={15} />
                      <span>{resource.phone}</span>
                    </div>
                  )}

                  {resource.location && (
                    <div className="support-resource-detail">
                      <MapPin size={15} />
                      <span>{resource.location}</span>
                    </div>
                  )}

                  <button
                    className="support-resource-view"
                    onClick={() => setSelectedResource(resource)}
                    type="button"
                  >
                    View resource
                    <ChevronRight size={16} />
                  </button>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="support-resources-empty">
            <Search size={28} />

            <h3>No resources found</h3>

            <p>
              Try a different search, category or turn off the Saved filter.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("All");
                setShowSavedOnly(false);
              }}
              type="button"
            >
              Clear filters
            </button>
          </section>
        )}

        <section className="support-resources-safety-note">
          <ShieldAlert size={19} />

          <div>
            <strong>For immediate danger</strong>
            <span>
              Use appropriate emergency services or seek help from a trusted
              person or nearby safe location.
            </span>
          </div>
        </section>
      </main>

      {selectedResource && (
        <div
          className="support-resources-modal-overlay"
          onMouseDown={() => setSelectedResource(null)}
        >
          <div
            className="support-resources-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="support-resources-modal-close"
              onClick={() => setSelectedResource(null)}
              type="button"
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div
              className={`support-resource-icon large ${getCategoryClass(
                selectedResource.category,
              )}`}
            >
              {getCategoryIcon(selectedResource.category)}
            </div>

            <div className="support-resources-modal-category">
              {selectedResource.category}
            </div>

            <h2>{selectedResource.name}</h2>

            <p>{selectedResource.description}</p>

            {selectedResource.phone && (
              <a
                className="support-resources-modal-action"
                href={`tel:${selectedResource.phone}`}
              >
                <Phone size={17} />
                Call {selectedResource.phone}
              </a>
            )}

            {selectedResource.location && (
              <div className="support-resources-modal-detail">
                <MapPin size={17} />
                <span>{selectedResource.location}</span>
              </div>
            )}

            {selectedResource.website && (
              <a
                className="support-resources-modal-action secondary"
                href={selectedResource.website}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={17} />
                Open website
              </a>
            )}

            <button
              className={`support-resources-modal-save ${
                savedResources.includes(selectedResource.id)
                  ? "saved"
                  : ""
              }`}
              onClick={() => toggleSaved(selectedResource.id)}
              type="button"
            >
              <Star
                size={17}
                fill={
                  savedResources.includes(selectedResource.id)
                    ? "currentColor"
                    : "none"
                }
              />

              {savedResources.includes(selectedResource.id)
                ? "Saved resource"
                : "Save resource"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportResources;
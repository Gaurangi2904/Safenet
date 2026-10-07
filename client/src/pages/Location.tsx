import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Compass,
  Crosshair,
  Heart,
  Lock,
  MapPin,
  Navigation,
  Shield,
  ShieldCheck,
  Smartphone,
  Users,
  X,
  Zap,
} from "lucide-react";
import "./Location.css";

type LocationStatus = "inactive" | "active";

interface LocationActivity {
  id: number;
  title: string;
  description: string;
  time: string;
}

interface SavedLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const STORAGE_KEY = "safenet_location";

function Location() {
  const navigate = useNavigate();

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("inactive");

  const [locationName, setLocationName] =
    useState("Location not shared");

  const [activities, setActivities] =
    useState<LocationActivity[]>([]);

  const [message, setMessage] = useState("");

  const [showDetails, setShowDetails] = useState(false);

  const [theme, setTheme] =
    useState<"light" | "dark">("light");

  const [currentLocation, setCurrentLocation] =
    useState<SavedLocation | null>(null);

  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("safenet-theme");

    setTheme(savedTheme === "dark" ? "dark" : "light");

    const savedLocation =
      localStorage.getItem(STORAGE_KEY);

    if (!savedLocation) return;

    try {
      const parsed = JSON.parse(savedLocation);

      if (parsed.status) {
        setLocationStatus(parsed.status);
      }

      if (parsed.locationName) {
        setLocationName(parsed.locationName);
      }

      if (Array.isArray(parsed.activities)) {
        setActivities(parsed.activities);
      }

      if (parsed.currentLocation) {
        setCurrentLocation(parsed.currentLocation);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme =
        document.documentElement.getAttribute(
          "data-theme"
        );

      setTheme(
        currentTheme === "dark" ? "dark" : "light"
      );
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const data = {
      status: locationStatus,
      locationName,
      activities,
      currentLocation,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }, [
    locationStatus,
    locationName,
    activities,
    currentLocation,
  ]);

  const addActivity = (
    title: string,
    description: string
  ) => {
    const newActivity: LocationActivity = {
      id: Date.now(),
      title,
      description,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setActivities((previous) => [
      newActivity,
      ...previous,
    ]);
  };

  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      setMessage(
        "Location services are not supported by this browser."
      );
      return;
    }

    setIsLocating(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const savedLocation: SavedLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(savedLocation);
        setLocationStatus("active");
        setLocationName(
          "Safety location sharing active"
        );

        addActivity(
          "Location sharing enabled",
          "Your current device location was detected successfully."
        );

        setMessage(
          "Location safety mode is now active."
        );

        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);

        if (error.code === 1) {
          setMessage(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          setMessage(
            "Your current location could not be detected. Please try again."
          );
        } else {
          setMessage(
            "Location detection timed out. Please try again."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const handleDisableLocation = () => {
    setLocationStatus("inactive");
    setLocationName("Location not shared");
    setCurrentLocation(null);

    addActivity(
      "Location sharing stopped",
      "Location safety mode was stopped on this device."
    );

    setMessage(
      "Location sharing has been stopped."
    );
  };

  const handleRefreshLocation = () => {
    if (locationStatus !== "active") {
      handleEnableLocation();
      return;
    }

    handleEnableLocation();
  };

  const handleClearMessage = () => {
    setMessage("");
  };

  return (
    <div
      className={`location-page ${
        theme === "dark"
          ? "location-dark"
          : "location-light"
      }`}
    >
      <header className="location-header">
        <div className="location-header-inner">
          <button
            className="location-back-button"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <ArrowLeft size={17} />
            <span>Dashboard</span>
          </button>

          <div className="location-brand">
            <div className="location-brand-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>Location Safety</span>
            </div>
          </div>

          <button
            className="location-sos-button"
            onClick={() => navigate("/sos")}
            type="button"
          >
            <Zap size={16} />
            <span>SOS</span>
          </button>
        </div>
      </header>

      <main className="location-main">
        <section className="location-hero">
          <div className="location-hero-copy">
            <div className="location-eyebrow">
              <Navigation size={14} />
              Safety Location
            </div>

            <h1>
              Stay visible.
              <br />
              Stay connected.
            </h1>

            <p>
              Use SAFENET location safety to keep your
              trusted safety network informed while you
              travel.
            </p>

            <div className="location-security-note">
              <Lock size={15} />
              <span>
                Location controls stay under your control.
              </span>
            </div>
          </div>

          <div
            className={`location-status-card ${
              locationStatus === "active"
                ? "active"
                : "inactive"
            }`}
          >
            <div className="location-status-top">
              <div className="location-status-icon">
                <MapPin size={25} />
              </div>

              <div
                className={`location-live-dot ${
                  locationStatus === "active"
                    ? "live"
                    : ""
                }`}
              >
                <span />
                {locationStatus === "active"
                  ? "ACTIVE"
                  : "OFF"}
              </div>
            </div>

            <span className="location-status-kicker">
              LOCATION STATUS
            </span>

            <h2>
              {locationStatus === "active"
                ? "Safety location active"
                : "Location sharing is off"}
            </h2>

            <p>
              {locationStatus === "active"
                ? "Your device location has been detected and safety mode is active."
                : "Turn on location safety when you want to use your device location for SAFENET."}
            </p>

            <div className="location-status-divider" />

            <div className="location-status-detail">
              <span>Current status</span>

              <strong>
                {locationStatus === "active"
                  ? "Protected"
                  : "Not active"}
              </strong>
            </div>

            <div className="location-status-detail">
              <span>Sharing mode</span>

              <strong>
                {locationStatus === "active"
                  ? "Safety mode"
                  : "Disabled"}
              </strong>
            </div>

            {currentLocation && (
              <div className="location-status-detail">
                <span>GPS accuracy</span>

                <strong>
                  {Math.round(
                    currentLocation.accuracy
                  )}
                  m
                </strong>
              </div>
            )}
          </div>
        </section>

        {message && (
          <div className="location-message">
            <CheckCircle2 size={17} />

            <span>{message}</span>

            <button
              type="button"
              onClick={handleClearMessage}
              aria-label="Close message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="location-grid">
          <div className="location-card location-control-card">
            <div className="location-card-heading">
              <div>
                <span className="location-card-kicker">
                  CONTROL CENTER
                </span>

                <h2>Location safety</h2>
              </div>

              <div className="location-card-icon">
                <Crosshair size={20} />
              </div>
            </div>

            <p className="location-card-description">
              Activate or stop your location safety mode
              whenever you need it.
            </p>

            <div className="location-control-display">
              <div className="location-control-map">
                <div className="map-grid-lines" />

                <div className="map-circle map-circle-one" />
                <div className="map-circle map-circle-two" />

                <div
                  className={`map-location-marker ${
                    locationStatus === "active"
                      ? "marker-active"
                      : ""
                  }`}
                >
                  <MapPin size={23} />
                </div>

                {locationStatus === "active" && (
                  <div className="map-pulse" />
                )}

                <div className="map-label">
                  <span>SAFENET</span>

                  <strong>
                    {locationStatus === "active"
                      ? "Safety zone active"
                      : "Waiting for activation"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="location-control-info">
              <div>
                <div className="location-info-icon">
                  <Compass size={17} />
                </div>

                <div>
                  <span>Status</span>
                  <strong>{locationName}</strong>
                </div>
              </div>

              <div>
                <div className="location-info-icon">
                  <Smartphone size={17} />
                </div>

                <div>
                  <span>Device</span>
                  <strong>This device</strong>
                </div>
              </div>
            </div>

            {currentLocation && (
              <div className="location-coordinates">
                <div>
                  <span>Latitude</span>
                  <strong>
                    {currentLocation.latitude.toFixed(6)}
                  </strong>
                </div>

                <div>
                  <span>Longitude</span>
                  <strong>
                    {currentLocation.longitude.toFixed(6)}
                  </strong>
                </div>
              </div>
            )}

            <div className="location-control-actions">
              {locationStatus === "inactive" ? (
                <button
                  className="location-primary-button"
                  type="button"
                  onClick={handleEnableLocation}
                  disabled={isLocating}
                >
                  <Navigation size={17} />

                  {isLocating
                    ? "Detecting Location..."
                    : "Enable Location Safety"}
                </button>
              ) : (
                <div className="location-action-row">
                  <button
                    className="location-primary-button"
                    type="button"
                    onClick={handleRefreshLocation}
                    disabled={isLocating}
                  >
                    <Navigation size={17} />

                    {isLocating
                      ? "Updating..."
                      : "Refresh Location"}
                  </button>

                  <button
                    className="location-danger-button"
                    type="button"
                    onClick={handleDisableLocation}
                  >
                    <X size={17} />
                    Stop Sharing
                  </button>
                </div>
              )}
            </div>

            <button
              className="location-details-button"
              type="button"
              onClick={() =>
                setShowDetails(!showDetails)
              }
            >
              <span>
                {showDetails
                  ? "Hide safety details"
                  : "View safety details"}
              </span>

              <ArrowRight
                size={16}
                className={
                  showDetails
                    ? "rotate-arrow"
                    : ""
                }
              />
            </button>

            {showDetails && (
              <div className="location-details-panel">
                <div>
                  <CheckCircle2 size={16} />
                  <span>
                    You can stop location safety at any
                    time.
                  </span>
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  <span>
                    Your browser asks for location
                    permission before detecting GPS.
                  </span>
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  <span>
                    Current coordinates are stored locally
                    for this frontend implementation.
                  </span>
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  <span>
                    Backend location sharing will be
                    integrated in the next backend phase.
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="location-card">
            <div className="location-card-heading">
              <div>
                <span className="location-card-kicker">
                  SAFETY NETWORK
                </span>

                <h2>Stay connected</h2>
              </div>

              <div className="location-card-icon">
                <Users size={20} />
              </div>
            </div>

            <p className="location-card-description">
              Location safety is designed to work together
              with your trusted safety network.
            </p>

            <div className="location-network-list">
              <div className="location-network-item">
                <div className="network-item-icon">
                  <Users size={18} />
                </div>

                <div>
                  <strong>Trusted contacts</strong>

                  <p>
                    Keep important people connected to your
                    safety plan.
                  </p>
                </div>

                <CheckCircle2
                  size={17}
                  className="network-check"
                />
              </div>

              <div className="location-network-item">
                <div className="network-item-icon">
                  <Clock3 size={18} />
                </div>

                <div>
                  <strong>Safety Journey</strong>

                  <p>
                    Combine location safety with a planned
                    journey.
                  </p>
                </div>

                <CheckCircle2
                  size={17}
                  className="network-check"
                />
              </div>

              <div className="location-network-item">
                <div className="network-item-icon">
                  <Heart size={18} />
                </div>

                <div>
                  <strong>Check-In</strong>

                  <p>
                    Let your safety routine include regular
                    check-ins.
                  </p>
                </div>

                <CheckCircle2
                  size={17}
                  className="network-check"
                />
              </div>
            </div>

            <button
              className="location-secondary-button"
              type="button"
              onClick={() =>
                navigate("/trusted-contacts")
              }
            >
              Open Trusted Contacts
              <ArrowRight size={16} />
            </button>

            <button
              className="location-secondary-button"
              type="button"
              onClick={() => navigate("/journey")}
            >
              Open Safety Journey
              <ArrowRight size={16} />
            </button>

            <button
              className="location-secondary-button"
              type="button"
              onClick={() => navigate("/checkin")}
            >
              Open Check-In
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="location-lower-grid">
          <div className="location-card location-activity-card">
            <div className="location-card-heading">
              <div>
                <span className="location-card-kicker">
                  ACTIVITY
                </span>

                <h2>Location history</h2>
              </div>

              <div className="location-card-icon">
                <Clock3 size={20} />
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="location-empty-state">
                <Clock3 size={27} />

                <h3>No location activity yet</h3>

                <p>
                  Your device activity will appear here
                  when you enable or disable location
                  safety.
                </p>
              </div>
            ) : (
              <div className="location-activity-list">
                {activities
                  .slice(0, 5)
                  .map((activity) => (
                    <div
                      className="location-activity-item"
                      key={activity.id}
                    >
                      <div className="activity-status-icon">
                        <CheckCircle2 size={17} />
                      </div>

                      <div className="activity-content">
                        <strong>
                          {activity.title}
                        </strong>

                        <span>
                          {activity.description}
                        </span>
                      </div>

                      <time>{activity.time}</time>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="location-card location-tips-card">
            <div className="location-card-heading">
              <div>
                <span className="location-card-kicker">
                  SAFETY GUIDANCE
                </span>

                <h2>Smart location habits</h2>
              </div>

              <div className="location-card-icon">
                <Shield size={20} />
              </div>
            </div>

            <div className="location-tips">
              <div className="location-tip">
                <div className="tip-number">01</div>

                <div>
                  <strong>
                    Use it when travelling
                  </strong>

                  <p>
                    Activate location safety when starting
                    a journey or travelling alone.
                  </p>
                </div>
              </div>

              <div className="location-tip">
                <div className="tip-number">02</div>

                <div>
                  <strong>
                    Keep your device charged
                  </strong>

                  <p>
                    A charged phone helps you stay connected
                    to your safety tools.
                  </p>
                </div>
              </div>

              <div className="location-tip">
                <div className="tip-number">03</div>

                <div>
                  <strong>Use SOS when needed</strong>

                  <p>
                    If you are in immediate danger, use the
                    dedicated SOS feature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="location-emergency">
          <div className="location-emergency-icon">
            <Zap size={22} />
          </div>

          <div className="location-emergency-copy">
            <span>EMERGENCY ACCESS</span>

            <h2>Need immediate help?</h2>

            <p>
              Use SAFENET SOS to access your emergency
              safety flow.
            </p>
          </div>

          <button
            className="location-emergency-button"
            type="button"
            onClick={() => navigate("/sos")}
          >
            Open SOS
            <ArrowRight size={16} />
          </button>
        </section>

        <div className="location-disclaimer">
          <Lock size={13} />

          <span>
            Current frontend implementation uses your
            browser's location permission. Backend sharing
            will be connected during backend integration.
          </span>
        </div>
      </main>

      <footer className="location-footer">
        <div>
          <strong>SAFENET</strong>
          <span>
            Safety technology for everyday journeys.
          </span>
        </div>

        <span>
          Location Safety • Frontend
        </span>
      </footer>
    </div>
  );
}

export default Location;
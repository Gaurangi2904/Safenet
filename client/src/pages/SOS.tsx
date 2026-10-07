import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SOS.css";

import {
  triggerSos,
  getSosEvents,
  resolveSos,
} from "../api/sos";

import type { SosEvent } from "../api/sos";

function SOS() {
  const navigate = useNavigate();

  const [emergencyActive, setEmergencyActive] = useState(false);
  const [activeSos, setActiveSos] = useState<SosEvent | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Load existing SOS events
  useEffect(() => {
    const loadSosEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSosEvents();

        const events: SosEvent[] = response?.sosEvents || [];

        const activeEvent =
          events.find((event) => event.status === "ACTIVE") || null;

        setActiveSos(activeEvent);
        setEmergencyActive(Boolean(activeEvent));
      } catch (err) {
        console.error("Failed to load SOS events:", err);
        setError("Unable to load your emergency status.");
      } finally {
        setLoading(false);
      }
    };

    loadSosEvents();
  }, []);

  // Get current GPS location
  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  };

  // Activate SOS
  const handleSOS = async () => {
    try {
      setActionLoading(true);
      setError("");

      const location = await getCurrentLocation();

      const response = await triggerSos({
        latitude: location?.latitude,
        longitude: location?.longitude,
      });

      const createdSos: SosEvent | null =
        response?.sosEvent || null;

      setActiveSos(createdSos);
      setEmergencyActive(true);
    } catch (err) {
      console.error("SOS activation error:", err);
      setError(
        "Unable to activate SOS. Please check your connection and try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Resolve SOS
  const handleCancel = async () => {
    if (!activeSos) {
      setEmergencyActive(false);
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await resolveSos(activeSos.id);

      setActiveSos(null);
      setEmergencyActive(false);
    } catch (err) {
      console.error("SOS resolve error:", err);
      setError(
        "Unable to resolve the emergency session. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="sos-page">

      {/* =====================================================
          TOP NAVIGATION
          ===================================================== */}

      <header className="sos-header">

        <button
          className="sos-brand"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          <span className="sos-brand-icon">🛡️</span>

          <span className="sos-brand-text">
            <strong>SAFENET</strong>
            <small>PERSONAL SAFETY NETWORK</small>
          </span>
        </button>

        <div className="sos-header-status">
          <span className="sos-status-dot"></span>
          Safety system active
        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="sos-main">

        {/* BACK LINK */}

        <button
          className="sos-back"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span>
          Back to Dashboard
        </button>


        {/* =====================================================
            PAGE INTRO
            ===================================================== */}

        <section className="sos-intro">

          <span className="sos-eyebrow">
            EMERGENCY RESPONSE
          </span>

          <h1>
            Emergency
            <span>SOS</span>
          </h1>

          <p>
            Use the emergency control below when you need
            immediate assistance from your trusted safety network.
          </p>

        </section>


        {/* ERROR */}

        {error && (
          <div className="sos-error" role="alert">
            {error}
          </div>
        )}


        {/* =====================================================
            EMERGENCY COMMAND PANEL
            ===================================================== */}

        <section
          className={`sos-command-panel ${
            emergencyActive ? "emergency-active" : ""
          }`}
        >

          <div className="sos-command-glow"></div>

          <div className="sos-command-content">

            {loading ? (
              <>
                <div className="sos-warning-icon">
                  …
                </div>

                <span className="sos-command-label">
                  EMERGENCY CONTROL
                </span>

                <h2>
                  Checking safety status
                </h2>

                <p>
                  Please wait while SAFENET checks your
                  emergency session.
                </p>
              </>
            ) : !emergencyActive ? (
              <>
                <div className="sos-warning-icon">
                  !
                </div>

                <span className="sos-command-label">
                  EMERGENCY CONTROL
                </span>

                <h2>
                  Need immediate help?
                </h2>

                <p>
                  Activate SOS to begin an emergency response
                  session and prepare your safety network.
                </p>

                <button
                  className="sos-main-button"
                  type="button"
                  onClick={handleSOS}
                  disabled={actionLoading}
                >
                  <span className="sos-main-circle">
                    🚨
                  </span>

                  <span className="sos-main-text">
                    <small>
                      {actionLoading ? "ACTIVATING" : "ACTIVATE"}
                    </small>

                    <strong>
                      Emergency SOS
                    </strong>
                  </span>

                  <span className="sos-main-arrow">
                    →
                  </span>
                </button>

                <div className="sos-command-note">
                  <span>●</span>
                  Press only when you need emergency assistance
                </div>
              </>
            ) : (
              <>
                <div className="sos-active-icon">
                  !
                </div>

                <span className="sos-command-label active-label">
                  EMERGENCY SESSION ACTIVE
                </span>

                <h2>
                  SOS is active
                </h2>

                <p>
                  Your emergency session has been activated.
                  Keep this screen open while assistance is being arranged.
                </p>

                <div className="sos-active-status">

                  <div className="active-status-item">
                    <span className="active-status-icon">
                      ✓
                    </span>

                    <div>
                      <strong>Emergency mode</strong>
                      <small>Active</small>
                    </div>
                  </div>

                  <div className="active-status-item">
                    <span className="active-status-icon">
                      ◎
                    </span>

                    <div>
                      <strong>Safety network</strong>
                      <small>Preparing response</small>
                    </div>
                  </div>

                  <div className="active-status-item">
                    <span className="active-status-icon">
                      ●
                    </span>

                    <div>
                      <strong>Session</strong>
                      <small>Live</small>
                    </div>
                  </div>

                </div>

                {activeSos?.latitude != null &&
                  activeSos?.longitude != null && (
                    <div className="sos-location-info">
                      📍 Emergency location captured
                    </div>
                  )}

                <button
                  className="sos-cancel-button"
                  type="button"
                  onClick={handleCancel}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Resolving Emergency Session..."
                    : "Cancel Emergency Session"}
                </button>
              </>
            )}

          </div>

        </section>


        {/* =====================================================
            RESPONSE INFORMATION
            ===================================================== */}

        <section className="sos-info-grid">

          {/* TRUSTED CIRCLE */}

          <div className="sos-info-card">

            <div className="sos-info-icon purple">
              👥
            </div>

            <div className="sos-info-content">

              <span className="sos-info-label">
                TRUSTED CIRCLE
              </span>

              <h3>
                Emergency contacts
              </h3>

              <p>
                Your trusted contacts are the people
                you have selected for emergency situations.
              </p>

              <button
                type="button"
                onClick={() => navigate("/trusted-contacts")}
              >
                Manage Trusted Circle
                <span>→</span>
              </button>

            </div>

          </div>


          {/* LOCATION */}

          <div className="sos-info-card">

            <div className="sos-info-icon blue">
              📍
            </div>

            <div className="sos-info-content">

              <span className="sos-info-label">
                LOCATION
              </span>

              <h3>
                Location sharing
              </h3>

              <p>
                SAFENET can use an active safety session
                to support location-based emergency features.
              </p>

              <button
                type="button"
                onClick={() => navigate("/location")}
              >
                Open Live Location
                <span>→</span>
              </button>

            </div>

          </div>

        </section>


        {/* =====================================================
            SAFETY NOTE
            ===================================================== */}

        <section className="sos-safety-note">

          <div className="sos-note-icon">
            🛡️
          </div>

          <div>

            <span>
              IMPORTANT
            </span>

            <h3>
              In an immediate life-threatening emergency
            </h3>

            <p>
              Contact your local emergency services directly.
              SAFENET is designed to support your personal safety
              network and should not replace emergency services.
            </p>

          </div>

        </section>


        {/* =====================================================
            FOOTER
            ===================================================== */}

        <footer className="sos-footer">

          <div className="sos-footer-brand">

            <div className="sos-footer-icon">
              🛡️
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>
                Personal safety network
              </span>
            </div>

          </div>


          <div className="sos-footer-links">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/trusted-contacts")}
            >
              Trusted Circle
            </button>

            <button
              type="button"
              onClick={() => navigate("/checkin")}
            >
              Check-In
            </button>

            <button
              type="button"
              onClick={() => navigate("/location")}
            >
              Live Location
            </button>

          </div>


          <div className="sos-footer-secure">
            <span>●</span>
            Secure session
          </div>

        </footer>

      </main>

    </div>
  );
}

export default SOS;
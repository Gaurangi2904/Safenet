import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Journey.css";

import {
  createSafetyJourney,
  getSafetyJourneys,
  endSafetyJourney,
} from "../api/safetyJourney";

import type { SafetyJourney } from "../api/safetyJourney";

function Journey() {
  const navigate = useNavigate();

  const [journeyStarted, setJourneyStarted] = useState(false);
  const [destination, setDestination] = useState("");
  const [startPoint, setStartPoint] = useState("Current location");
  const [notifyContacts, setNotifyContacts] = useState(true);

  const [activeJourney, setActiveJourney] =
    useState<SafetyJourney | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD EXISTING JOURNEYS
     ===================================================== */

  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSafetyJourneys();

        const journeys: SafetyJourney[] = response?.journeys || [];

        const active = journeys.find(
          (journey) => journey.status === "ACTIVE"
        );

        if (active) {
          setActiveJourney(active);
          setJourneyStarted(true);
          setDestination(active.destination);
        }
      } catch (err: any) {
        console.error("Failed to load safety journeys:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load your safety journeys."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJourneys();
  }, []);

  /* =====================================================
     START JOURNEY
     ===================================================== */

  const handleStartJourney = async () => {
    if (!destination.trim()) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const response = await createSafetyJourney({
        destination: destination.trim(),
      });

      const createdJourney: SafetyJourney = response.journey;

      setActiveJourney(createdJourney);
      setJourneyStarted(true);
    } catch (err: any) {
      console.error("Failed to start safety journey:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to start the safety journey."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =====================================================
     END JOURNEY
     ===================================================== */

  const handleEndJourney = async () => {
    if (!activeJourney) {
      setJourneyStarted(false);
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await endSafetyJourney(activeJourney.id);

      setActiveJourney(null);
      setJourneyStarted(false);
      setDestination("");
    } catch (err: any) {
      console.error("Failed to end safety journey:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to end the safety journey."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="journey-page">

      {/* =====================================================
          TOP NAVIGATION
          ===================================================== */}

      <header className="journey-topbar">

        <button
          className="journey-back-button"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          <span className="back-icon">←</span>
          <span>Dashboard</span>
        </button>

        <div className="journey-top-brand">
          <div className="journey-brand-icon">🛡️</div>

          <div>
            <strong>SAFENET</strong>
            <span>PERSONAL SAFETY NETWORK</span>
          </div>
        </div>

        <div className="journey-secure-status">
          <span className="journey-status-dot"></span>

          <div>
            <strong>SECURE SESSION</strong>
            <small>Protection active</small>
          </div>
        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="journey-main">

        {/* HERO */}

        <section className="journey-hero">

          <div className="journey-hero-content">

            <div className="journey-eyebrow">
              SAFETY JOURNEY
            </div>

            <h1>
              Move with
              <span> confidence.</span>
            </h1>

            <p>
              Plan your journey, stay connected with your trusted
              circle, and keep your safety information close when
              you are on the move.
            </p>

          </div>

          <div className="journey-hero-decoration">
            <div className="journey-orbit orbit-one"></div>
            <div className="journey-orbit orbit-two"></div>
            <div className="journey-orbit orbit-three"></div>

            <div className="journey-route-symbol">
              <span>●</span>
              <div></div>
              <span>◆</span>
            </div>
          </div>

        </section>


        {/* =================================================
            BACKEND ERROR
            ================================================= */}

        {error && (
          <div
            style={{
              margin: "0 auto 24px",
              maxWidth: "1100px",
              padding: "14px 18px",
              borderRadius: "12px",
              background: "#fff1f2",
              color: "#be123c",
              border: "1px solid #fecdd3",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}


        {/* =================================================
            LOADING
            ================================================= */}

        {loading ? (

          <section className="create-journey-section">

            <div className="create-journey-card">

              <div className="card-top-line">
                <span>01</span>
                <div></div>
                <small>LOADING JOURNEY</small>
              </div>

              <div className="create-card-heading">

                <div className="create-icon">
                  🧭
                </div>

                <div>
                  <div className="section-kicker">
                    SAFENET
                  </div>

                  <h2>
                    Loading your journey...
                  </h2>

                  <p>
                    Checking your active safety journey.
                  </p>
                </div>

              </div>

            </div>

          </section>

        ) : journeyStarted ? (

          /* =================================================
             ACTIVE JOURNEY
             ================================================= */

          <section className="active-journey-panel">

            <div className="active-journey-top">

              <div>
                <div className="active-label">
                  JOURNEY IN PROGRESS
                </div>

                <h2>
                  You are on your way
                </h2>

                <p>
                  SAFENET is keeping your journey information ready
                  while your session is active.
                </p>
              </div>

              <div className="active-badge">
                <span></span>
                ACTIVE
              </div>

            </div>


            <div className="journey-route-card">

              <div className="route-point">

                <div className="route-marker start-marker">
                  <span>●</span>
                </div>

                <div className="route-point-content">
                  <small>STARTING POINT</small>
                  <strong>{startPoint}</strong>
                </div>

              </div>


              <div className="route-line">
                <span></span>
                <span></span>
                <span></span>
              </div>


              <div className="route-point">

                <div className="route-marker destination-marker">
                  <span>◆</span>
                </div>

                <div className="route-point-content">
                  <small>DESTINATION</small>
                  <strong>{destination}</strong>
                </div>

              </div>

            </div>


            <div className="journey-live-grid">

              <div className="live-info-card">
                <span className="live-card-icon">⏱</span>

                <div>
                  <small>JOURNEY STATUS</small>
                  <strong>Monitoring active</strong>
                </div>
              </div>


              <div className="live-info-card">
                <span className="live-card-icon">👥</span>

                <div>
                  <small>TRUSTED CIRCLE</small>
                  <strong>
                    {notifyContacts
                      ? "Notifications enabled"
                      : "Notifications off"}
                  </strong>
                </div>
              </div>


              <div className="live-info-card">
                <span className="live-card-icon">🛡️</span>

                <div>
                  <small>SAFETY SYSTEM</small>
                  <strong>Ready</strong>
                </div>
              </div>

            </div>


            <div className="active-journey-actions">

              <button
                className="emergency-journey-button"
                type="button"
                onClick={() => navigate("/sos")}
              >
                <span>🚨</span>
                Emergency SOS
              </button>

              <button
                className="end-journey-button"
                type="button"
                onClick={handleEndJourney}
                disabled={actionLoading}
              >
                {actionLoading ? "Ending..." : "End Journey"}
              </button>

            </div>

          </section>

        ) : (

          /* =================================================
             CREATE JOURNEY
             ================================================= */

          <section className="create-journey-section">

            <div className="create-journey-card">

              <div className="card-top-line">
                <span>01</span>
                <div></div>
                <small>CREATE JOURNEY</small>
              </div>


              <div className="create-card-heading">

                <div className="create-icon">
                  🧭
                </div>

                <div>
                  <div className="section-kicker">
                    JOURNEY PLANNER
                  </div>

                  <h2>
                    Where are you going?
                  </h2>

                  <p>
                    Set your route before you leave so your safety
                    session can be prepared.
                  </p>
                </div>

              </div>


              <div className="journey-form">

                {/* START */}

                <div className="journey-field">

                  <label htmlFor="journey-start">
                    STARTING POINT
                  </label>

                  <div className="journey-input-wrapper">

                    <span className="field-icon">
                      ●
                    </span>

                    <input
                      id="journey-start"
                      type="text"
                      value={startPoint}
                      onChange={(e) =>
                        setStartPoint(e.target.value)
                      }
                      placeholder="Enter starting point"
                    />

                  </div>

                </div>


                {/* DESTINATION */}

                <div className="journey-field">

                  <label htmlFor="journey-destination">
                    DESTINATION
                  </label>

                  <div className="journey-input-wrapper destination-input">

                    <span className="field-icon">
                      ◆
                    </span>

                    <input
                      id="journey-destination"
                      type="text"
                      value={destination}
                      onChange={(e) =>
                        setDestination(e.target.value)
                      }
                      placeholder="Where are you going?"
                    />

                  </div>

                </div>


                {/* TRUSTED CONTACT */}

                <div className="journey-notification">

                  <div className="notification-icon">
                    👥
                  </div>

                  <div className="notification-copy">

                    <strong>
                      Keep my trusted circle informed
                    </strong>

                    <span>
                      Allow your trusted contacts to receive
                      journey-related safety updates.
                    </span>

                  </div>

                  <button
                    type="button"
                    className={`toggle-switch ${
                      notifyContacts ? "enabled" : ""
                    }`}
                    onClick={() =>
                      setNotifyContacts(!notifyContacts)
                    }
                    aria-label="Toggle trusted circle notifications"
                  >
                    <span></span>
                  </button>

                </div>


                {/* START BUTTON */}

                <button
                  type="button"
                  className="start-journey-button"
                  onClick={handleStartJourney}
                  disabled={
                    !destination.trim() || actionLoading
                  }
                >
                  <span className="start-button-icon">
                    →
                  </span>

                  <span>
                    {actionLoading
                      ? "Starting Journey..."
                      : "Start Safety Journey"}
                  </span>

                  <span className="start-button-arrow">
                    ↗
                  </span>

                </button>

              </div>

            </div>


            {/* SAFETY NOTE */}

            <aside className="journey-safety-note">

              <div className="note-icon">
                ✦
              </div>

              <div>
                <span>SAFETY FIRST</span>

                <h3>
                  A journey is safer when someone knows.
                </h3>

                <p>
                  Keep your trusted circle informed whenever
                  you are travelling somewhere unfamiliar or
                  travelling alone.
                </p>
              </div>

            </aside>

          </section>

        )}


        {/* =================================================
            HOW IT WORKS
            ================================================= */}

        <section className="journey-process">

          <div className="process-heading">

            <div>
              <span>HOW IT WORKS</span>

              <h2>
                Your journey,
                <br />
                <em>protected.</em>
              </h2>
            </div>

            <p>
              SAFENET brings the important parts of a safety
              journey together in one place.
            </p>

          </div>


          <div className="process-grid">

            <div className="process-card">

              <span className="process-number">
                01
              </span>

              <div className="process-icon">
                🧭
              </div>

              <h3>
                Plan
              </h3>

              <p>
                Set your starting point and destination before
                beginning your journey.
              </p>

            </div>


            <div className="process-card">

              <span className="process-number">
                02
              </span>

              <div className="process-icon">
                👥
              </div>

              <h3>
                Connect
              </h3>

              <p>
                Keep your trusted circle informed while your
                safety session is active.
              </p>

            </div>


            <div className="process-card">

              <span className="process-number">
                03
              </span>

              <div className="process-icon">
                🛡️
              </div>

              <h3>
                Stay protected
              </h3>

              <p>
                Keep emergency tools accessible throughout your
                journey.
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            EMERGENCY STRIP
            ================================================= */}

        <section className="journey-emergency-strip">

          <div className="emergency-strip-icon">
            🚨
          </div>

          <div className="emergency-strip-content">

            <span>
              EMERGENCY ACCESS
            </span>

            <h2>
              Need immediate help?
            </h2>

            <p>
              Open the SAFENET emergency interface at any time.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate("/sos")}
          >
            Open SOS
            <span>→</span>
          </button>

        </section>


        {/* =================================================
            FOOTER
            ================================================= */}

        <footer className="journey-footer">

          <div className="journey-footer-brand">

            <div className="journey-footer-logo">
              🛡️
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>PERSONAL SAFETY NETWORK</span>
            </div>

          </div>


          <div className="journey-footer-center">
            Safety Journey
            <span>•</span>
            Secure Session
            <span>•</span>
            2026
          </div>


          <div className="journey-footer-security">
            <span></span>
            Safety system ready
          </div>

        </footer>

      </main>

    </div>
  );
}

export default Journey;
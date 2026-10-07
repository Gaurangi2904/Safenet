import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock3,
  History,
  Info,
  MapPin,
  MessageCircle,
  Navigation,
  Shield,
  ShieldCheck,
  Siren,
  Timer,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  createCheckIn,
  getCheckIns,
  type CheckInRecord as BackendCheckInRecord,
} from "../api/checkins";
import "./CheckIn.css";

type CheckInInterval = 15 | 30 | 60;

type CheckInRecord = {
  id: string;
  time: string;
  status: "safe" | "started" | "ended";
};

type CheckInState = {
  active: boolean;
  interval: CheckInInterval;
  startedAt: number | null;
  nextCheckInAt: number | null;
  lastCheckInAt: number | null;
  history: CheckInRecord[];
};

const STORAGE_KEY = "safenet_checkin";

const defaultState: CheckInState = {
  active: false,
  interval: 30,
  startedAt: null,
  nextCheckInAt: null,
  lastCheckInAt: null,
  history: [],
};

function getInitialState(): CheckInState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultState;
    }

    const parsed = JSON.parse(saved) as Partial<CheckInState>;

    return {
      active:
        typeof parsed.active === "boolean"
          ? parsed.active
          : defaultState.active,

      interval:
        parsed.interval === 15 ||
        parsed.interval === 30 ||
        parsed.interval === 60
          ? parsed.interval
          : defaultState.interval,

      startedAt:
        typeof parsed.startedAt === "number"
          ? parsed.startedAt
          : null,

      nextCheckInAt:
        typeof parsed.nextCheckInAt === "number"
          ? parsed.nextCheckInAt
          : null,

      lastCheckInAt:
        typeof parsed.lastCheckInAt === "number"
          ? parsed.lastCheckInAt
          : null,

      history: Array.isArray(parsed.history)
        ? parsed.history.filter(
            (item): item is CheckInRecord =>
              typeof item?.id === "string" &&
              typeof item?.time === "string" &&
              (item?.status === "safe" ||
                item?.status === "started" ||
                item?.status === "ended")
          )
        : [],
    };
  } catch {
    return defaultState;
  }
}

function formatTime(timestamp: number | null): string {
  if (!timestamp) {
    return "--:--";
  }

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(timestamp: number | null): string {
  if (!timestamp) {
    return "--";
  }

  return new Date(timestamp).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.max(
    0,
    Math.floor(milliseconds / 1000)
  );

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function getStatus(
  state: CheckInState,
  currentTime: number
): "inactive" | "active" | "overdue" {
  if (!state.active) {
    return "inactive";
  }

  if (
    state.nextCheckInAt !== null &&
    currentTime > state.nextCheckInAt
  ) {
    return "overdue";
  }

  return "active";
}

function mapBackendCheckIns(
  checkIns: BackendCheckInRecord[]
): CheckInRecord[] {
  return checkIns.map((item) => ({
    id: `backend-${item.id}`,
    time: item.checkInAt,
    status:
      item.status === "EXPIRED"
        ? "ended"
        : "safe",
  }));
}

export default function CheckIn() {
  const navigate = useNavigate();

  const [checkInState, setCheckInState] =
    useState<CheckInState>(getInitialState);

  const [now, setNow] = useState<number>(Date.now());

  const [message, setMessage] = useState<string>("");

  const [userName, setUserName] =
    useState<string>("Safe Traveler");

  const [loadingBackend, setLoadingBackend] =
    useState<boolean>(true);

  const [backendError, setBackendError] =
    useState<string>("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("safenet_user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (
          user &&
          typeof user.name === "string" &&
          user.name.trim()
        ) {
          setUserName(user.name);
        }
      }
    } catch {
      // Keep default user name.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(checkInState)
    );
  }, [checkInState]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("safenet-theme");

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

  /*
   * Load existing backend check-ins.
   */
  useEffect(() => {
    const loadBackendCheckIns = async () => {
      try {
        setLoadingBackend(true);
        setBackendError("");

        const response = await getCheckIns();

        const backendCheckIns: BackendCheckInRecord[] =
          Array.isArray(response?.checkIns)
            ? response.checkIns
            : [];

        const backendHistory =
          mapBackendCheckIns(backendCheckIns);

        setCheckInState((previous) => {
          const localHistory = previous.history.filter(
            (item) =>
              !item.id.startsWith("backend-")
          );

          return {
            ...previous,
            history: [
              ...localHistory,
              ...backendHistory,
            ]
              .sort(
                (a, b) =>
                  new Date(b.time).getTime() -
                  new Date(a.time).getTime()
              )
              .slice(0, 10),
          };
        });
      } catch (error: any) {
        console.error(
          "Load check-ins error:",
          error
        );

        if (
          error?.response?.status === 401
        ) {
          localStorage.removeItem(
            "safenet_token"
          );

          navigate("/login");
          return;
        }

        setBackendError(
          "Unable to load backend check-in history."
        );
      } finally {
        setLoadingBackend(false);
      }
    };

    loadBackendCheckIns();
  }, [navigate]);

  const status = getStatus(checkInState, now);

  const remainingTime = useMemo(() => {
    if (checkInState.nextCheckInAt === null) {
      return 0;
    }

    return checkInState.nextCheckInAt - now;
  }, [checkInState.nextCheckInAt, now]);

  const sessionDuration = useMemo(() => {
    if (checkInState.startedAt === null) {
      return 0;
    }

    return now - checkInState.startedAt;
  }, [checkInState.startedAt, now]);

  const statusTitle = {
    inactive: "Check-In Not Active",
    active: "You Are Checked In",
    overdue: "Check-In Overdue",
  }[status];

  const statusDescription = {
    inactive:
      "Start a safety check-in session and keep track of your planned check-ins.",

    active:
      "Your safety session is active. Remember to confirm that you are safe.",

    overdue:
      "Your scheduled check-in time has passed. Confirm your safety as soon as possible.",
  }[status];

  const handleStartCheckIn = async () => {
    const startTime = Date.now();

    const nextTime =
      startTime +
      checkInState.interval * 60 * 1000;

    try {
      setBackendError("");

      await createCheckIn({
        checkInAt: new Date(
          startTime
        ).toISOString(),

        expiresAt: new Date(
          nextTime
        ).toISOString(),

        message:
          "SAFENET safety check-in session started.",
      });

      const newRecord: CheckInRecord = {
        id: `${startTime}-started`,
        time: new Date(startTime).toISOString(),
        status: "started",
      };

      setCheckInState(
        (previous: CheckInState) => ({
          ...previous,
          active: true,
          startedAt: startTime,
          nextCheckInAt: nextTime,
          lastCheckInAt: null,
          history: [
            newRecord,
            ...previous.history,
          ].slice(0, 10),
        })
      );

      setMessage(
        "Safety check-in session started and saved."
      );
    } catch (error: any) {
      console.error(
        "Start check-in error:",
        error
      );

      if (
        error?.response?.status === 401
      ) {
        localStorage.removeItem(
          "safenet_token"
        );

        navigate("/login");
        return;
      }

      setBackendError(
        error?.response?.data?.message ||
          "Failed to save your safety check-in."
      );
    }
  };

  const handleCheckIn = async () => {
    const checkInTime = Date.now();

    const nextTime =
      checkInTime +
      checkInState.interval * 60 * 1000;

    try {
      setBackendError("");

      await createCheckIn({
        checkInAt: new Date(
          checkInTime
        ).toISOString(),

        expiresAt: new Date(
          nextTime
        ).toISOString(),

        message:
          "SAFENET user confirmed that they are safe.",
      });

      const newRecord: CheckInRecord = {
        id: `${checkInTime}-safe`,
        time: new Date(
          checkInTime
        ).toISOString(),
        status: "safe",
      };

      setCheckInState(
        (previous: CheckInState) => ({
          ...previous,
          active: true,
          nextCheckInAt: nextTime,
          lastCheckInAt: checkInTime,
          history: [
            newRecord,
            ...previous.history,
          ].slice(0, 10),
        })
      );

      setMessage(
        "You're marked safe. Your check-in has been saved."
      );
    } catch (error: any) {
      console.error(
        "Safe check-in error:",
        error
      );

      if (
        error?.response?.status === 401
      ) {
        localStorage.removeItem(
          "safenet_token"
        );

        navigate("/login");
        return;
      }

      setBackendError(
        error?.response?.data?.message ||
          "Failed to save your safe check-in."
      );
    }
  };

  const handleEndCheckIn = () => {
    const endTime = Date.now();

    const newRecord: CheckInRecord = {
      id: `${endTime}-ended`,
      time: new Date(endTime).toISOString(),
      status: "ended",
    };

    setCheckInState(
      (previous: CheckInState) => ({
        ...previous,
        active: false,
        startedAt: null,
        nextCheckInAt: null,
        lastCheckInAt: endTime,
        history: [
          newRecord,
          ...previous.history,
        ].slice(0, 10),
      })
    );

    setMessage(
      "Safety check-in session ended on this device."
    );
  };

  const handleIntervalChange = (
    interval: CheckInInterval
  ) => {
    setCheckInState(
      (previous: CheckInState): CheckInState => {
        if (!previous.active) {
          return {
            ...previous,
            interval,
          };
        }

        const nextTime =
          Date.now() +
          interval * 60 * 1000;

        return {
          ...previous,
          interval,
          nextCheckInAt: nextTime,
        };
      }
    );

    if (checkInState.active) {
      setMessage(
        `Check-in interval changed to ${interval} minutes.`
      );
    } else {
      setMessage(
        `Check-in interval set to ${interval} minutes.`
      );
    }
  };

  return (
    <div className="checkin-page">
      <header className="checkin-header">
        <div className="checkin-header-inner">
          <button
            className="checkin-back-button"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="checkin-brand">
            <div className="checkin-brand-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>SAFENET</strong>
              <span>Personal Safety System</span>
            </div>
          </div>

          <button
            className="checkin-sos-button"
            onClick={() => navigate("/sos")}
            type="button"
          >
            <Siren size={18} />
            SOS
          </button>
        </div>
      </header>

      <main className="checkin-main">
        <section className="checkin-hero">
          <div className="checkin-hero-copy">
            <div className="checkin-eyebrow">
              <Shield size={16} />
              Safety Check-In
            </div>

            <h1>Stay connected. Stay safe.</h1>

            <p>
              Keep a simple safety check-in running while
              you travel, commute, or move through unfamiliar
              places.
            </p>

            <div className="checkin-user">
              <div className="checkin-user-avatar">
                <UserRound size={18} />
              </div>

              <div>
                <span>Current user</span>
                <strong>{userName}</strong>
              </div>
            </div>
          </div>

          <div
            className={`checkin-status-card ${status}`}
          >
            <div className="checkin-status-icon">
              {status === "active" && (
                <CheckCircle2 size={28} />
              )}

              {status === "overdue" && (
                <XCircle size={28} />
              )}

              {status === "inactive" && (
                <Clock3 size={28} />
              )}
            </div>

            <span className="checkin-status-label">
              CURRENT STATUS
            </span>

            <h2>{statusTitle}</h2>

            <p>{statusDescription}</p>

            <div className="checkin-status-line">
              <span>Status</span>

              <strong>
                {status === "active"
                  ? "ACTIVE"
                  : status === "overdue"
                  ? "ACTION NEEDED"
                  : "INACTIVE"}
              </strong>
            </div>
          </div>
        </section>

        {message && (
          <div className="checkin-message">
            <CheckCircle2 size={18} />

            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
              aria-label="Close message"
              type="button"
            >
              ×
            </button>
          </div>
        )}

        {backendError && (
          <div className="checkin-message">
            <XCircle size={18} />

            <span>{backendError}</span>

            <button
              onClick={() => setBackendError("")}
              aria-label="Close error message"
              type="button"
            >
              ×
            </button>
          </div>
        )}

        <section className="checkin-grid">
          <div className="checkin-card checkin-control-card">
            <div className="checkin-card-heading">
              <div>
                <span className="checkin-card-kicker">
                  CONTROL CENTER
                </span>

                <h2>Check-In Settings</h2>
              </div>

              <div className="checkin-card-icon">
                <Timer size={21} />
              </div>
            </div>

            <p className="checkin-card-description">
              Choose how frequently you want to confirm
              that you are safe.
            </p>

            <div className="interval-section">
              <span className="field-label">
                CHECK-IN INTERVAL
              </span>

              <div className="interval-options">
                {[15, 30, 60].map((interval) => (
                  <button
                    key={interval}
                    className={
                      checkInState.interval === interval
                        ? "interval-button selected"
                        : "interval-button"
                    }
                    onClick={() =>
                      handleIntervalChange(
                        interval as CheckInInterval
                      )
                    }
                    type="button"
                  >
                    <strong>{interval}</strong>
                    <span>minutes</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="checkin-actions">
              {!checkInState.active ? (
                <button
                  className="primary-checkin-button"
                  onClick={handleStartCheckIn}
                  type="button"
                  disabled={loadingBackend}
                >
                  <ShieldCheck size={19} />

                  {loadingBackend
                    ? "Connecting..."
                    : "Start Safety Check-In"}
                </button>
              ) : (
                <>
                  <button
                    className="primary-checkin-button"
                    onClick={handleCheckIn}
                    type="button"
                  >
                    <CheckCircle2 size={19} />
                    I&apos;m Safe
                  </button>

                  <button
                    className="secondary-checkin-button"
                    onClick={handleEndCheckIn}
                    type="button"
                  >
                    End Check-In
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="checkin-card checkin-next-card">
            <div className="checkin-card-heading">
              <div>
                <span className="checkin-card-kicker">
                  NEXT CHECK-IN
                </span>

                <h2>
                  {checkInState.nextCheckInAt
                    ? formatTime(
                        checkInState.nextCheckInAt
                      )
                    : "--:--"}
                </h2>
              </div>

              <div className="checkin-card-icon">
                <Bell size={21} />
              </div>
            </div>

            {checkInState.active ? (
              <>
                <div
                  className={
                    status === "overdue"
                      ? "countdown overdue"
                      : "countdown"
                  }
                >
                  <span>
                    {status === "overdue"
                      ? "OVERDUE BY"
                      : "TIME REMAINING"}
                  </span>

                  <strong>
                    {status === "overdue"
                      ? formatDuration(
                          Math.abs(remainingTime)
                        )
                      : formatDuration(remainingTime)}
                  </strong>
                </div>

                <div className="next-checkin-details">
                  <div>
                    <span>Interval</span>
                    <strong>
                      {checkInState.interval} min
                    </strong>
                  </div>

                  <div>
                    <span>Started</span>
                    <strong>
                      {formatTime(
                        checkInState.startedAt
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Session</span>
                    <strong>
                      {formatDuration(
                        sessionDuration
                      )}
                    </strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="inactive-next">
                <Clock3 size={30} />

                <p>
                  Start a safety check-in session to see
                  your next scheduled check-in.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="checkin-lower-grid">
          <div className="checkin-card history-card">
            <div className="checkin-card-heading">
              <div>
                <span className="checkin-card-kicker">
                  ACTIVITY
                </span>

                <h2>Check-In History</h2>
              </div>

              <div className="checkin-card-icon">
                <History size={21} />
              </div>
            </div>

            {checkInState.history.length === 0 ? (
              <div className="empty-history">
                <History size={30} />

                <h3>No check-ins yet</h3>

                <p>
                  Your check-in activity will appear here
                  after you start your first session.
                </p>
              </div>
            ) : (
              <div className="history-list">
                {checkInState.history.map(
                  (item: CheckInRecord) => (
                    <div
                      className="history-item"
                      key={item.id}
                    >
                      <div
                        className={`history-icon ${item.status}`}
                      >
                        {item.status === "safe" && (
                          <CheckCircle2 size={17} />
                        )}

                        {item.status === "started" && (
                          <Timer size={17} />
                        )}

                        {item.status === "ended" && (
                          <XCircle size={17} />
                        )}
                      </div>

                      <div className="history-content">
                        <strong>
                          {item.status === "safe"
                            ? "Marked as safe"
                            : item.status === "started"
                            ? "Check-in session started"
                            : "Check-in session ended"}
                        </strong>

                        <span>
                          {formatDateTime(
                            new Date(
                              item.time
                            ).getTime()
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="checkin-card safety-info-card">
            <div className="checkin-card-heading">
              <div>
                <span className="checkin-card-kicker">
                  SAFETY TOOLKIT
                </span>

                <h2>Stay Prepared</h2>
              </div>

              <div className="checkin-card-icon">
                <Info size={21} />
              </div>
            </div>

            <div className="safety-info-list">
              <div className="safety-info-item">
                <div className="safety-info-item-icon">
                  <Navigation size={18} />
                </div>

                <div>
                  <strong>
                    Keep your route updated
                  </strong>

                  <p>
                    Use Safety Journey when you want to
                    monitor a planned trip.
                  </p>
                </div>
              </div>

              <div className="safety-info-item">
                <div className="safety-info-item-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <strong>
                    Know your surroundings
                  </strong>

                  <p>
                    Stay aware of your location and keep
                    your phone accessible.
                  </p>
                </div>
              </div>

              <div className="safety-info-item">
                <div className="safety-info-item-icon">
                  <MessageCircle size={18} />
                </div>

                <div>
                  <strong>
                    Keep people informed
                  </strong>

                  <p>
                    Maintain communication with people
                    you trust when travelling.
                  </p>
                </div>
              </div>
            </div>

            <button
              className="journey-link-button"
              onClick={() => navigate("/journey")}
              type="button"
            >
              <Navigation size={18} />
              Open Safety Journey
            </button>
          </div>
        </section>

        <section className="checkin-emergency">
          <div className="emergency-icon">
            <Siren size={24} />
          </div>

          <div className="emergency-copy">
            <span>NEED IMMEDIATE HELP?</span>

            <h2>Use SAFENET SOS</h2>

            <p>
              If you are in immediate danger, open the SOS
              screen for the emergency safety workflow.
            </p>
          </div>

          <button
            className="emergency-button"
            onClick={() => navigate("/sos")}
            type="button"
          >
            Open SOS
            <ArrowLeft
              size={18}
              className="emergency-arrow"
            />
          </button>
        </section>

        <div className="checkin-disclaimer">
          <Shield size={15} />

          <span>
            Check-in records are now saved to your SAFENET
            account. Automated emergency notifications
            require additional backend integration.
          </span>
        </div>
      </main>

      <footer className="checkin-footer">
        <div>
          <strong>SAFENET</strong>
          <span>
            Personal safety, designed around you.
          </span>
        </div>

        <span>
          Safety Check-In • Backend Connected
        </span>
      </footer>
    </div>
  );
}
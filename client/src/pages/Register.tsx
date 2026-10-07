import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await registerUser({
        name,
        email,
        phone: phone || undefined,
        password,
      });

      console.log("Registration successful:", response);

      if (response.token) {
        localStorage.setItem("safenet_token", response.token);
      }

      if (response.user) {
        localStorage.setItem("safenet_user", JSON.stringify(response.user));
      }

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Registration failed:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background-glow auth-glow-one"></div>
      <div className="auth-background-glow auth-glow-two"></div>

      <div className="auth-layout">
        {/* LEFT SIDE */}
        <div className="auth-info">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">🛡️</span>

            <span className="auth-brand-name">
              SAFE<span>NET</span>
            </span>
          </Link>

          <div className="auth-info-content">
            <div className="auth-pill">
              <span className="auth-pill-dot"></span>
              SAFETY STARTS WITH YOU
            </div>

            <h2>
              Your safety.
              <br />
              <span>Your control.</span>
            </h2>

            <p>
              Create your SAFENET account and get access to a smarter,
              connected safety platform designed to keep you protected.
            </p>

            <div className="auth-benefits">
              <div className="auth-benefit">
                <div className="benefit-icon">🛡️</div>

                <div>
                  <strong>Stay Protected</strong>
                  <span>Access your personal safety tools anytime.</span>
                </div>
              </div>

              <div className="auth-benefit">
                <div className="benefit-icon">⚡</div>

                <div>
                  <strong>Act Quickly</strong>
                  <span>Reach your emergency tools when seconds matter.</span>
                </div>
              </div>

              <div className="auth-benefit">
                <div className="benefit-icon">🤝</div>

                <div>
                  <strong>Stay Connected</strong>
                  <span>Keep trusted people close when you need them.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-info-footer">
            <span>SAFENET</span>
            <span>•</span>
            <span>Secure</span>
            <span>•</span>
            <span>Private</span>
            <span>•</span>
            <span>Always There</span>
          </div>
        </div>

        {/* REGISTER CARD */}
        <div className="auth-card">
          <div className="auth-card-top">
            <div className="auth-mobile-logo">
              <span className="auth-logo-icon">🛡️</span>
              <span>SAFENET</span>
            </div>

            <div className="auth-kicker">CREATE YOUR ACCOUNT</div>

            <h1>Create your account</h1>

            <p className="auth-subtitle">
              Join SAFENET and take control of your safety.
            </p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-field">
              <label htmlFor="register-name">Full Name</label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">👤</span>

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email Address</label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">✉️</span>

                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-phone">Phone Number</label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">📱</span>

                <input
                  id="register-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Password</label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>

                <input
                  id="register-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <div className="auth-password-hint">
              <span>●</span>
              Use at least 8 characters for better security.
            </div>

            {error && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "14px",
                  marginTop: "4px",
                  marginBottom: "4px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <span className="auth-submit-arrow">
                {loading ? "..." : "→"}
              </span>
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to SAFENET home
          </Link>

          <div className="auth-security">
            <span className="auth-security-dot"></span>
            Your information is protected
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
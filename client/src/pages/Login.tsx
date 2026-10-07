import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password
      });

      localStorage.setItem("safenet_token", data.token);
      localStorage.setItem(
        "safenet_user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          <span className="auth-logo-icon">🛡️</span>
          <span>SAFENET</span>
        </Link>

        <div className="auth-heading">
          <span className="auth-kicker">SECURE ACCESS</span>

          <h1>Welcome back</h1>

          <p className="auth-subtitle">
            Sign in to continue to your safety dashboard.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <span className="auth-error-icon">!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="auth-field">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="password">Password</label>
              <span className="auth-secure-label">SECURE</span>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              "Signing In..."
            ) : (
              <>
                Sign In
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>

        <Link to="/" className="back-home">
          <span>←</span> Back to SAFENET home
        </Link>

        <div className="auth-security">
          <span className="security-dot"></span>
          Your connection is protected
        </div>

      </div>
    </div>
  );
}

export default Login;
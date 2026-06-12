import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(229,9,20,0.4); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(229,9,20,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0  rgba(229,9,20,0);  }
        }
        @keyframes glow {
          from { filter: drop-shadow(0 0 4px  rgba(229,9,20,0.5)); }
          to   { filter: drop-shadow(0 0 14px rgba(229,9,20,0.9)); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-btn:hover:not(:disabled) {
          background: #ff1a1a !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 32px rgba(229,9,20,0.45) !important;
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0) !important;
        }
        .register-link:hover {
          color: #fff !important;
          text-decoration: underline !important;
        }
        .pass-toggle:hover {
          color: #aaa !important;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          display: "flex",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Left panel — brand / visual ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            background:
              "linear-gradient(135deg,#141414 0%,#1a0505 50%,#0a0a0a 100%)",
            borderRight: "1px solid #1f1f1f",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 40%,rgba(229,9,20,0.12) 0%,transparent 60%), radial-gradient(ellipse at 80% 80%,rgba(229,9,20,0.05) 0%,transparent 50%)",
              pointerEvents: "none",
            }}
          />

          {/* Grid pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(229,9,20,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(229,9,20,0.03) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", animation: "fadeUp 0.6s ease both" }}>
            {/* Logo mark */}
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "#E50914",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 900,
                color: "#fff",
                marginBottom: "40px",
                animation: "pulse-ring 3s ease-in-out infinite",
                letterSpacing: "-1px",
              }}
            >
              C
            </div>

            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#E50914",
                marginBottom: "16px",
              }}
            >
              CRM Platform
            </p>

            <h2
              style={{
                fontSize: "clamp(32px,4vw,52px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "20px",
              }}
            >
              Grow smarter.<br />
              <span style={{ color: "#E50914" }}>Sell faster.</span>
            </h2>

            <p
              style={{
                fontSize: "15px",
                color: "#666",
                lineHeight: 1.7,
                maxWidth: "380px",
              }}
            >
              The all-in-one CRM built for modern teams. Manage customers,
              run campaigns, and get AI-powered insights — all in one place.
            </p>

            {/* Feature pills */}
            <div style={{ display: "flex", gap: "10px", marginTop: "36px", flexWrap: "wrap" }}>
              {["AI Insights", "Smart Campaigns", "VIP Tracking"].map((f) => (
                <span
                  key={f}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#888",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel — form ── */}
        <div
          style={{
            width: "480px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 50px",
            background: "#0d0d0d",
            animation: "fadeUp 0.5s ease both",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#E50914",
              marginBottom: "10px",
            }}
          >
            Welcome back
          </p>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: "8px",
            }}
          >
            Sign in
          </h1>

          <p style={{ fontSize: "14px", color: "#555", marginBottom: "36px" }}>
            Enter your credentials to access your workspace.
          </p>

          {/* Error banner */}
          {error && (
            <div
              style={{
                background: "rgba(229,9,20,0.08)",
                border: "1px solid rgba(229,9,20,0.25)",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "#ff6b6b",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "16px" }}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#666",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                required
                style={{
                  width: "100%",
                  background: "#141414",
                  border: `1px solid ${focusedField === "email" ? "#E50914" : "#2a2a2a"}`,
                  borderRadius: "10px",
                  padding: "14px 16px",
                  fontSize: "14px",
                  color: "#e8e8e8",
                  outline: "none",
                  transition: "border-color 200ms ease, box-shadow 200ms ease",
                  boxShadow: focusedField === "email" ? "0 0 0 3px rgba(229,9,20,0.12)" : "none",
                }}
              />
            </div>

            {/* Password field */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#666",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                  style={{
                    width: "100%",
                    background: "#141414",
                    border: `1px solid ${focusedField === "password" ? "#E50914" : "#2a2a2a"}`,
                    borderRadius: "10px",
                    padding: "14px 48px 14px 16px",
                    fontSize: "14px",
                    color: "#e8e8e8",
                    outline: "none",
                    transition: "border-color 200ms ease, box-shadow 200ms ease",
                    boxShadow: focusedField === "password" ? "0 0 0 3px rgba(229,9,20,0.12)" : "none",
                  }}
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#555",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "4px",
                    transition: "color 150ms ease",
                  }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#333" : "#E50914",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "15px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "6px",
                transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #555",
                      borderTopColor: "#e8e8e8",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "24px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
            <span style={{ fontSize: "11px", color: "#444", letterSpacing: "0.06em" }}>
              NEW HERE?
            </span>
            <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
          </div>

          {/* Register link */}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#555" }}>
            Don't have an account?{" "}
            <a
              href="/register"
              className="register-link"
              style={{
                color: "#E50914",
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
            >
              Create one free
            </a>
          </p>

          {/* Footer note */}
          <p
            style={{
              position: "absolute",
              bottom: "24px",
              left: "50px",
              right: "50px",
              textAlign: "center",
              fontSize: "11px",
              color: "#333",
              letterSpacing: "0.04em",
            }}
          >
            Secured with end-to-end encryption
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
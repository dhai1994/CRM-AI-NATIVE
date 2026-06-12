import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [step, setStep] = useState(0); // 0 = idle, 1 = success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      setStep(1);
      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* Password strength */
  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "#333" };
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: "",         color: "#333"    },
      { label: "Weak",     color: "#E50914" },
      { label: "Fair",     color: "#F5A623" },
      { label: "Good",     color: "#46D369" },
      { label: "Strong",   color: "#46D369" },
    ];
    return { score, ...map[score] };
  };
  const strength = getStrength(form.password);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(5deg);  opacity: 1; }
          100% { transform: scale(1) rotate(0deg);    opacity: 1; }
        }
        @keyframes successGlow {
          0%, 100% { box-shadow: 0 0 0 0  rgba(70,211,105,0); }
          50%       { box-shadow: 0 0 32px 8px rgba(70,211,105,0.2); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0  rgba(229,9,20,0.4); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(229,9,20,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0  rgba(229,9,20,0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-btn:hover:not(:disabled) {
          background: #ff1a1a !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 32px rgba(229,9,20,0.45) !important;
        }
        .reg-btn:active:not(:disabled) {
          transform: translateY(0) !important;
        }
        .login-link:hover {
          color: #fff !important;
          text-decoration: underline !important;
        }
        .pass-toggle:hover { color: #aaa !important; }
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
        {/* ── Left panel — visual / brand ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            background:
              "linear-gradient(135deg,#141414 0%,#0a1a0a 50%,#0a0a0a 100%)",
            borderRight: "1px solid #1f1f1f",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient green glow for register */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 40%,rgba(70,211,105,0.08) 0%,transparent 60%), radial-gradient(ellipse at 80% 80%,rgba(70,211,105,0.03) 0%,transparent 50%)",
              pointerEvents: "none",
            }}
          />

          {/* Grid pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(70,211,105,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(70,211,105,0.03) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", animation: "fadeUp 0.6s ease both" }}>
            {/* Logo */}
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
                color: "#46D369",
                marginBottom: "16px",
              }}
            >
              Get started free
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
              Your CRM,<br />
              <span style={{ color: "#46D369" }}>your rules.</span>
            </h2>

            <p
              style={{
                fontSize: "15px",
                color: "#666",
                lineHeight: 1.7,
                maxWidth: "380px",
              }}
            >
              Join thousands of teams who use our CRM to close more deals,
              retain customers, and unlock AI-powered growth.
            </p>

            {/* Steps */}
            <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: "⚡", text: "Set up in under 2 minutes" },
                { icon: "🔒", text: "Enterprise-grade security" },
                { icon: "🤖", text: "AI insights from day one"  },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </span>
                  <span style={{ fontSize: "14px", color: "#888", fontWeight: 500 }}>{text}</span>
                </div>
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
            position: "relative",
          }}
        >
          {/* ── SUCCESS state ── */}
          {step === 1 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                animation: "successGlow 1.5s ease infinite",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(70,211,105,0.1)",
                  border: "2px solid #46D369",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  animation: "checkPop 0.5s cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                ✓
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff" }}>
                Account created!
              </h2>
              <p style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
                Redirecting you to sign in…
              </p>
              <div
                style={{
                  width: "120px",
                  height: "3px",
                  background: "#1f1f1f",
                  borderRadius: "2px",
                  overflow: "hidden",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#46D369",
                    borderRadius: "2px",
                    animation: "shimmer 1.8s linear forwards",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#46D369",
                  marginBottom: "10px",
                }}
              >
                Create account
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
                Get started
              </h1>

              <p style={{ fontSize: "14px", color: "#555", marginBottom: "32px" }}>
                Free forever. No credit card required.
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

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {/* Name */}
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
                    Full name
                  </label>
                  <input
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    required
                    style={{
                      width: "100%",
                      background: "#141414",
                      border: `1px solid ${focusedField === "name" ? "#46D369" : "#2a2a2a"}`,
                      borderRadius: "10px",
                      padding: "14px 16px",
                      fontSize: "14px",
                      color: "#e8e8e8",
                      outline: "none",
                      transition: "border-color 200ms ease, box-shadow 200ms ease",
                      boxShadow: focusedField === "name" ? "0 0 0 3px rgba(70,211,105,0.12)" : "none",
                    }}
                  />
                </div>

                {/* Email */}
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
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    required
                    style={{
                      width: "100%",
                      background: "#141414",
                      border: `1px solid ${focusedField === "email" ? "#46D369" : "#2a2a2a"}`,
                      borderRadius: "10px",
                      padding: "14px 16px",
                      fontSize: "14px",
                      color: "#e8e8e8",
                      outline: "none",
                      transition: "border-color 200ms ease, box-shadow 200ms ease",
                      boxShadow: focusedField === "email" ? "0 0 0 3px rgba(70,211,105,0.12)" : "none",
                    }}
                  />
                </div>

                {/* Password */}
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
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                      required
                      style={{
                        width: "100%",
                        background: "#141414",
                        border: `1px solid ${focusedField === "password" ? "#46D369" : "#2a2a2a"}`,
                        borderRadius: "10px",
                        padding: "14px 48px 14px 16px",
                        fontSize: "14px",
                        color: "#e8e8e8",
                        outline: "none",
                        transition: "border-color 200ms ease, box-shadow 200ms ease",
                        boxShadow: focusedField === "password" ? "0 0 0 3px rgba(70,211,105,0.12)" : "none",
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

                  {/* Password strength bar */}
                  {form.password && (
                    <div style={{ marginTop: "10px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          marginBottom: "6px",
                        }}
                      >
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            style={{
                              flex: 1,
                              height: "3px",
                              borderRadius: "2px",
                              background: s <= strength.score ? strength.color : "#2a2a2a",
                              transition: "background 300ms ease",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: strength.color,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="reg-btn"
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
                      Creating account…
                    </>
                  ) : (
                    "Create account →"
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
                  HAVE AN ACCOUNT?
                </span>
                <div style={{ flex: 1, height: "1px", background: "#1f1f1f" }} />
              </div>

              <p style={{ textAlign: "center", fontSize: "14px", color: "#555" }}>
                Already registered?{" "}
                <a
                  href="/"
                  className="login-link"
                  style={{
                    color: "#E50914",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "color 150ms ease",
                  }}
                >
                  Sign in here
                </a>
              </p>
            </>
          )}

          {/* Footer */}
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
            By registering, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
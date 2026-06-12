import { NavLink, useLocation } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════
   NAV ITEMS CONFIG
═══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { to: "/dashboard",  label: "Dashboard",  icon: "📊", accent: "#E50914" },
  { to: "/customers",  label: "Customers",  icon: "👥", accent: "#F5A623" },
  { to: "/agent",      label: "AI Agent",   icon: "🤖", accent: "#6366F1" },
  { to: "/campaigns",  label: "Campaigns",  icon: "📢", accent: "#2563EB" },
  { to: "/analytics",  label: "Analytics",  icon: "📈", accent: "#46D369" },
];

/* ═══════════════════════════════════════════════════════════════
   SVG LOGO MARK
═══════════════════════════════════════════════════════════════ */
function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="AI CRM Logo">
      <rect width="28" height="28" rx="7" fill="#E50914" />
      <path d="M7 20 L14 8 L21 20" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9.5 15.5 L18.5 15.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)} }

        .crm-sidebar-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          color: #666;
          border: 1px solid transparent;
          transition: color 180ms ease, background 180ms ease, border-color 180ms ease, transform 140ms ease;
          position: relative;
          white-space: nowrap;
          letter-spacing: -0.01em;
          cursor: pointer;
        }

        .crm-sidebar-link:hover {
          color: #e8e8e8 !important;
          background: #141414 !important;
          border-color: #2a2a2a !important;
          transform: translateX(3px);
        }

        .crm-sidebar-link.active {
          color: #fff !important;
          background: #141414 !important;
          border-color: #2a2a2a !important;
          font-weight: 600;
        }

        .crm-sidebar-link .nav-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
          transition: filter 180ms ease;
        }

        .crm-sidebar-link.active .active-dot {
          opacity: 1;
        }

        .crm-sidebar-link .active-dot {
          position: absolute;
          right: 12px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 200ms ease;
        }

        .crm-sidebar-divider {
          height: 1px;
          background: #1a1a1a;
          margin: 8px 0;
        }
      `}</style>

      <div style={{
        width: "220px",
        minHeight: "100vh",
        height: "100%",
        background: "#0a0a0a",
        borderRight: "1px solid #1a1a1a",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        flexShrink: 0,
        position: "sticky",
        top: 0,
      }}>

        {/* ── Logo ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginBottom: "32px", paddingLeft: "4px",
          animation: "slideIn 0.3s ease both",
        }}>
          <LogoMark />
          <div>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              AI CRM
            </p>
            <p style={{ fontSize: "10px", color: "#444", margin: 0, letterSpacing: "0.06em", fontWeight: 600, textTransform: "uppercase" }}>
              Platform
            </p>
          </div>
        </div>

        {/* ── Nav Label ── */}
        <p style={{
          fontSize: "10px", fontWeight: 700, color: "#333",
          letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: "8px", paddingLeft: "12px",
        }}>
          Menu
        </p>

        {/* ── Nav Links ── */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          {NAV_ITEMS.map(({ to, label, icon, accent }, i) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + "/");
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive: navActive }) =>
                  "crm-sidebar-link" + (navActive ? " active" : "")
                }
                style={{
                  animation: `slideIn 0.3s ease ${i * 0.05}s both`,
                  ...(isActive ? { color: accent } : {}),
                }}
              >
                {/* Active accent bar */}
                {isActive && (
                  <div style={{
                    position: "absolute", left: 0, top: "6px", bottom: "6px",
                    width: "3px", borderRadius: "0 3px 3px 0",
                    background: accent,
                    marginLeft: "-1px",
                  }} />
                )}

                <span className="nav-icon">{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>

                {/* Active indicator dot */}
                <span
                  className="active-dot"
                  style={{ background: accent }}
                />
              </NavLink>
            );
          })}
        </nav>

        <div className="crm-sidebar-divider" />

        {/* ── Footer ── */}
        <div style={{ paddingLeft: "12px", paddingTop: "12px" }}>
          <p style={{ fontSize: "10px", color: "#2a2a2a", margin: 0, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            AI CRM v1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER  — counts up from 0 on mount
═══════════════════════════════════════════════════════════════ */
function AnimatedCounter({ value, prefix = "", duration = 1200 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
    let current = 0;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= numeric) {
        current = numeric;
        clearInterval(timer);
      }
      setDisplay(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("en-IN")}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENHANCED STAT CARD  — hover lift + accent radial glow
═══════════════════════════════════════════════════════════════ */
function EnhancedStatCard({ title, value, icon, accent }) {
  const [hovered, setHovered] = useState(false);

  const numericVal =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.]/g, "")) || 0
      : Number(value) || 0;
  const prefix =
    typeof value === "string" && value.includes("₹") ? "₹" : "";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        minWidth: "200px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        border: `1px solid ${hovered ? "#2a2a2a" : "#1f1f1f"}`,
        borderRadius: "12px",
        padding: "20px 24px",
        cursor: "default",
        background: hovered
          ? `radial-gradient(ellipse at 0% 50%, ${accent}18 0%, #141414 70%)`
          : "#141414",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.65)"
          : "0 4px 16px rgba(0,0,0,0.3)",
        transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: "28px",
          lineHeight: 1,
          filter: `drop-shadow(0 0 8px ${accent})`,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#666",
            margin: "0 0 4px",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          <AnimatedCounter value={numericVal} prefix={prefix} />
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HORIZONTAL SCROLL ROW  — Netflix-style
═══════════════════════════════════════════════════════════════ */
function HorizontalRow({ title, children }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 260, behavior: "smooth" });
    }
  };

  return (
    <div style={{ padding: "28px 0 8px 40px" }}>
      {/* Row header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: "40px",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#e8e8e8",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#1f1f1f",
              border: "1px solid #2a2a2a",
              color: "#e8e8e8",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
              transition: "background 180ms ease, transform 180ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1f1f1f")}
          >
            ‹
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#1f1f1f",
              border: "1px solid #2a2a2a",
              color: "#e8e8e8",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
              transition: "background 180ms ease, transform 180ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1f1f1f")}
          >
            ›
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingRight: "40px",
          paddingBottom: "12px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOMER CARD
═══════════════════════════════════════════════════════════════ */
function CustomerCard({ customer, index }) {
  const [hovered, setHovered] = useState(false);

  const palette = [
    "#E50914",
    "#46D369",
    "#F5A623",
    "#4ECDC4",
    "#9B59B6",
    "#3498DB",
  ];
  const accent = palette[index % palette.length];
  const initials = (customer.name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "0 0 220px",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#141414",
        border: `1px solid ${hovered ? "#333" : "#1f1f1f"}`,
        cursor: "pointer",
        scrollSnapAlign: "start",
        transform: hovered
          ? "scale(1.06) translateY(-5px)"
          : "scale(1) translateY(0)",
        boxShadow: hovered
          ? "0 24px 64px rgba(0,0,0,0.8)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        transition:
          "transform 280ms cubic-bezier(0.16,1,0.3,1), box-shadow 280ms cubic-bezier(0.16,1,0.3,1), border-color 280ms cubic-bezier(0.16,1,0.3,1)",
        zIndex: hovered ? 2 : 1,
        position: "relative",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: `linear-gradient(135deg, ${accent}22, ${accent}55)`,
          overflow: "hidden",
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        >
          {initials}
        </div>

        {/* VIP badge */}
        {customer.isVip && (
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "#F5A623",
              color: "#000",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              padding: "3px 7px",
              borderRadius: "4px",
              textTransform: "uppercase",
            }}
          >
            VIP
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#e8e8e8",
            margin: "0 0 4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {customer.name || "Unknown"}
        </p>
        <p
          style={{
            fontSize: "11px",
            color: "#666",
            margin: "0 0 6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {customer.email || "No email"}
        </p>
        {customer.totalSpend && (
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#46D369",
              margin: 0,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            ₹{Number(customer.totalSpend).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAMPAIGN CARD
═══════════════════════════════════════════════════════════════ */
function CampaignCard({ campaign, index }) {
  const [hovered, setHovered] = useState(false);

  const gradients = [
    "linear-gradient(135deg,#1a1a2e,#16213e)",
    "linear-gradient(135deg,#0f0c29,#302b63)",
    "linear-gradient(135deg,#200122,#6f0000)",
    "linear-gradient(135deg,#0f2027,#203a43)",
    "linear-gradient(135deg,#11998e,#0a3d2e)",
    "linear-gradient(135deg,#373b44,#1a1a2e)",
  ];

  const statusMap = {
    active:    { color: "#46D369", label: "Active" },
    completed: { color: "#888",    label: "Done"   },
    draft:     { color: "#F5A623", label: "Draft"  },
    paused:    { color: "#E50914", label: "Paused" },
  };
  const statusKey = (campaign.status || "draft").toLowerCase();
  const { color: dotColor, label: statusLabel } =
    statusMap[statusKey] || statusMap.draft;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "0 0 220px",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#141414",
        border: `1px solid ${hovered ? "#333" : "#1f1f1f"}`,
        cursor: "pointer",
        scrollSnapAlign: "start",
        transform: hovered
          ? "scale(1.06) translateY(-5px)"
          : "scale(1) translateY(0)",
        boxShadow: hovered
          ? "0 24px 64px rgba(0,0,0,0.8)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        transition:
          "transform 280ms cubic-bezier(0.16,1,0.3,1), box-shadow 280ms cubic-bezier(0.16,1,0.3,1), border-color 280ms cubic-bezier(0.16,1,0.3,1)",
        zIndex: hovered ? 2 : 1,
        position: "relative",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: gradients[index % gradients.length],
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: "36px",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
          }}
        >
          📣
        </span>

        {/* Status badge */}
        <span
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            color: dotColor,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(0,0,0,0.65)",
            padding: "3px 8px",
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: dotColor,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          {statusLabel}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#e8e8e8",
            margin: "0 0 4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {campaign.campaignName || "Unnamed"}
        </p>
        <p
          style={{
            fontSize: "11px",
            color: "#666",
            margin: "0 0 6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {campaign.audienceSize
            ? `${campaign.audienceSize} recipients`
            : "Audience TBD"}
        </p>
        {campaign.sentCount !== undefined && (
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#46D369",
              margin: 0,
            }}
          >
            {campaign.sentCount} sent
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKELETON CARD  — shimmer placeholder while loading
═══════════════════════════════════════════════════════════════ */
function SkeletonCard() {
  const shimmerStyle = {
    background:
      "linear-gradient(90deg,#1a1a1a 25%,#262626 50%,#1a1a1a 75%)",
    backgroundSize: "400px 100%",
    animation: "shimmer 1.6s ease-in-out infinite",
    borderRadius: "6px",
  };

  return (
    <div
      style={{
        flex: "0 0 220px",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#141414",
        border: "1px solid #1f1f1f",
        scrollSnapAlign: "start",
      }}
    >
      <div style={{ height: "120px", ...shimmerStyle, borderRadius: 0 }} />
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ height: "13px", width: "80%", marginBottom: "8px", ...shimmerStyle }} />
        <div style={{ height: "11px", width: "60%", ...shimmerStyle }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI RECOMMENDATION PANEL
═══════════════════════════════════════════════════════════════ */
function AIPanel({ recommendation }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (recommendation) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
  }, [recommendation]);

  return (
    <div
      style={{
        margin: "28px 40px 0",
        background: "linear-gradient(135deg,#0d0d1a 0%,#0a0a14 100%)",
        border: "1px solid #1e1e2e",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition:
          "opacity 400ms cubic-bezier(0.16,1,0.3,1), transform 400ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Top shimmer line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg,transparent,rgba(99,102,241,0.6),transparent)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px 14px",
          borderBottom: "1px solid #1e1e2e",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#a5b4fc",
            letterSpacing: "0.02em",
            animation: "glow 2s ease-in-out infinite alternate",
          }}
        >
          ✦ AI Intelligence
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "0.15em",
            color: "#E50914",
            background: "rgba(229,9,20,0.1)",
            border: "1px solid rgba(229,9,20,0.25)",
            padding: "3px 10px",
            borderRadius: "20px",
            animation: "blink 2s ease-in-out infinite",
          }}
        >
          LIVE
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px 24px" }}>
        {recommendation ? (
          <pre
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: "14px",
              lineHeight: 1.75,
              color: "#c4c4d4",
              whiteSpace: "pre-wrap",
              margin: 0,
              fontWeight: 400,
            }}
          >
            {recommendation}
          </pre>
        ) : (
          /* Loading skeleton lines */
          <div>
            {[90, 70, 85, 55].map((w, i) => (
              <div
                key={i}
                style={{
                  height: "13px",
                  width: `${w}%`,
                  borderRadius: "6px",
                  marginBottom: "10px",
                  background:
                    "linear-gradient(90deg,#1a1a2e 25%,#22223a 50%,#1a1a2e 75%)",
                  backgroundSize: "400px 100%",
                  animation: "shimmer 1.6s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    vipCustomers: 0,
    totalRevenue: 0,
  });
  const [recommendation, setRecommendation] = useState("");
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
    fetchRecommendation();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/dashboard/stats");
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentData = async () => {
    try {
      const { data } = await API.get("/dashboard/recent");
      setRecentCustomers(data.customers || []);
      setRecentCampaigns(data.campaigns || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecommendation = async () => {
    try {
      const { data } = await API.get("/dashboard/recommendation");
      setRecommendation(data.recommendation);
    } catch (error) {
      console.log(error);
    }
  };

  /* Time-based greeting */
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      {/* ── Global keyframe animations ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.4; }
        }
        @keyframes glow {
          from { filter: drop-shadow(0 0 4px  rgba(99,102,241,0.4)); }
          to   { filter: drop-shadow(0 0 12px rgba(99,102,241,0.9)); }
        }
        * { box-sizing: border-box; }
        /* Hide scrollbar on webkit for row tracks */
        .crm-row-track::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ display: "flex" }}>
        {/* ── Sidebar (unchanged) ── */}
        <Sidebar />

        {/* ── Main content ── */}
        <div
          style={{
            flex: 1,
            background: "#0a0a0a",
            color: "#e8e8e8",
            minHeight: "100vh",
            overflowX: "hidden",
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {/* ════════════════════════════
              HERO BANNER  (Uber-style)
          ════════════════════════════ */}
          <div
            style={{
              position: "relative",
              padding: "48px 40px 40px",
              background:
                "linear-gradient(135deg,#141414 0%,#1a0a0a 50%,#0a0a0a 100%)",
              borderBottom: "1px solid #1f1f1f",
              overflow: "hidden",
            }}
          >
            {/* Ambient glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 80% 50%,rgba(229,9,20,0.09) 0%,transparent 60%), radial-gradient(ellipse at 20% 80%,rgba(70,211,105,0.04) 0%,transparent 50%)",
                pointerEvents: "none",
              }}
            />

            {/* Text */}
            <div style={{ position: "relative" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#E50914",
                  margin: "0 0 6px",
                }}
              >
                {greeting}
              </p>
              <h1
                style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "#fff",
                  margin: "0 0 10px",
                }}
              >
                Dashboard
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#777",
                  margin: 0,
                  maxWidth: "480px",
                }}
              >
                Here's what's happening across your customer base today.
              </p>
            </div>

            {/* Date top-right */}
            <span
              style={{
                position: "absolute",
                top: "48px",
                right: "40px",
                fontSize: "12px",
                color: "#555",
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              {now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>

          {/* ════════════════════════════
              KPI STAT CARDS
          ════════════════════════════ */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              padding: "32px 40px 8px",
              flexWrap: "wrap",
            }}
          >
            <EnhancedStatCard
              title="Customers"
              value={stats.totalCustomers}
              icon="👥"
              accent="#E50914"
            />
            <EnhancedStatCard
              title="VIP Customers"
              value={stats.vipCustomers}
              icon="⭐"
              accent="#F5A623"
            />
            <EnhancedStatCard
              title="Revenue"
              value={`₹${stats.totalRevenue}`}
              icon="💰"
              accent="#46D369"
            />
          </div>

          {/* ════════════════════════════
              RECENT CUSTOMERS  (Netflix row)
          ════════════════════════════ */}
          <HorizontalRow title="Recent Customers">
            {recentCustomers.length > 0
              ? recentCustomers.map((customer, i) => (
                  <CustomerCard
                    key={customer._id}
                    customer={customer}
                    index={i}
                  />
                ))
              : [...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </HorizontalRow>

          {/* ════════════════════════════
              RECENT CAMPAIGNS  (Netflix row)
          ════════════════════════════ */}
          <HorizontalRow title="Recent Campaigns">
            {recentCampaigns.length > 0
              ? recentCampaigns.map((campaign, i) => (
                  <CampaignCard
                    key={campaign._id}
                    campaign={campaign}
                    index={i}
                  />
                ))
              : [...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </HorizontalRow>

          {/* ════════════════════════════
              AI RECOMMENDATION
          ════════════════════════════ */}
          <AIPanel recommendation={recommendation} />

          {/* Bottom spacing */}
          <div style={{ height: "48px" }} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
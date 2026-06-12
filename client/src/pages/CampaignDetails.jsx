import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

/* ═══════════════════════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    sent:      { bg: "rgba(70,211,105,0.12)",  color: "#46D369" },
    failed:    { bg: "rgba(229,9,20,0.12)",    color: "#E50914" },
    pending:   { bg: "rgba(245,166,35,0.12)",  color: "#F5A623" },
    draft:     { bg: "rgba(156,163,175,0.10)", color: "#9CA3AF" },
    active:    { bg: "rgba(70,211,105,0.12)",  color: "#46D369" },
  };
  const key = (status || "draft").toLowerCase();
  const s = map[key] || map.draft;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: "12px", fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 14px",
      borderRadius: "20px", border: `1px solid ${s.color}33`,
      display: "inline-flex", alignItems: "center", gap: "6px",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color, display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
      {status || "Draft"}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AGENT CONTENT BLOCK
═══════════════════════════════════════════════════════════════ */
function AgentBlock({ title, icon, content, accentColor }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      background: "#0f0f0f", border: `1px solid #1f1f1f`,
      borderRadius: "14px", overflow: "hidden",
      borderLeft: `3px solid ${accentColor}`,
      animation: "fadeUp 0.4s ease both",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "18px 22px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>{icon}</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8e8", letterSpacing: "-0.01em" }}>{title}</span>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: accentColor, display: "inline-block" }} />
        </div>
        <span style={{ color: "#555", fontSize: "18px", transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}>⌄</span>
      </button>
      {open && (
        <div style={{ padding: "0 22px 22px" }}>
          <pre style={{
            fontFamily: "'Inter', monospace", fontSize: "13px", lineHeight: 1.8,
            color: "#a0a0b0", whiteSpace: "pre-wrap", margin: 0,
            background: "#080808", border: "1px solid #1a1a1a",
            borderRadius: "10px", padding: "16px 18px",
          }}>
            {content || "No data available."}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKELETON LOADER
═══════════════════════════════════════════════════════════════ */
function Skeleton() {
  const shimmer = {
    background: "linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)",
    backgroundSize: "400px 100%", animation: "shimmer 1.6s ease-in-out infinite", borderRadius: "6px",
  };
  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ height: "14px", width: "20%", ...shimmer }} />
      <div style={{ height: "32px", width: "55%", ...shimmer }} />
      <div style={{ height: "13px", width: "35%", ...shimmer }} />
      <div style={{ height: "1px", background: "#1a1a1a", margin: "8px 0" }} />
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ height: "100px", borderRadius: "14px", ...shimmer }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAMPAIGN DETAILS PAGE
═══════════════════════════════════════════════════════════════ */
const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => { fetchCampaign(); }, []);

  const fetchCampaign = async () => {
    try {
      const { data } = await API.get(`/campaigns/${id}`);
      setCampaign(data);
    } catch (error) { console.log(error); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-400px 0}100%{background-position:400px 0} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.75)} }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{
          flex: 1, background: "#0a0a0a", color: "#e8e8e8", minHeight: "100vh",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden",
        }}>
          {!campaign ? <Skeleton /> : (
            <>
              {/* ── Hero ── */}
              <div style={{
                position: "relative", padding: "48px 40px 40px",
                background: "linear-gradient(135deg,#141414 0%,#1a0a0a 50%,#0a0a0a 100%)",
                borderBottom: "1px solid #1f1f1f", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(ellipse at 80% 50%,rgba(229,9,20,0.07) 0%,transparent 60%)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E50914", margin: 0 }}>
                      Campaign Details
                    </p>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <h1 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 12px" }}>
                    {campaign.campaignName || "Untitled Campaign"}
                  </h1>
                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>Goal:</span>
                      <span style={{ fontSize: "13px", color: "#888" }}>{campaign.goal || "—"}</span>
                    </div>
                    {campaign.audienceSize && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>Audience:</span>
                        <span style={{ fontSize: "13px", color: "#888" }}>{campaign.audienceSize.toLocaleString("en-IN")} recipients</span>
                      </div>
                    )}
                    {campaign.createdAt && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#555", fontWeight: 600 }}>Created:</span>
                        <span style={{ fontSize: "13px", color: "#888" }}>
                          {new Date(campaign.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Agent Blocks ── */}
              <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <AgentBlock title="Planner Agent"          icon="🧠" content={campaign.planner}          accentColor="#2563EB" />
                <AgentBlock title="Segment Agent"          icon="🎯" content={campaign.segment}          accentColor="#F5A623" />
                <AgentBlock title="Campaign Content"       icon="📝" content={campaign.campaignContent}  accentColor="#46D369" />
              </div>
              <div style={{ height: "48px" }} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CampaignDetails;
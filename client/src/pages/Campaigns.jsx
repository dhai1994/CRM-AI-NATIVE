import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    sent:     { bg: "rgba(70,211,105,0.12)",  color: "#46D369", dot: true  },
    failed:   { bg: "rgba(229,9,20,0.12)",    color: "#E50914", dot: false },
    pending:  { bg: "rgba(245,166,35,0.12)",  color: "#F5A623", dot: true  },
    draft:    { bg: "rgba(156,163,175,0.10)", color: "#9CA3AF", dot: false },
    active:   { bg: "rgba(70,211,105,0.12)",  color: "#46D369", dot: true  },
    paused:   { bg: "rgba(245,166,35,0.12)",  color: "#F5A623", dot: false },
  };
  const key = (status || "draft").toLowerCase();
  const s = map[key] || map.draft;

  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
      textTransform: "uppercase", padding: "5px 12px",
      borderRadius: "20px", border: `1px solid ${s.color}33`,
      display: "inline-flex", alignItems: "center", gap: "6px",
    }}>
      {s.dot && (
        <span style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: s.color, display: "inline-block",
          animation: "pulse 2s ease-in-out infinite",
        }} />
      )}
      {status || "Draft"}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CAMPAIGNS PAGE
═══════════════════════════════════════════════════════════════ */
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchCampaigns(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/campaigns");
      setCampaigns(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async (campaign) => {
    setSendingId(campaign._id);
    try {
      await API.post(`/campaigns/${campaign._id}/send`);
      showToast(`"${campaign.campaignName}" sent successfully`);
      fetchCampaigns();
    } catch (error) {
      console.log(error);
      showToast("Failed to send campaign", "error");
    } finally {
      setSendingId(null);
    }
  };

  const filtered = campaigns.filter((c) =>
    (c.campaignName || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.goal || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.status || "").toLowerCase().includes(search.toLowerCase())
  );

  /* Summary counts */
  const sentCount   = campaigns.filter((c) => (c.status || "").toLowerCase() === "sent").length;
  const activeCount = campaigns.filter((c) => ["active","pending"].includes((c.status || "").toLowerCase())).length;
  const failedCount = campaigns.filter((c) => (c.status || "").toLowerCase() === "failed").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.75)} }
        @keyframes shimmer { 0%{background-position:-400px 0}100%{background-position:400px 0} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        .camp-row:hover { background: #161616 !important; }
        .view-btn:hover { background: #1a4fd6 !important; transform: translateY(-1px) !important; box-shadow: 0 6px 20px rgba(37,99,235,0.35) !important; }
        .send-btn:hover:not(:disabled) { background: #16a34a !important; transform: translateY(-1px) !important; box-shadow: 0 6px 20px rgba(70,211,105,0.3) !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
      `}</style>

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{
          flex: 1, background: "#0a0a0a", color: "#e8e8e8", minHeight: "100vh",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden",
        }}>

          {/* ── Toast ── */}
          {toast && (
            <div style={{
              position: "fixed", top: "24px", right: "24px", zIndex: 9999,
              background: toast.type === "error" ? "#1a0505" : "#0a1a0a",
              border: `1px solid ${toast.type === "error" ? "rgba(229,9,20,0.3)" : "rgba(70,211,105,0.3)"}`,
              color: toast.type === "error" ? "#ff6b6b" : "#46D369",
              padding: "14px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: 600,
              animation: "toastIn 0.3s ease both", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", gap: "8px", maxWidth: "340px",
            }}>
              <span>{toast.type === "error" ? "⚠" : "✓"}</span>
              {toast.msg}
            </div>
          )}

          {/* ── Hero Banner ── */}
          <div style={{
            position: "relative", padding: "48px 40px 40px",
            background: "linear-gradient(135deg,#141414 0%,#1a0a0a 50%,#0a0a0a 100%)",
            borderBottom: "1px solid #1f1f1f", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 80% 50%,rgba(229,9,20,0.08) 0%,transparent 60%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E50914", margin: "0 0 6px" }}>
                  CRM
                </p>
                <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 8px" }}>
                  Campaign History
                </h1>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                  {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""} total
                </p>
              </div>
              <button
                onClick={() => navigate("/campaigns/new")}
                style={{
                  background: "#E50914", color: "#fff", border: "none",
                  borderRadius: "10px", padding: "11px 22px", fontSize: "13px",
                  fontWeight: 700, cursor: "pointer", transition: "all 200ms ease",
                  display: "flex", alignItems: "center", gap: "8px",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff1a1a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#E50914"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                + New Campaign
              </button>
            </div>
          </div>

          <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* ── Summary KPI strip ── */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {[
                { label: "Total",   value: campaigns.length, color: "#e8e8e8", icon: "📣" },
                { label: "Sent",    value: sentCount,         color: "#46D369", icon: "✅" },
                { label: "Active",  value: activeCount,       color: "#F5A623", icon: "⚡" },
                { label: "Failed",  value: failedCount,       color: "#E50914", icon: "⚠" },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  style={{
                    flex: 1, minWidth: "120px",
                    background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: "12px",
                    padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px",
                    transition: "border-color 200ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
                >
                  <span style={{ fontSize: "20px" }}>{kpi.icon}</span>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>
                      {kpi.label}
                    </p>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: kpi.color, margin: 0, fontVariantNumeric: "tabular-nums" }}>
                      {kpi.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Table panel ── */}
            <div style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: "16px", overflow: "hidden" }}>

              {/* Table top bar */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8e8", margin: 0 }}>
                  All Campaigns
                </h2>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#555" }}>🔍</span>
                  <input
                    placeholder="Search campaigns…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      background: "#141414", border: "1px solid #2a2a2a", borderRadius: "10px",
                      padding: "10px 14px 10px 36px", fontSize: "13px", color: "#e8e8e8",
                      outline: "none", width: "220px", transition: "border-color 200ms ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#E50914")}
                    onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                  />
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                      {["Campaign Name", "Goal", "Status", "Audience", "View", "Send"].map((h) => (
                        <th key={h} style={{
                          padding: "12px 16px", textAlign: "left", fontSize: "11px",
                          fontWeight: 700, color: "#555", letterSpacing: "0.08em",
                          textTransform: "uppercase", whiteSpace: "nowrap", background: "#0f0f0f",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      /* Skeleton rows */
                      [...Array(5)].map((_, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #141414" }}>
                          {[...Array(6)].map((__, j) => (
                            <td key={j} style={{ padding: "18px 16px" }}>
                              <div style={{
                                height: "13px", width: `${[70,50,60,40,30,30][j]}%`, borderRadius: "6px",
                                background: "linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)",
                                backgroundSize: "400px 100%", animation: "shimmer 1.6s ease-in-out infinite",
                              }} />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "56px", textAlign: "center", color: "#444", fontSize: "14px" }}>
                          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📣</div>
                          {search ? "No campaigns match your search" : "No campaigns yet — create your first one"}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((campaign, i) => (
                        <tr
                          key={campaign._id}
                          className="camp-row"
                          style={{
                            borderBottom: "1px solid #141414",
                            transition: "background 150ms ease",
                            animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
                          }}
                        >
                          {/* Name */}
                          <td style={{ padding: "16px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{
                                width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                                background: `linear-gradient(135deg,hsl(${(campaign.campaignName || "").charCodeAt(0) * 15},50%,15%),hsl(${(campaign.campaignName || "").charCodeAt(0) * 15},50%,25%))`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "14px",
                              }}>
                                📣
                              </div>
                              <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8e8", margin: 0 }}>
                                  {campaign.campaignName || "Untitled"}
                                </p>
                                {campaign.createdAt && (
                                  <p style={{ fontSize: "11px", color: "#555", margin: "2px 0 0" }}>
                                    {new Date(campaign.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Goal */}
                          <td style={{ padding: "16px 16px", fontSize: "13px", color: "#888", maxWidth: "200px" }}>
                            <span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>
                              {campaign.goal || "—"}
                            </span>
                          </td>

                          {/* Status */}
                          <td style={{ padding: "16px 16px" }}>
                            <StatusBadge status={campaign.status} />
                          </td>

                          {/* Audience */}
                          <td style={{ padding: "16px 16px", fontSize: "13px", color: "#888", fontVariantNumeric: "tabular-nums" }}>
                            {campaign.audienceSize ? `${campaign.audienceSize.toLocaleString("en-IN")}` : "—"}
                          </td>

                          {/* View */}
                          <td style={{ padding: "16px 16px" }}>
                            <button
                              className="view-btn"
                              onClick={() => navigate(`/campaign/${campaign._id}`)}
                              style={{
                                background: "#2563EB", color: "#fff", border: "none",
                                borderRadius: "8px", padding: "8px 18px", fontSize: "12px",
                                fontWeight: 700, cursor: "pointer",
                                transition: "all 180ms cubic-bezier(0.16,1,0.3,1)",
                              }}
                            >
                              View →
                            </button>
                          </td>

                          {/* Send */}
                          <td style={{ padding: "16px 16px" }}>
                            <button
                              className="send-btn"
                              onClick={() => sendCampaign(campaign)}
                              disabled={sendingId === campaign._id}
                              style={{
                                background: sendingId === campaign._id ? "#1a1a1a" : "rgba(70,211,105,0.12)",
                                color: sendingId === campaign._id ? "#555" : "#46D369",
                                border: `1px solid ${sendingId === campaign._id ? "#2a2a2a" : "rgba(70,211,105,0.3)"}`,
                                borderRadius: "8px", padding: "8px 18px", fontSize: "12px",
                                fontWeight: 700, cursor: sendingId === campaign._id ? "not-allowed" : "pointer",
                                transition: "all 180ms cubic-bezier(0.16,1,0.3,1)",
                                display: "flex", alignItems: "center", gap: "6px",
                              }}
                            >
                              {sendingId === campaign._id ? (
                                <>
                                  <span style={{ width: "12px", height: "12px", border: "2px solid #333", borderTopColor: "#46D369", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                                  Sending…
                                </>
                              ) : "Send ↗"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Campaigns;
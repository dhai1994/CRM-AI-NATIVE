import { useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import AgentCard from "../components/AgentCard";
import { TailSpin } from "react-loader-spinner";

/* ═══════════════════════════════════════════════════════════════
   TIMELINE LOG ENTRY
═══════════════════════════════════════════════════════════════ */
function LogEntry({ log, index }) {
  const isComplete = log.toLowerCase().includes("completed");
  const isFailed   = log.toLowerCase().includes("failed");
  const isStarted  = log.toLowerCase().includes("started");
  const isSuccess  = log.toLowerCase().includes("successfully");

  const color = isFailed ? "#E50914" : isComplete || isSuccess ? "#46D369" : isStarted ? "#F5A623" : "#888";
  const icon  = isFailed ? "✕" : isComplete || isSuccess ? "✓" : isStarted ? "⚡" : "•";

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "12px",
      animation: `fadeUp 0.25s ease ${index * 0.06}s both`,
    }}>
      {/* Connector line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "2px" }}>
        <div style={{
          width: "24px", height: "24px", borderRadius: "50%",
          background: `${color}18`, border: `1px solid ${color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 700, color,
        }}>
          {icon}
        </div>
        {index < 99 && <div style={{ width: "1px", flex: 1, minHeight: "12px", background: "#1f1f1f", marginTop: "4px" }} />}
      </div>
      <div style={{ paddingBottom: "14px", flex: 1 }}>
        <p style={{ fontSize: "13px", color: "#c4c4d4", margin: 0, lineHeight: 1.5 }}>{log}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AGENT STEPS (pipeline stages)
═══════════════════════════════════════════════════════════════ */
const PIPELINE_STEPS = [
  { key: "planner",   label: "Planner",   icon: "🧠", color: "#2563EB" },
  { key: "segment",   label: "Segment",   icon: "🎯", color: "#F5A623" },
  { key: "campaign",  label: "Campaign",  icon: "📝", color: "#46D369" },
  { key: "analytics", label: "Analytics", icon: "📊", color: "#A78BFA" },
];

function PipelineBar({ loading, result }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0", marginBottom: "8px", flexWrap: "nowrap",
      overflowX: "auto", paddingBottom: "4px",
    }}>
      {PIPELINE_STEPS.map((step, i) => {
        const done = result && result[step.key];
        const active = loading && !result;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: done ? `${step.color}18` : active ? "rgba(255,255,255,0.04)" : "#0f0f0f",
              border: `1px solid ${done ? step.color + "44" : "#2a2a2a"}`,
              borderRadius: "8px", padding: "8px 14px",
              transition: "all 300ms ease",
            }}>
              <span style={{ fontSize: "14px" }}>{step.icon}</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: done ? step.color : "#555", whiteSpace: "nowrap" }}>
                {step.label}
              </span>
              {done && <span style={{ fontSize: "11px", color: step.color }}>✓</span>}
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div style={{ width: "24px", height: "1px", background: "#2a2a2a", flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AGENT PAGE
═══════════════════════════════════════════════════════════════ */
const Agent = () => {
  const [goal, setGoal]       = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs]       = useState([]);
  const [result, setResult]   = useState(null);
  const [saved, setSaved]     = useState(false);
  const [focused, setFocused] = useState(false);

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${time} — ${message}`]);
  };

  const generateCampaign = async () => {
    try {
      setLoading(true);
      setResult(null);
      setLogs([]);
      setSaved(false);

      addLog("Planner Agent Started");
      const planner = await API.post("/ai/planner", { goal });
      addLog("Planner Agent Completed");

      addLog("Segment Agent Started");
      const segment = await API.post("/ai/segment", { goal });
      addLog("Segment Agent Completed");

      addLog("Campaign Agent Started");
      const campaign = await API.post("/ai/campaign", { goal });
      addLog("Campaign Agent Completed");

      addLog("Analytics Agent Started");
      const stats     = await API.get("/analytics");
      const analytics = await API.post("/ai/analytics", { goal, stats: stats.data });
      addLog("Analytics Agent Completed");

      addLog("Campaign Generated Successfully");

      setResult({
        planner:   planner.data,
        segment:   segment.data,
        campaign:  campaign.data,
        analytics: analytics.data,
      });
    } catch (error) {
      console.log(error);
      addLog("Agent Failed");
    } finally {
      setLoading(false);
    }
  };

  const saveCampaign = async () => {
    try {
      await API.post("/campaigns", {
        campaignName: "AI Generated Campaign",
        goal,
        planner:         typeof result.planner   === "string" ? result.planner   : JSON.stringify(result.planner),
        segment:         typeof result.segment   === "string" ? result.segment   : JSON.stringify(result.segment),
        campaignContent: typeof result.campaign  === "string" ? result.campaign  : JSON.stringify(result.campaign),
      });
      setSaved(true);
    } catch (error) {
      console.log(error);
    }
  };

  const stringify = (val) =>
    typeof val === "string" ? val : JSON.stringify(val, null, 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.75)} }
        @keyframes glow { from{filter:drop-shadow(0 0 4px rgba(99,102,241,0.4))}to{filter:drop-shadow(0 0 12px rgba(99,102,241,0.9))} }
        * { box-sizing: border-box; }
        .gen-btn:hover:not(:disabled) { background: #ff1a1a !important; transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(229,9,20,0.4) !important; }
        .save-btn:hover:not(:disabled) { background: #16a34a !important; transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(70,211,105,0.3) !important; }
        textarea:focus { border-color: #E50914 !important; box-shadow: 0 0 0 3px rgba(229,9,20,0.1) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
      `}</style>

      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{
          flex: 1, background: "#0a0a0a", color: "#e8e8e8", minHeight: "100vh",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden",
        }}>

          {/* ── Hero Banner ── */}
          <div style={{
            position: "relative", padding: "48px 40px 40px",
            background: "linear-gradient(135deg,#141414 0%,#0a0a1a 50%,#0a0a0a 100%)",
            borderBottom: "1px solid #1f1f1f", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 80% 50%,rgba(99,102,241,0.1) 0%,transparent 60%), radial-gradient(ellipse at 20% 80%,rgba(229,9,20,0.05) 0%,transparent 50%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366F1", margin: "0 0 6px" }}>
                Automation
              </p>
              <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 8px" }}>
                AI Agent
              </h1>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                Define a business goal. Four agents work in sequence to build your campaign.
              </p>
            </div>
          </div>

          <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* ── Pipeline Bar ── */}
            <PipelineBar loading={loading} result={result} />

            {/* ── Input + Generate ── */}
            <div style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "24px", animation: "fadeUp 0.3s ease both" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
                Business Goal
              </label>
              <textarea
                rows={4}
                placeholder="e.g. Re-engage VIP customers who haven't purchased in 90 days with a personalised discount campaign…"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={{
                  width: "100%", background: "#141414",
                  border: "1px solid #2a2a2a", borderRadius: "10px",
                  padding: "14px 16px", fontSize: "14px", color: "#e8e8e8",
                  outline: "none", resize: "vertical", lineHeight: 1.6,
                  fontFamily: "inherit", transition: "border-color 200ms ease, box-shadow 200ms ease",
                  minHeight: "100px",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#E50914"; e.target.style.boxShadow = "0 0 0 3px rgba(229,9,20,0.1)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "#2a2a2a"; e.target.style.boxShadow = "none"; }}
              />
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <button
                  className="gen-btn"
                  onClick={generateCampaign}
                  disabled={loading || !goal.trim()}
                  style={{
                    background: loading || !goal.trim() ? "#1a1a1a" : "#E50914",
                    color: loading || !goal.trim() ? "#444" : "#fff",
                    border: "none", borderRadius: "10px", padding: "13px 28px",
                    fontSize: "14px", fontWeight: 700, cursor: loading || !goal.trim() ? "not-allowed" : "pointer",
                    transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ width: "16px", height: "16px", border: "2px solid #333", borderTopColor: "#888", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                      Agents Working…
                    </>
                  ) : "⚡ Generate Campaign"}
                </button>
                {result && (
                  <button
                    className="save-btn"
                    onClick={saveCampaign}
                    disabled={saved}
                    style={{
                      background: saved ? "rgba(70,211,105,0.12)" : "rgba(70,211,105,0.12)",
                      color: saved ? "#46D369" : "#46D369",
                      border: `1px solid ${saved ? "rgba(70,211,105,0.4)" : "rgba(70,211,105,0.3)"}`,
                      borderRadius: "10px", padding: "13px 28px", fontSize: "14px",
                      fontWeight: 700, cursor: saved ? "not-allowed" : "pointer",
                      transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}
                  >
                    {saved ? "✓ Campaign Saved" : "💾 Save Campaign"}
                  </button>
                )}
              </div>
            </div>

            {/* ── Loading State ── */}
            {loading && (
              <div style={{
                background: "linear-gradient(135deg,#0d0d1a,#0a0a14)",
                border: "1px solid #1e1e2e", borderRadius: "16px",
                padding: "36px 24px", textAlign: "center",
                animation: "fadeUp 0.3s ease both",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <TailSpin height="44" width="44" color="#6366F1" ariaLabel="loading" />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#e8e8e8", margin: "0 0 8px" }}>
                  AI Agents Working…
                </h3>
                <p style={{ fontSize: "13px", color: "#555", margin: 0, letterSpacing: "0.04em" }}>
                  Planner → Segment → Campaign → Analytics
                </p>
              </div>
            )}

            {/* ── Timeline ── */}
            {logs.length > 0 && (
              <div style={{
                background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: "16px",
                padding: "22px 24px", animation: "fadeUp 0.3s ease both",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                  <span style={{ fontSize: "14px" }}>🕐</span>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8e8", margin: 0 }}>Agent Timeline</h3>
                  <span style={{ fontSize: "11px", color: "#555", background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "2px 10px", borderRadius: "20px" }}>
                    {logs.length} events
                  </span>
                </div>
                <div>
                  {logs.map((log, i) => <LogEntry key={i} log={log} index={i} />)}
                </div>
              </div>
            )}

            {/* ── Agent Result Cards ── */}
            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "fadeUp 0.4s ease both" }}>
                <AgentCard title="🧠 Planner Agent"   content={stringify(result.planner)}   />
                <AgentCard title="🎯 Segment Agent"   content={stringify(result.segment)}   />
                <AgentCard title="📝 Campaign Agent"  content={stringify(result.campaign)}  />
                <AgentCard title="📊 Analytics Agent" content={stringify(result.analytics)} />
              </div>
            )}
          </div>
          <div style={{ height: "48px" }} />
        </div>
      </div>
    </>
  );
};

export default Agent;
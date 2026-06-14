import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";

function daysSince(dateValue) {
  if (!dateValue) return 999;
  const current = new Date();
  const input = new Date(dateValue);
  const diff = current.getTime() - input.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function getChurnLevel(score) {
  if (score >= 75) return { label: "High Risk", color: "#ef4444", glow: "rgba(239,68,68,0.22)" };
  if (score >= 45) return { label: "Medium Risk", color: "#f59e0b", glow: "rgba(245,158,11,0.18)" };
  return { label: "Low Risk", color: "#22c55e", glow: "rgba(34,197,94,0.18)" };
}

function calculateChurn(customer) {
  const spent = Number(customer.totalSpent || 0);
  const orders = Number(customer.totalOrders || 0);
 const inactiveDays =
  Number(customer.inactiveDays || 0);

  let score = 0;
  const reasons = [];

  if (inactiveDays >= 90) {
    score += 45;
    reasons.push(`No purchase in ${inactiveDays} days`);
  } else if (inactiveDays >= 45) {
    score += 30;
    reasons.push(`Purchase activity slowing for ${inactiveDays} days`);
  } else if (inactiveDays >= 20) {
    score += 15;
  }

  if (orders <= 1) {
    score += 25;
    reasons.push("Very low order frequency");
  } else if (orders <= 3) {
    score += 15;
  }

  if (spent < 1000) {
    score += 20;
    reasons.push("Low lifetime spend");
  } else if (spent < 5000) {
    score += 10;
  }

  if ((customer.segment || "").toLowerCase().includes("inactive")) {
    score += 15;
    reasons.push("Already marked in inactive segment");
  }

  score = Math.min(100, score);
  const level = getChurnLevel(score);

  let action = "Send premium upsell campaign.";
  if (score >= 75) action = "Send immediate win-back offer with strong discount.";
  else if (score >= 45) action = "Send reminder campaign with personalized benefits.";
  else action = "Keep engaged with loyalty or referral message.";

  return {
    ...customer,
    churnScore: score,
    churnLabel: level.label,
    churnColor: level.color,
    churnGlow: level.glow,
    churnReason: reasons.length ? reasons.join(" • ") : "Healthy purchase pattern.",
    recommendedAction: action,
    inactiveDays,
  };
}

function StatMiniCard({ title, value, accent }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "14px 16px",
        minWidth: "160px",
        flex: 1,
        boxShadow: `0 8px 24px ${accent}10`,
        backdropFilter: "blur(14px)",
      }}
    >
      <p style={{ margin: 0, color: "#778091", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
        {title}
      </p>
      <h3 style={{ margin: "8px 0 0", color: "#fff", fontSize: "18px", letterSpacing: "-0.03em", fontWeight: 700 }}>{value}</h3>
    </div>
  );
}

function ChurnCustomerCard({ customer }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "18px",
        padding: "18px",
        backdropFilter: "blur(16px)",
        boxShadow: `0 14px 44px ${customer.churnGlow}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at top right, ${customer.churnGlow} 0%, transparent 40%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                background: `linear-gradient(135deg, ${getUrgencyColor(customer.urgency)}, #111827)`,
                boxShadow: `0 8px 24px ${customer.churnGlow}`,
              }}
            >
              {(customer.name || "C").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "15px", fontWeight: 700 }}>{customer.name}</h3>
              <p style={{ margin: "2px 0 0", color: "#8b93a7", fontSize: "12px" }}>{customer.email || "No email"}</p>
            </div>
          </div>

          <p style={{ margin: "0 0 8px", color: "#c7cede", fontSize: "12.5px", lineHeight: 1.65 }}>
            {customer.predictedTimeWindow}
          </p>
          <p style={{ margin: 0, color: "#8b93a7", fontSize: "12px", lineHeight: 1.6 }}>
            Recommended action: <span style={{ color: "#fff" }}>{customer.offerType}</span>
          </p>
        </div>

        <div style={{ minWidth: "210px", maxWidth: "228px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
            <span
              style={{
                color: getUrgencyColor(customer.urgency),
                border: `1px solid ${getUrgencyColor(customer.urgency)}40`,
                background: `${getUrgencyColor(customer.urgency)}10`,
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {customer.urgency}
            </span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{customer.churnProbability}%</span>
          </div>

          <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "12px" }}>
            <div
              style={{
                width: `${customer.churnProbability}%`,
                height: "100%",
                borderRadius: "999px",
                background: `linear-gradient(90deg, ${getUrgencyColor(customer.urgency)}, ${getUrgencyColor(customer.urgency)}aa)`,
                boxShadow: `0 0 20px ${customer.churnGlow}`,
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px" }}>
              <p style={{ margin: 0, color: "#7b8191", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Days inactive</p>
              <p style={{ margin: "6px 0 0", color: "#fff", fontWeight: 700, fontSize: "14px" }}>{customer.inactiveDays}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px" }}>
              <p style={{ margin: 0, color: "#7b8191", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Orders</p>
              <p style={{ margin: "6px 0 0", color: "#fff", fontWeight: 700, fontSize: "14px" }}>{Number(customer.totalOrders || 0)}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px" }}>
              <p style={{ margin: 0, color: "#7b8191", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Spent</p>
              <p style={{ margin: "6px 0 0", color: "#fff", fontWeight: 700, fontSize: "14px" }}>₹{Number(customer.totalSpent || 0).toLocaleString("en-IN")}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px" }}>
              <p style={{ margin: 0, color: "#7b8191", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Segment</p>
              <p style={{ margin: "6px 0 0", color: "#fff", fontWeight: 700, fontSize: "13px" }}>{customer.segment || "General"}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px" }}>
  <p style={{ margin: 0, color: "#7b8191", fontSize: "9px", textTransform: "uppercase" }}>
    14 Day Survival
  </p>
  <p style={{ margin: "6px 0 0", color: "#22c55e", fontWeight: 700 }}>
    {customer.survival14Days}%
  </p>
</div>

<div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px" }}>
  <p style={{ margin: 0, color: "#7b8191", fontSize: "9px", textTransform: "uppercase" }}>
    30 Day Survival
  </p>
  <p style={{ margin: "6px 0 0", color: "#22c55e", fontWeight: 700 }}>
    {customer.survival30Days}%
  </p>
</div>

<div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px" }}>
  <p style={{ margin: 0, color: "#7b8191", fontSize: "9px", textTransform: "uppercase" }}>
    90 Day Survival
  </p>
  <p style={{ margin: "6px 0 0", color: "#22c55e", fontWeight: 700 }}>
    {customer.survival90Days}%
  </p>
</div>

<div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "10px" }}>
  <p style={{ margin: 0, color: "#7b8191", fontSize: "9px", textTransform: "uppercase" }}>
    180 Day Survival
  </p>
  <p style={{ margin: "6px 0 0", color: "#22c55e", fontWeight: 700 }}>
    {customer.survival180Days}%
  </p>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChurnPredictor = () => {
const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
    const { data } = await API.get("/churn/predict-future");
      setPredictions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 const churnCustomers = useMemo(() => {
  return [...predictions].sort(
    (a, b) => b.churnProbability - a.churnProbability
  );
}, [predictions]);

 const summary = useMemo(() => {
  return {
    critical: predictions.filter(
      p => p.urgency === "CRITICAL"
    ).length,

    high: predictions.filter(
      p => p.urgency === "HIGH"
    ).length,

    medium: predictions.filter(
      p => p.urgency === "MEDIUM"
    ).length,

    safe: predictions.filter(
      p => p.urgency === "SAFE"
    ).length,
  };
}, [predictions]);
  const generateReport = async () => {
    try {
      setReportLoading(true);
      const { data } = await API.post("/churn/report");
      setReport(data.report);
    } catch (error) {
      console.log(error);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ display: "flex", background: "#05070b" }}>
        <Sidebar />

        <div style={{ flex: 1, minHeight: "100vh", color: "#e5e7eb", fontFamily: "'Inter', sans-serif", background: "radial-gradient(circle at top center, rgba(244,63,94,0.08), transparent 24%), linear-gradient(180deg, #06080d 0%, #05070b 100%)" }}>
          <div style={{ padding: "34px 34px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(99,102,241,0.12), transparent 25%), radial-gradient(circle at 25% 0%, rgba(244,63,94,0.10), transparent 28%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <p style={{ margin: 0, color: "#f43f5e", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, fontSize: "10px" }}>
                AI Retention Studio
              </p>
              <h1 style={{ margin: "8px 0 6px", fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1.02, letterSpacing: "-0.045em", color: "#fff", fontWeight: 800 }}>
                Churn Predictor
              </h1>
              <p style={{ margin: 0, color: "#9aa3b2", fontSize: "13px", maxWidth: "700px", lineHeight: 1.7 }}>
                Score every customer for churn risk, understand why they may leave, and decide what retention action to take next.
              </p>
            </div>
          </div>

          <div style={{ padding: "24px 34px 34px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", animation: "fadeUp 0.35s ease both" }}>
              <StatMiniCard title="Total Customers Scored" value={churnCustomers.length} accent="#6366F1" />
            <StatMiniCard
  title="Critical"
  value={summary.critical}
  accent="#ef4444"
/>

<StatMiniCard
  title="High"
  value={summary.high}
  accent="#f97316"
/>

<StatMiniCard
  title="Medium"
  value={summary.medium}
  accent="#eab308"
/>

<StatMiniCard
  title="Safe"
  value={summary.safe}
  accent="#22c55e"
/>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "18px",
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                  AI Executive Report
                </h2>

                <button
                  onClick={generateReport}
                  style={{
                    background: "#f43f5e",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {reportLoading ? "Generating..." : "Generate AI Report"}
                </button>
              </div>

              {report && (
                <div style={{ marginTop: "16px", color: "#d1d5db", whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: "13px" }}>
                  {report}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              {loading ? (
                [...Array(4)].map((_, index) => (
                  <div key={index} style={{ height: "190px", borderRadius: "18px", background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)", backgroundSize: "400px 100%", animation: "fadeUp 0.35s ease both" }} />
                ))
              ) : churnCustomers.length === 0 ? (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "28px", textAlign: "center", color: "#9aa3b2", fontSize: "13px" }}>
                  No customers found. Add customers first to generate churn predictions.
                </div>
              ) : (
                churnCustomers.map((customer, index) => (
                  <div key={customer._id || index} style={{ animation: `fadeUp 0.35s ease ${index * 0.04}s both` }}>
                    <ChurnCustomerCard customer={customer} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChurnPredictor;

function getUrgencyColor(urgency) {
  switch (urgency) {
    case "CRITICAL":
      return "#ef4444";

    case "HIGH":
      return "#f97316";

    case "MEDIUM":
      return "#eab308";

    case "LOW":
      return "#3b82f6";

    default:
      return "#22c55e";
  }
}
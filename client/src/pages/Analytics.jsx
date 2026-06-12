import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import CustomerPieChart from "../components/CustomerPieChart";
import RevenueBarChart from "../components/RevenueBarChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

function AnimatedCounter({ value, prefix = "", suffix = "", duration = 1200 }) {
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
  return <span>{prefix}{display.toLocaleString("en-IN")}{suffix}</span>;
}

function KpiCard({ label, value, icon, accent, prefix = "", suffix = "" }) {
  const [hovered, setHovered] = useState(false);
  const numeric = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        minWidth: "160px",
        background: hovered
          ? `radial-gradient(ellipse at 0% 50%,${accent}14 0%,#141414 70%)`
          : "#141414",
        border: `1px solid ${hovered ? "#2a2a2a" : "#1f1f1f"}`,
        borderRadius: "12px",
        padding: "20px 22px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.5)" : "none",
        cursor: "default",
      }}
    >
      <span style={{ fontSize: "26px", filter: `drop-shadow(0 0 8px ${accent})`, lineHeight: 1 }}>
        {icon}
      </span>
      <div>
        <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", margin: "0 0 4px" }}>
          {label}
        </p>
        <p style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "#fff", margin: 0, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
          <AnimatedCounter value={numeric} prefix={prefix} suffix={suffix} />
        </p>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid #1f1f1f",
        borderRadius: "16px",
        overflow: "hidden",
        flex: 1,
        minWidth: "280px",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "16px" }}>{icon}</span>
        <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#e8e8e8", margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: "20px 22px 24px" }}>{children}</div>
    </div>
  );
}

function CustomerCountBarChart({ stats }) {
  const data = [
    { name: "Customers", value: Number(stats.totalCustomers || 0), fill: "#E50914" },
    { name: "VIP", value: Number(stats.vipCustomers || 0), fill: "#F5A623" },
    { name: "Active", value: Number(stats.activeCustomers || 0), fill: "#46D369" },
    { name: "Inactive", value: Number(stats.inactiveCustomers || 0), fill: "#6366F1" },
  ];

  return (
    <div style={{ width: "100%", height: "240px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#666", fontSize: 11 }}
            axisLine={{ stroke: "#2a2a2a" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#666", fontSize: 11 }}
            axisLine={{ stroke: "#2a2a2a" }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [value, "Count"]}
            contentStyle={{
              backgroundColor: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: "10px",
              fontSize: "12px",
              color: "#e8e8e8",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
            itemStyle={{ color: "#e8e8e8" }}
            labelStyle={{ color: "#888" }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const Analytics = () => {
  const [stats, setStats] = useState({});
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);
  const [insightsVisible, setInsightsVisible] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/analytics");
      setStats(data);
      const insightData = await API.post("/analytics/insights", data);
      setInsights(insightData.data.insights);
      setTimeout(() => setInsightsVisible(true), 400);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const shimmer = {
    background: "linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%)",
    backgroundSize: "400px 100%",
    animation: "shimmer 1.6s ease-in-out infinite",
    borderRadius: "8px",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-400px 0}100%{background-position:400px 0} }
        @keyframes glow { from{filter:drop-shadow(0 0 4px rgba(99,102,241,0.4))}to{filter:drop-shadow(0 0 12px rgba(99,102,241,0.9))} }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.4} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.75)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
      `}</style>

      <div style={{ display: "flex" }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            background: "#0a0a0a",
            color: "#e8e8e8",
            minHeight: "100vh",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "48px 40px 40px",
              background: "linear-gradient(135deg,#141414 0%,#0a0a1a 50%,#0a0a0a 100%)",
              borderBottom: "1px solid #1f1f1f",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 80% 50%,rgba(99,102,241,0.08) 0%,transparent 60%), radial-gradient(ellipse at 20% 80%,rgba(70,211,105,0.04) 0%,transparent 50%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366F1", margin: "0 0 6px" }}>
                Insights
              </p>
              <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 8px" }}>
                Analytics
              </h1>
              <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                Real-time data across your customer base and campaigns
              </p>
            </div>
            <span style={{ position: "absolute", top: "48px", right: "40px", fontSize: "12px", color: "#555", fontWeight: 500, letterSpacing: "0.04em" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>

          <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {loading ? (
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ flex: 1, minWidth: "160px", height: "84px", ...shimmer }} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", animation: "fadeUp 0.3s ease both" }}>
                <KpiCard label="Total Customers" value={stats.totalCustomers} icon="👥" accent="#E50914" />
                <KpiCard label="VIP Customers" value={stats.vipCustomers} icon="⭐" accent="#F5A623" />
                <KpiCard label="Active Customers" value={stats.activeCustomers} icon="⚡" accent="#46D369" />
                <KpiCard label="Inactive Customers" value={stats.inactiveCustomers} icon="💤" accent="#6366F1" />
                <KpiCard label="Total Revenue" value={stats.totalRevenue} icon="💰" accent="#46D369" prefix="₹" />
              </div>
            )}

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <ChartCard title="Customer Distribution" icon="🥧">
                {loading ? <div style={{ height: "240px", ...shimmer }} /> : <CustomerPieChart active={stats.activeCustomers} inactive={stats.inactiveCustomers} />}
              </ChartCard>

              <ChartCard title="Revenue Analytics" icon="💰">
                {loading ? <div style={{ height: "240px", ...shimmer }} /> : <RevenueBarChart stats={stats} />}
              </ChartCard>
            </div>

            <ChartCard title="Customer Metrics" icon="📊">
              {loading ? <div style={{ height: "240px", ...shimmer }} /> : <CustomerCountBarChart stats={stats} />}
            </ChartCard>

            <div
              style={{
                background: "linear-gradient(135deg,#0d0d1a 0%,#0a0a14 100%)",
                border: "1px solid #1e1e2e",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                opacity: insightsVisible ? 1 : 0,
                transform: insightsVisible ? "translateY(0)" : "translateY(14px)",
                transition:
                  "opacity 400ms cubic-bezier(0.16,1,0.3,1), transform 400ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.6),transparent)" }} />
              <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.02em", animation: "glow 2s ease-in-out infinite alternate" }}>
                  ✦ AI Insights
                </span>
                <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.15em", color: "#46D369", background: "rgba(70,211,105,0.1)", border: "1px solid rgba(70,211,105,0.25)", padding: "3px 10px", borderRadius: "20px", animation: "blink 2s ease-in-out infinite" }}>
                  LIVE
                </span>
              </div>
              <div style={{ padding: "20px 24px 28px" }}>
                {loading || !insights ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[90, 70, 85, 60].map((w, i) => (
                      <div key={i} style={{ height: "13px", width: `${w}%`, ...shimmer }} />
                    ))}
                  </div>
                ) : (
                  <pre style={{ fontFamily: "'Inter', -apple-system, sans-serif", fontSize: "14px", lineHeight: 1.8, color: "#c4c4d4", whiteSpace: "pre-wrap", margin: 0, fontWeight: 400 }}>
                    {insights}
                  </pre>
                )}
              </div>
            </div>
          </div>
          <div style={{ height: "48px" }} />
        </div>
      </div>
    </>
  );
};

export default Analytics;
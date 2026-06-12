// src/pages/Agent.jsx
import { useState } from "react";
import API from "../api/axios";
import AgentCard from "../components/AgentCard";
import { TailSpin } from "react-loader-spinner";

const Agent = () => {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${time} - ${message}`]);
  };

  const generateCampaign = async () => {
    if (!goal.trim()) return;

    try {
      setLoading(true);
      setResult(null);
      setLogs([]);

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
      const stats = await API.get("/analytics");
      const analytics = await API.post("/ai/analytics", {
        goal,
        stats: stats.data,
      });
      addLog("Analytics Agent Completed");

      addLog("Campaign Generated Successfully");

      setResult({
        planner: planner.data,
        segment: segment.data,
        campaign: campaign.data,
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
    if (!result) return;

    try {
      await API.post("/campaigns", {
        campaignName: "AI Generated Campaign",
        goal,
        planner:
          typeof result.planner === "string"
            ? result.planner
            : JSON.stringify(result.planner),
        segment:
          typeof result.segment === "string"
            ? result.segment
            : JSON.stringify(result.segment),
        campaignContent:
          typeof result.campaign === "string"
            ? result.campaign
            : JSON.stringify(result.campaign),
      });

      alert("Campaign Saved");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            AI Agents
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-xl">
            Orchestrate Planner, Segment, Campaign, and Analytics agents to
            generate complete engagement campaigns from a single goal.
          </p>
        </div>
      </section>

      {/* Goal input + timeline */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Goal + CTA */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-950 to-black border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.9)] p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-100 mb-2">
            Campaign Goal
          </h2>
          <p className="text-[11px] text-slate-400 mb-3">
            Describe what you want the AI to achieve. For example:
            &nbsp;&ldquo;Bring back users inactive for 60+ days&rdquo; or
            &nbsp;&ldquo;Increase upsells from VIP customers&rdquo;.
          </p>
          <textarea
            rows={4}
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70 transition mb-3"
            placeholder="Enter business goal..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={generateCampaign}
              disabled={loading || !goal.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 disabled:text-slate-400 px-4 py-2 text-xs font-semibold text-white shadow-[0_16px_45px_rgba(79,70,229,0.85)] transition-colors duration-150"
            >
              {loading ? "Generating..." : "Generate Campaign"}
            </button>
            {result && (
              <button
                type="button"
                onClick={saveCampaign}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-white shadow-[0_16px_45px_rgba(16,185,129,0.8)] transition-colors duration-150"
              >
                Save Campaign
              </button>
            )}
          </div>
        </div>

        {/* Agent timeline */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-950 to-black border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.9)] p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-100 mb-2">
            Agent Timeline
          </h2>
          <p className="text-[11px] text-slate-400 mb-3">
            Step‑by‑step activity log across Planner → Segment → Campaign →
            Analytics agents.
          </p>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {logs.length === 0 && (
              <p className="text-[11px] text-slate-500">
                No activity yet. Run a campaign to see the agents in action.
              </p>
            )}
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-xl bg-slate-900/70 border border-white/10 px-3 py-2 text-[11px] text-slate-200"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <section className="rounded-2xl bg-gradient-to-r from-indigo-500/15 via-slate-950 to-fuchsia-500/20 border border-indigo-400/40 shadow-[0_24px_80px_rgba(79,70,229,0.9)] p-4 sm:p-5 text-center">
          <div className="flex flex-col items-center gap-3">
            <TailSpin
              height="50"
              width="50"
              color="#6366f1"
              ariaLabel="loading"
            />
            <h3 className="text-sm font-semibold text-slate-50">
              AI Agents Working...
            </h3>
            <p className="text-[11px] text-slate-200">
              Planner → Segment → Campaign → Analytics
            </p>
          </div>
        </section>
      )}

      {/* Agents output grid */}
      {result && !loading && (
        <section className="grid gap-4 lg:grid-cols-2">
          <AgentCard
            title="Planner Agent"
            content={
              typeof result.planner === "string"
                ? result.planner
                : JSON.stringify(result.planner, null, 2)
            }
          />
          <AgentCard
            title="Segment Agent"
            content={
              typeof result.segment === "string"
                ? result.segment
                : JSON.stringify(result.segment, null, 2)
            }
          />
          <AgentCard
            title="Campaign Agent"
            content={
              typeof result.campaign === "string"
                ? result.campaign
                : JSON.stringify(result.campaign, null, 2)
            }
          />
          <AgentCard
            title="Analytics Agent"
            content={
              typeof result.analytics === "string"
                ? result.analytics
                : JSON.stringify(result.analytics, null, 2)
            }
          />
        </section>
      )}
    </div>
  );
};

export default Agent;
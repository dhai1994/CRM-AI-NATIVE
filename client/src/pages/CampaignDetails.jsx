// src/pages/CampaignDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    fetchCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const { data } = await API.get(`/campaigns/${id}`);
      setCampaign(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] text-slate-300 text-sm">
        Loading campaign details...
      </div>
    );
  }

  const getStatusClasses = (status) => {
    if (status === "Sent") {
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/40";
    }
    if (status === "Failed") {
      return "bg-rose-500/15 text-rose-300 border-rose-400/40";
    }
    return "bg-amber-500/15 text-amber-300 border-amber-400/40";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
            Campaign Details
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-xl">
            Full trace of how the AI Planner, Segment, and Campaign agents built
            this engagement.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 text-[11px] border",
              getStatusClasses(campaign.status),
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80 mr-1.5" />
            {campaign.status}
          </span>
        </div>
      </section>

      {/* Campaign meta card */}
      <section className="rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-950 to-black border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.9)] p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              {campaign.campaignName}
            </h2>
            <p className="text-[11px] text-slate-400">
              {campaign.goal || "No explicit goal provided."}
            </p>
          </div>
          {campaign.channel && (
            <span className="mt-1 inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200 border border-white/10">
              Channel: {campaign.channel}
            </span>
          )}
        </div>
      </section>

      {/* AI agents output grid */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Planner agent */}
        <div className="rounded-2xl bg-gradient-to-b from-indigo-500/15 via-slate-950 to-slate-950 border border-indigo-400/40 shadow-[0_22px_60px_rgba(79,70,229,0.9)] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Planner Agent
              </h2>
              <p className="text-[11px] text-slate-200">
                High-level strategy and multi-step plan.
              </p>
            </div>
          </div>
          <pre className="mt-2 max-h-72 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-100/90 bg-black/25 rounded-xl p-3 border border-white/10">
            {campaign.planner || "No planner output stored for this campaign."}
          </pre>
        </div>

        {/* Segment agent */}
        <div className="rounded-2xl bg-gradient-to-b from-emerald-500/15 via-slate-950 to-slate-950 border border-emerald-400/40 shadow-[0_22px_60px_rgba(16,185,129,0.9)] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                Segment Agent
              </h2>
              <p className="text-[11px] text-slate-200">
                Target audience, filters, and cohorts.
              </p>
            </div>
          </div>
          <pre className="mt-2 max-h-72 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-100/90 bg-black/25 rounded-xl p-3 border border-white/10">
            {campaign.segment || "No segment output stored for this campaign."}
          </pre>
        </div>
      </section>

      {/* Campaign content */}
      <section className="rounded-2xl bg-gradient-to-r from-fuchsia-500/15 via-slate-950 to-indigo-500/15 border border-fuchsia-400/40 shadow-[0_24px_80px_rgba(217,70,239,0.9)] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              Campaign Content
            </h2>
            <p className="text-[11px] text-slate-200">
              Final email/SMS copy generated by the Campaign Agent.
            </p>
          </div>
        </div>
        <pre className="mt-2 max-h-[28rem] overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-100/90 bg-black/25 rounded-xl p-3 border border-white/10">
          {campaign.campaignContent ||
            "No campaign content stored for this campaign."}
        </pre>
      </section>
    </div>
  );
};

export default CampaignDetails;
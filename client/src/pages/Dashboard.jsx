// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import StatCard from "../components/StatCard";

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

  return (
    <div className="flex flex-col gap-6">
      {/* Top header like the screenshot */}
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-semibold text-[#e5e7eb]">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-[#262730] bg-[#111318] px-3 py-1.5 text-[11px] text-[#e5e7eb] hover:bg-[#181a20] transition-colors duration-150"
          >
            Last 30 days
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#f9fafb] text-[#030712] text-[11px] font-medium px-3 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:bg-white transition-colors duration-150"
          >
            New Campaign
          </button>
        </div>
      </section>

      {/* Top row: metric tiles similar to screenshot */}
      <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle="All customer profiles in your workspace"
        />
        <StatCard
          title="VIP Customers"
          value={stats.vipCustomers}
          subtitle="High value / loyal customers"
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          subtitle="Total campaign-driven revenue"
        />
        <StatCard
          title="Recent Campaigns"
          value={recentCampaigns.length}
          subtitle="Campaigns created in the last period"
        />
      </section>

      {/* Second row: activity + AI recommendation, like “Agent Activity / Needs attention” */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Activity panel (Recent Customers + Campaigns combined) */}
        <div className="rounded-2xl bg-[#05060a] border border-[#262730] shadow-[0_24px_80px_rgba(0,0,0,0.85)] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-[#e5e7eb]">
                Recent Activity
              </h2>
              <p className="text-[11px] text-[#6b7280]">
                Latest customers and campaigns created in your CRM.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {/* Recent Customers */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#9ca3af] mb-1">
                Recent Customers
              </h3>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {recentCustomers.length === 0 && (
                  <p className="text-[11px] text-[#6b7280]">
                    No recent customers yet. Import a CSV or add manually.
                  </p>
                )}
                {recentCustomers.map((customer) => (
                  <div
                    key={customer._id}
                    className="flex items-center justify-between rounded-xl bg-[#111318] border border-[#262730] px-3 py-2 text-[11px] text-[#e5e7eb]"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {customer.name}
                      </span>
                      {customer.email && (
                        <span className="text-[10px] text-[#6b7280]">
                          {customer.email}
                        </span>
                      )}
                    </div>
                    {customer.segment && (
                      <span className="ml-3 rounded-full bg-[#0b0d13] px-2 py-0.5 text-[10px] text-[#9ca3af] border border-[#262730]">
                        {customer.segment}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Campaigns */}
            <div>
              <h3 className="text-[11px] font-semibold text-[#9ca3af] mb-1">
                Recent Campaigns
              </h3>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {recentCampaigns.length === 0 && (
                  <p className="text-[11px] text-[#6b7280]">
                    No campaigns yet. Generate one from the AI Agents page.
                  </p>
                )}
                {recentCampaigns.map((campaign) => (
                  <div
                    key={campaign._id}
                    className="flex items-center justify-between rounded-xl bg-[#111318] border border-[#262730] px-3 py-2 text-[11px] text-[#e5e7eb]"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {campaign.campaignName}
                      </span>
                      {campaign.status && (
                        <span className="text-[10px] text-[#6b7280]">
                          {campaign.status}
                        </span>
                      )}
                    </div>
                    {campaign.channel && (
                      <span className="ml-3 rounded-full bg-[#0b0d13] px-2 py-0.5 text-[10px] text-[#9ca3af] border border-[#262730]">
                        {campaign.channel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendation panel */}
        <div className="rounded-2xl bg-[#05060a] border border-[#262730] shadow-[0_24px_80px_rgba(0,0,0,0.85)] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-[#e5e7eb]">
                AI Recommendation
              </h2>
              <p className="text-[11px] text-[#6b7280]">
                Items and strategies your AI agents think need attention.
              </p>
            </div>
          </div>
          <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-relaxed text-[#e5e7eb] bg-[#0b0d13] rounded-xl p-3 border border-[#262730] max-h-64 overflow-y-auto">
            {recommendation || "AI has not generated a recommendation yet."}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
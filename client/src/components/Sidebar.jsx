// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiUser3Line,
  RiMailSendLine,
  RiBarChart2Line,
  RiRobot2Line,
} from "react-icons/ri";

const Sidebar = () => {
  const [openMobile, setOpenMobile] = useState(false);

  const navLinkBase =
    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 border border-white/[0.03] text-slate-400 hover:text-slate-50 hover:bg-white/5 hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[0_0_28px_rgba(79,70,229,0.7)]";

  const getNavClass = ({ isActive }) =>
    isActive
      ? `${navLinkBase} bg-white/[0.06] text-slate-50 shadow-[0_0_32px_rgba(79,70,229,0.75)] border-white/10`
      : navLinkBase;

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/75 text-slate-100 border border-white/10 shadow-lg backdrop-blur-xl"
        onClick={() => setOpenMobile((prev) => !prev)}
      >
        <span className="block h-[2px] w-5 bg-slate-100 rounded-full relative">
          <span className="absolute -top-2 h-[2px] w-5 bg-slate-100 rounded-full" />
          <span className="absolute top-2 h-[2px] w-5 bg-slate-100 rounded-full" />
        </span>
      </button>

      {/* Sidebar container */}
      <aside
        className={[
          "fixed z-30 flex h-screen w-60 flex-col",
          "bg-gradient-to-b from-black/90 via-slate-950/95 to-black/95",
          "border-r border-white/10 backdrop-blur-2xl",
          "shadow-[0_18px_45px_rgba(0,0,0,0.9)]",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          openMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo / brand */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-[0_0_34px_rgba(129,140,248,0.8)]">
            <span className="text-lg font-black tracking-tight">AI</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              AI CRM
            </span>
            <span className="text-[11px] text-slate-400">
              Campaign · Segments · Insights
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <nav className="mt-3 flex flex-col gap-3">
            <div>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Overview
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <NavLink to="/dashboard" className={getNavClass}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors duration-200">
                    <RiDashboardLine className="text-lg" />
                  </div>
                  <span>Dashboard</span>
                </NavLink>

                <NavLink to="/customers" className={getNavClass}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors duration-200">
                    <RiUser3Line className="text-lg" />
                  </div>
                  <span>Customers</span>
                </NavLink>

                <NavLink to="/agent" className={getNavClass}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors duration-200">
                    <RiRobot2Line className="text-lg" />
                  </div>
                  <span>AI Agent</span>
                </NavLink>

                <NavLink to="/campaigns" className={getNavClass}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors duration-200">
                    <RiMailSendLine className="text-lg" />
                  </div>
                  <span>Campaigns</span>
                </NavLink>

                <NavLink to="/analytics" className={getNavClass}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors duration-200">
                    <RiBarChart2Line className="text-lg" />
                  </div>
                  <span>Analytics</span>
                </NavLink>
              </div>
            </div>

            {/* CTA card inspired by Uber action cards + Netflix highlight */}
            <div className="mt-4">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Quick Action
              </p>
              <button
                type="button"
                className="group mt-2 flex w-full flex-col gap-1 rounded-2xl border border-emerald-400/25 bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-emerald-400/25 px-4 py-3 text-left text-sm text-emerald-50 shadow-[0_22px_45px_rgba(16,185,129,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(16,185,129,0.7)]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                  New Campaign
                </span>
                <span className="text-[11px] text-emerald-50/85">
                  Let AI plan, segment & write high-performing emails.
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer / profile */}
        <div className="border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-between rounded-xl px-2 py-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold">
                DR
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-medium text-slate-100">
                  DHAIRYA RATHORE
                </span>
                <span className="text-[10px] text-slate-400">
                  Admin · AI Native CRM
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10">
              Online
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
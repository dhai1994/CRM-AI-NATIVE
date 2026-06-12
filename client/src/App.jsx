// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Agent from "./pages/Agent";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import CampaignDetails from "./pages/CampaignDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white">
      {/* Layout: sidebar + main content */}
      <div className="flex min-h-screen">
        {/* Sidebar is shared across protected pages – but keep login/register clean */}
        <Sidebar />

        {/* Main area shifts right of sidebar on desktop */}
        <div className="flex-1 flex flex-col lg:pl-60">
          {/* Background shell similar to SaaS / streaming apps */}
          <div className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes – keep exactly as before */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PageShell>
                      <Dashboard />
                    </PageShell>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <PageShell>
                      <Customers />
                    </PageShell>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/agent"
                element={
                  <ProtectedRoute>
                    <PageShell>
                      <Agent />
                    </PageShell>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/campaign/:id"
                element={
                  <ProtectedRoute>
                    <PageShell>
                      <CampaignDetails />
                    </PageShell>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <PageShell>
                      <Campaigns />
                    </PageShell>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <PageShell>
                      <Analytics />
                    </PageShell>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PageShell wraps each protected page inside a Netflix/Uber-style
 * glass card with padding, border, shadows, and subtle blur.
 */
const PageShell = ({ children }) => {
  return (
    <main className="min-h-screen px-4 pb-6 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <div className="h-full rounded-3xl bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-black border border-white/10 shadow-[0_24px_80px_rgba(15,23,42,0.95)] backdrop-blur-2xl overflow-hidden">
        <div className="h-full p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </main>
  );
};

export default App;
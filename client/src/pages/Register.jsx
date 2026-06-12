// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 sm:px-12 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-500 shadow-[0_0_32px_rgba(248,113,113,0.8)]">
            <span className="text-lg font-black tracking-tight">AI</span>
          </div>
          <span className="text-sm font-semibold tracking-wider uppercase text-slate-100">
            AI Native CRM
          </span>
        </div>

        <Link
          to="/"
          className="text-xs font-medium rounded-full border border-white/30 px-4 py-1.5 bg-white/5 hover:bg-white/15 transition-colors duration-150"
        >
          Sign in
        </Link>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Hero text */}
          <section className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Create your{" "}
              <span className="bg-gradient-to-r from-red-500 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                AI CRM workspace
              </span>
              .
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-md">
              Onboard in minutes and let the AI agents plan, segment, write, and
              analyze all your customer engagement campaigns.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1">
              <li>• Unlimited campaigns for early users</li>
              <li>• AI planner, segmenter, and analytics included</li>
              <li>• Secure authentication and MongoDB storage</li>
            </ul>
          </section>

          {/* Auth card */}
          <section className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-1">Create an account</h2>
            <p className="text-xs text-slate-400 mb-6">
              We&apos;ll use this to configure your AI CRM workspace.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-slate-200"
                >
                  Name
                </label>
                <input
                  id="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/60 transition duration-150"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/60 transition duration-150"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:border-red-500/60 transition duration-150"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold py-2.5 shadow-[0_16px_45px_rgba(220,38,38,0.8)] transition-colors duration-150"
              >
                Register
              </button>
            </form>

            <p className="mt-4 text-[11px] text-slate-400 text-center">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-red-400 hover:text-red-300 underline-offset-2 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Register;
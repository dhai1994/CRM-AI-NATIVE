// src/pages/Customers.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    totalSpent: "",
    totalOrders: "",
    segment: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await API.get("/customers");
      setCustomers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addCustomer = async (e) => {
    e.preventDefault();

    try {
      await API.post("/customers", form);

      setForm({
        name: "",
        email: "",
        phone: "",
        totalSpent: "",
        totalOrders: "",
        segment: "",
      });

      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await API.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadCSV = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/csv/upload", formData);
      alert("CSV Uploaded");
      fetchCustomers();
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
            Customers
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-xl">
            Manage your customer profiles, import CSVs, and keep segments ready
            for the AI agents to target.
          </p>
        </div>
      </section>

      {/* Top grid: form + CSV upload */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Add customer form */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-950 to-black border border-white/10 shadow-[0_18px_55px_rgba(15,23,42,0.9)] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Add Customer
              </h2>
              <p className="text-[11px] text-slate-400">
                Manually create a new customer profile.
              </p>
            </div>
          </div>

          <form onSubmit={addCustomer} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                Name
              </label>
              <input
                placeholder="John Doe"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                Email
              </label>
              <input
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition"
                type="email"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                Phone
              </label>
              <input
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                Total Spent
              </label>
              <input
                placeholder="e.g. 12000"
                value={form.totalSpent}
                onChange={(e) =>
                  setForm({ ...form, totalSpent: e.target.value })
                }
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                Total Orders
              </label>
              <input
                placeholder="e.g. 5"
                value={form.totalOrders}
                onChange={(e) =>
                  setForm({ ...form, totalOrders: e.target.value })
                }
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                Segment
              </label>
              <input
                placeholder="VIP, Inactive 60+ days, etc."
                value={form.segment}
                onChange={(e) =>
                  setForm({ ...form, segment: e.target.value })
                }
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center rounded-xl bg-indigo-500 hover:bg-indigo-400 px-4 py-2 text-xs font-semibold text-white shadow-[0_16px_45px_rgba(79,70,229,0.85)] transition-colors duration-150"
              >
                Add Customer
              </button>
            </div>
          </form>
        </div>

        {/* CSV upload card */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-950 to-black border border-white/10 shadow-[0_18px_55px_rgba(15,23,42,0.9)] p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-100 mb-1">
            CSV Upload
          </h2>
          <p className="text-[11px] text-slate-400 mb-4">
            Import customers in bulk from your CRM export or marketing tools.
          </p>
          <div className="space-y-3">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-[11px] text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-white/20 cursor-pointer"
            />
            <button
              type="button"
              onClick={uploadCSV}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-white shadow-[0_16px_45px_rgba(16,185,129,0.8)] transition-colors duration-150"
            >
              Upload CSV
            </button>
            <p className="text-[10px] text-slate-500">
              Expected columns: name, email, phone, totalSpent, totalOrders, segment.
            </p>
          </div>
        </div>
      </section>

      {/* Customers table */}
      <section className="rounded-2xl bg-gradient-to-b from-slate-900/85 via-slate-950 to-black border border-white/10 shadow-[0_22px_70px_rgba(15,23,42,0.9)] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Customer List
            </h2>
            <p className="text-[11px] text-slate-400">
              {customers.length} customers in your workspace.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border-separate border-spacing-y-1">
            <thead>
              <tr className="text-[11px] text-slate-400">
                <th className="text-left px-3 py-2 font-medium">Name</th>
                <th className="text-left px-3 py-2 font-medium">Email</th>
                <th className="text-right px-3 py-2 font-medium">Spent</th>
                <th className="text-right px-3 py-2 font-medium">Orders</th>
                <th className="text-left px-3 py-2 font-medium">Segment</th>
                <th className="text-right px-3 py-2 font-medium">Delete</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-[11px] text-slate-500"
                  >
                    No customers yet. Add one manually or upload a CSV.
                  </td>
                </tr>
              )}

              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-3 py-2">
                    <div className="rounded-xl bg-slate-900/70 border border-white/10 px-3 py-2 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-semibold text-white">
                        {customer.name?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-100">
                          {customer.name}
                        </span>
                        {customer.phone && (
                          <span className="text-[10px] text-slate-400">
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-2 align-top text-xs text-slate-200">
                    {customer.email || "-"}
                  </td>

                  <td className="px-3 py-2 align-top text-right text-xs text-slate-200">
                    {customer.totalSpent ?? "-"}
                  </td>

                  <td className="px-3 py-2 align-top text-right text-xs text-slate-200">
                    {customer.totalOrders ?? "-"}
                  </td>

                  <td className="px-3 py-2 align-top text-xs text-slate-200">
                    {customer.segment ? (
                      <span className="inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200 border border-white/10">
                        {customer.segment}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-3 py-2 align-top text-right">
                    <button
                      type="button"
                      onClick={() => deleteCustomer(customer._id)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Customers;
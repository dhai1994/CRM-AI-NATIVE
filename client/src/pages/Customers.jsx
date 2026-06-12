import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

/* ═══════════════════════════════════════════════════════════════
   SEGMENT BADGE
═══════════════════════════════════════════════════════════════ */
function SegmentBadge({ segment }) {
  const map = {
    vip:      { bg: "rgba(245,166,35,0.12)",  color: "#F5A623", label: "VIP"      },
    high:     { bg: "rgba(70,211,105,0.12)",   color: "#46D369", label: "High"     },
    medium:   { bg: "rgba(59,130,246,0.12)",   color: "#60A5FA", label: "Medium"   },
    low:      { bg: "rgba(156,163,175,0.12)",  color: "#9CA3AF", label: "Low"      },
    new:      { bg: "rgba(167,139,250,0.12)",  color: "#A78BFA", label: "New"      },
  };
  const key = (segment || "").toLowerCase();
  const style = map[key] || { bg: "rgba(255,255,255,0.06)", color: "#888", label: segment || "—" };

  return (
    <span style={{
      background: style.bg,
      color: style.color,
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "4px 10px",
      borderRadius: "20px",
      border: `1px solid ${style.color}33`,
    }}>
      {style.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INPUT FIELD
═══════════════════════════════════════════════════════════════ */
function Field({ label, placeholder, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: "block", fontSize: "11px", fontWeight: 600,
        color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px",
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", background: "#141414",
          border: `1px solid ${focused ? "#E50914" : "#2a2a2a"}`,
          borderRadius: "10px", padding: "12px 14px",
          fontSize: "14px", color: "#e8e8e8", outline: "none",
          transition: "border-color 200ms ease, box-shadow 200ms ease",
          boxShadow: focused ? "0 0 0 3px rgba(229,9,20,0.1)" : "none",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOMERS PAGE
═══════════════════════════════════════════════════════════════ */
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", totalSpent: "", totalOrders: "", segment: "",
  });

  useEffect(() => { fetchCustomers(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await API.get("/customers");
      setCustomers(data);
    } catch (error) { console.log(error); }
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await API.post("/customers", form);
      setForm({ name: "", email: "", phone: "", totalSpent: "", totalOrders: "", segment: "" });
      setShowForm(false);
      fetchCustomers();
      showToast("Customer added successfully");
    } catch (error) {
      console.log(error);
      showToast("Failed to add customer", "error");
    } finally { setAdding(false); }
  };

  const deleteCustomer = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/customers/${id}`);
      fetchCustomers();
      showToast("Customer removed");
    } catch (error) {
      console.log(error);
      showToast("Delete failed", "error");
    } finally { setDeletingId(null); }
  };

  const uploadCSV = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await API.post("/csv/upload", formData);
      showToast("CSV uploaded successfully");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchCustomers();
    } catch (error) {
      console.log(error);
      showToast("CSV upload failed", "error");
    } finally { setUploading(false); }
  };

  const filtered = customers.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.segment || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        .cust-row:hover { background: #161616 !important; }
        .del-btn:hover { background: rgba(229,9,20,0.15) !important; color: #E50914 !important; border-color: rgba(229,9,20,0.3) !important; }
        .add-btn-main:hover:not(:disabled) { background: #ff1a1a !important; transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(229,9,20,0.4) !important; }
        .upload-btn:hover:not(:disabled) { background: #1a4fd6 !important; transform: translateY(-2px) !important; }
        .toggle-form-btn:hover { background: #1f1f1f !important; }
        input[type="file"]::file-selector-button {
          background: #1f1f1f; border: 1px solid #2a2a2a; color: #888;
          padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;
          font-family: inherit; transition: background 150ms ease;
        }
        input[type="file"]::file-selector-button:hover { background: #2a2a2a; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
      `}</style>

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{
          flex: 1, background: "#0a0a0a", color: "#e8e8e8", minHeight: "100vh",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden",
        }}>

          {/* ── Toast ── */}
          {toast && (
            <div style={{
              position: "fixed", top: "24px", right: "24px", zIndex: 9999,
              background: toast.type === "error" ? "#1a0505" : "#0a1a0a",
              border: `1px solid ${toast.type === "error" ? "rgba(229,9,20,0.3)" : "rgba(70,211,105,0.3)"}`,
              color: toast.type === "error" ? "#ff6b6b" : "#46D369",
              padding: "14px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: 600,
              animation: "toastIn 0.3s ease both", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", gap: "8px", maxWidth: "320px",
            }}>
              <span>{toast.type === "error" ? "⚠" : "✓"}</span>
              {toast.msg}
            </div>
          )}

          {/* ── Hero ── */}
          <div style={{
            position: "relative", padding: "48px 40px 40px",
            background: "linear-gradient(135deg,#141414 0%,#1a0a0a 50%,#0a0a0a 100%)",
            borderBottom: "1px solid #1f1f1f", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 80% 50%,rgba(229,9,20,0.08) 0%,transparent 60%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#E50914", margin: "0 0 6px" }}>
                  CRM
                </p>
                <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", margin: "0 0 8px" }}>
                  Customers
                </h1>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                  {customers.length} total customer{customers.length !== 1 ? "s" : ""} in your database
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="toggle-form-btn"
                  onClick={() => setShowForm(!showForm)}
                  style={{
                    background: showForm ? "#1f1f1f" : "#E50914",
                    border: `1px solid ${showForm ? "#2a2a2a" : "#E50914"}`,
                    color: "#fff", borderRadius: "10px", padding: "11px 20px",
                    fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    transition: "all 200ms ease", display: "flex", alignItems: "center", gap: "8px",
                  }}
                >
                  {showForm ? "✕ Cancel" : "+ Add Customer"}
                </button>
              </div>
            </div>
          </div>

          <div style={{ padding: "32px 40px", display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* ── Add Customer Form ── */}
            {showForm && (
              <div style={{
                background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: "16px",
                padding: "28px", animation: "fadeUp 0.3s ease both",
              }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#e8e8e8", margin: "0 0 20px", letterSpacing: "-0.01em" }}>
                  Add New Customer
                </h2>
                <form onSubmit={addCustomer}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "14px", marginBottom: "20px" }}>
                    <Field label="Name" placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <Field label="Email" placeholder="jane@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
                    <Field label="Phone" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <Field label="Total Spent (₹)" placeholder="25000" value={form.totalSpent} onChange={(e) => setForm({ ...form, totalSpent: e.target.value })} />
                    <Field label="Total Orders" placeholder="12" value={form.totalOrders} onChange={(e) => setForm({ ...form, totalOrders: e.target.value })} />
                    <Field label="Segment" placeholder="VIP / High / Medium / Low" value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} />
                  </div>
                  <button
                    type="submit"
                    className="add-btn-main"
                    disabled={adding}
                    style={{
                      background: adding ? "#333" : "#E50914", color: "#fff", border: "none",
                      borderRadius: "10px", padding: "12px 28px", fontSize: "13px", fontWeight: 700,
                      cursor: adding ? "not-allowed" : "pointer", transition: "all 220ms cubic-bezier(0.16,1,0.3,1)",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}
                  >
                    {adding ? (
                      <>
                        <span style={{ width: "14px", height: "14px", border: "2px solid #555", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                        Adding…
                      </>
                    ) : "Add Customer"}
                  </button>
                </form>
              </div>
            )}

            {/* ── CSV Upload ── */}
            <div style={{
              background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "24px",
            }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8e8", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>📂</span> Bulk Import via CSV
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{
                    fontSize: "13px", color: "#888", background: "#141414",
                    border: "1px solid #2a2a2a", borderRadius: "10px", padding: "10px 14px", cursor: "pointer",
                  }}
                />
                {file && (
                  <span style={{ fontSize: "12px", color: "#46D369", fontWeight: 600 }}>
                    ✓ {file.name}
                  </span>
                )}
                <button
                  className="upload-btn"
                  onClick={uploadCSV}
                  disabled={!file || uploading}
                  style={{
                    background: !file || uploading ? "#1a1a1a" : "#2563EB", color: !file || uploading ? "#555" : "#fff",
                    border: `1px solid ${!file || uploading ? "#2a2a2a" : "#2563EB"}`,
                    borderRadius: "10px", padding: "11px 22px", fontSize: "13px", fontWeight: 700,
                    cursor: !file || uploading ? "not-allowed" : "pointer", transition: "all 220ms ease",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                >
                  {uploading ? (
                    <>
                      <span style={{ width: "14px", height: "14px", border: "2px solid #555", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                      Uploading…
                    </>
                  ) : "Upload CSV"}
                </button>
              </div>
            </div>

            {/* ── Search + Table ── */}
            <div style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: "16px", overflow: "hidden" }}>
              {/* Table header bar */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8e8", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>👥</span> Customer List
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#555", background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "2px 10px", borderRadius: "20px" }}>
                    {filtered.length}
                  </span>
                </h2>
                {/* Search */}
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", color: "#555" }}>🔍</span>
                  <input
                    placeholder="Search customers…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      background: "#141414", border: "1px solid #2a2a2a", borderRadius: "10px",
                      padding: "10px 14px 10px 36px", fontSize: "13px", color: "#e8e8e8",
                      outline: "none", width: "220px", transition: "border-color 200ms ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#E50914")}
                    onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                  />
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                      {["Name", "Email", "Phone", "Spent", "Orders", "Segment", "Action"].map((h) => (
                        <th key={h} style={{
                          padding: "12px 16px", textAlign: "left", fontSize: "11px",
                          fontWeight: 700, color: "#555", letterSpacing: "0.08em",
                          textTransform: "uppercase", whiteSpace: "nowrap",
                          background: "#0f0f0f",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#444", fontSize: "14px" }}>
                          <div style={{ fontSize: "32px", marginBottom: "12px" }}>👤</div>
                          {search ? "No customers match your search" : "No customers yet — add your first one above"}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((customer, i) => (
                        <tr
                          key={customer._id}
                          className="cust-row"
                          style={{
                            borderBottom: "1px solid #141414",
                            transition: "background 150ms ease",
                            animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
                          }}
                        >
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{
                                width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                                background: `hsl(${(customer.name || "").charCodeAt(0) * 15},60%,35%)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "12px", fontWeight: 700, color: "#fff",
                              }}>
                                {(customer.name || "?")[0].toUpperCase()}
                              </div>
                              <span style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8e8" }}>
                                {customer.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>{customer.email}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>{customer.phone || "—"}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 700, color: "#46D369", fontVariantNumeric: "tabular-nums" }}>
                            {customer.totalSpent ? `₹${Number(customer.totalSpent).toLocaleString("en-IN")}` : "—"}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888", fontVariantNumeric: "tabular-nums" }}>{customer.totalOrders || "—"}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <SegmentBadge segment={customer.segment} />
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <button
                              className="del-btn"
                              onClick={() => deleteCustomer(customer._id)}
                              disabled={deletingId === customer._id}
                              style={{
                                background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a2a",
                                color: "#666", borderRadius: "8px", padding: "7px 14px",
                                fontSize: "12px", fontWeight: 600, cursor: "pointer",
                                transition: "all 180ms ease", display: "flex", alignItems: "center", gap: "6px",
                              }}
                            >
                              {deletingId === customer._id ? (
                                <span style={{ width: "12px", height: "12px", border: "2px solid #444", borderTopColor: "#E50914", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                              ) : "✕ Delete"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
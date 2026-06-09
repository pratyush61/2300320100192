// src/pages/SetupPage.jsx
import React, { useState } from "react";
import { register, authenticate } from "../services/api";
import { setAuthToken } from "../middleware/logger";
import Log from "../middleware/logger";
import { useNavigate } from "react-router-dom";

const SetupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(2);
  const [form, setForm] = useState({
    email: "",
    name: "",
    mobileNo: "",
    githubUsername: "",
    rollNo: "",
    accessCode: "",
    clientID: "a821d8a2-db97-4b83-994a-54be3b4591e8",
    clientSecret: "UntbXBuAFbQXAFJD",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await register({
        email: form.email, name: form.name, mobileNo: form.mobileNo,
        githubUsername: form.githubUsername, rollNo: form.rollNo, accessCode: form.accessCode,
      });
      setForm({ ...form, clientID: res.clientID, clientSecret: res.clientSecret });
      setStatus(`✅ Registered! clientID: ${res.clientID}`);
      setStep(2);
    } catch (err) {
      setStatus("❌ Registration failed: " + (err.response?.data?.message ?? err.message));
    } finally { setLoading(false); }
  };

  const handleAuth = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await authenticate({
        email: form.email, name: form.name, rollNo: form.rollNo,
        accessCode: form.accessCode, clientID: form.clientID, clientSecret: form.clientSecret,
      });
      const token = res.access_token;
      localStorage.setItem("access_token", token);
      setAuthToken(token);
      Log("frontend", "info", "page", "Authentication successful");
      setStatus("✅ Auth successful! Token saved.");
      setStep(3);
      setTimeout(() => navigate("/notifications"), 1500);
    } catch (err) {
      Log("frontend", "error", "api", "Authentication failed");
      setStatus("❌ Auth failed: " + (err.response?.data?.message ?? err.message));
    } finally { setLoading(false); }
  };

  const inp = { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #D1D5DB", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" };
  const btn = { width: "100%", padding: "12px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "15px", cursor: "pointer" };

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "36px", width: "100%", maxWidth: "480px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 800, color: "#111827" }}>🎓 Campus Notifications</h1>
        <p style={{ margin: "0 0 28px", color: "#6B7280", fontSize: "14px" }}>Pre-Test Setup — Step {step} of 2</p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {["Register", "Authenticate"].map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "8px", borderRadius: "8px", textAlign: "center", fontWeight: 700, fontSize: "13px", background: step > i+1 ? "#ECFDF5" : step === i+1 ? "#EEF2FF" : "#F9FAFB", color: step > i+1 ? "#059669" : step === i+1 ? "#4F46E5" : "#9CA3AF" }}>
              {step > i+1 ? "✓ " : ""}{s}
            </div>
          ))}
        </div>

        {step === 2 && (
          <>
            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Step 2: Authenticate</h2>
            <input name="email" placeholder="email" value={form.email} onChange={update} style={inp} />
            <input name="name" placeholder="name" value={form.name} onChange={update} style={inp} />
            <input name="rollNo" placeholder="rollNo" value={form.rollNo} onChange={update} style={inp} />
            <input name="accessCode" placeholder="accessCode" value={form.accessCode} onChange={update} style={inp} />
            <label style={{ fontSize: "12px", color: "#6B7280" }}>clientID (auto-filled)</label>
            <input name="clientID" value={form.clientID} onChange={update} style={inp} />
            <label style={{ fontSize: "12px", color: "#6B7280" }}>clientSecret (auto-filled)</label>
            <input name="clientSecret" value={form.clientSecret} onChange={update} style={inp} />
            <button style={btn} onClick={handleAuth} disabled={loading}>{loading ? "Authenticating..." : "Get Token →"}</button>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "48px" }}>✅</div>
            <p style={{ fontWeight: 700, color: "#059669" }}>All set! Redirecting…</p>
          </div>
        )}

        {status && (
          <div style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", background: status.startsWith("✅") ? "#ECFDF5" : "#FEF2F2", color: status.startsWith("✅") ? "#065F46" : "#991B1B", fontSize: "13px", fontWeight: 600 }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupPage;
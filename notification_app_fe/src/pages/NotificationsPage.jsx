// src/pages/NotificationsPage.jsx
import React, { useEffect, useState } from "react";
import useNotifications from "../hooks/useNotifications";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import Log from "../middleware/logger";

const NotificationsPage = () => {
  const {
    notifications,
    loading,
    error,
    filter,
    page,
    totalPages,
    changeFilter,
    changePage,
    reload,
  } = useNotifications();

  // Track read notifications in local state
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem("read_ids");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    Log("frontend", "info", "page", "Notifications page opened");
  }, []);

  const markRead = (id) => {
    const updated = new Set(readIds);
    updated.add(id);
    setReadIds(updated);
    localStorage.setItem("read_ids", JSON.stringify([...updated]));
    Log("frontend", "info", "component", `Notification ${id} marked as read`);
  };

  const newNotifications  = notifications.filter((n) => !readIds.has(n.id));
  const readNotifications = notifications.filter((n) => readIds.has(n.id));

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "16px 0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#111827" }}>🎓 Campus Notifications</h1>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6B7280" }}>
              {newNotifications.length} new • {notifications.length} total
            </p>
          </div>
          <button
            onClick={reload}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "2px solid #E5E7EB", background: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
          >
            ↻ Refresh
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 20px" }}>
        {/* Filter Bar */}
        <FilterBar active={filter} onChange={changeFilter} />

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7280" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            Loading notifications…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "12px", padding: "20px", textAlign: "center", color: "#991B1B" }}>
            <div style={{ fontSize: "28px" }}>⚠️</div>
            <p style={{ margin: "8px 0 16px", fontWeight: 600 }}>{error}</p>
            <button onClick={reload} style={{ padding: "8px 20px", background: "#DC2626", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
              Retry
            </button>
          </div>
        )}

        {/* Notifications list */}
        {!loading && !error && notifications.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
            <div style={{ fontSize: "40px" }}>📭</div>
            <p style={{ fontWeight: 600, marginTop: "12px" }}>No notifications found</p>
          </div>
        )}

        {!loading && !error && newNotifications.length > 0 && (
          <>
            <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#4F46E5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px" }}>
              🔵 New ({newNotifications.length})
            </h2>
            {newNotifications.map((n) => (
              <NotificationCard key={n.id} notification={n} isRead={false} onMarkRead={markRead} />
            ))}
          </>
        )}

        {!loading && !error && readNotifications.length > 0 && (
          <>
            <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase", margin: "24px 0 12px" }}>
              ✓ Read ({readNotifications.length})
            </h2>
            {readNotifications.map((n) => (
              <NotificationCard key={n.id} notification={n} isRead={true} onMarkRead={markRead} />
            ))}
          </>
        )}

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onChange={changePage} />
      </main>
    </div>
  );
};

export default NotificationsPage;

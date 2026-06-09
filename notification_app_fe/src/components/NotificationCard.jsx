// src/components/NotificationCard.jsx
import React from "react";

const TYPE_COLORS = {
  Event:     { bg: "#EFF6FF", border: "#3B82F6", badge: "#1D4ED8" },
  Alert:     { bg: "#FFF7ED", border: "#F97316", badge: "#C2410C" },
  Placement: { bg: "#F0FDF4", border: "#22C55E", badge: "#15803D" },
  default:   { bg: "#F9FAFB", border: "#9CA3AF", badge: "#374151" },
};

const formatDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const NotificationCard = ({ notification, isRead, onMarkRead }) => {
  const id        = notification.ID        ?? notification.id;
const type      = notification.Type      ?? notification.type;
const message   = notification.Message   ?? notification.message;
const timestamp = notification.Timestamp ?? notification.timestamp;
  const colors = TYPE_COLORS[type] ?? TYPE_COLORS.default;

  return (
    <div
      style={{
        background: colors.bg,
        border: `1.5px solid ${colors.border}`,
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        opacity: isRead ? 0.65 : 1,
        transition: "opacity 0.2s",
        cursor: "pointer",
        boxShadow: isRead ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
      }}
      onClick={() => onMarkRead && onMarkRead(id)}
    >
      {/* Unread dot */}
      {!isRead && (
        <span
          style={{
            minWidth: "10px",
            height: "10px",
            borderRadius: "50%",
            background: colors.badge,
            marginTop: "5px",
          }}
        />
      )}

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              background: colors.badge,
              color: "#fff",
              padding: "2px 10px",
              borderRadius: "20px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {type ?? "General"}
          </span>
          {isRead && (
            <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Read</span>
          )}
        </div>

        <p style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 500, color: "#111827", lineHeight: 1.5 }}>
          {message}
        </p>

        <span style={{ fontSize: "12px", color: "#6B7280" }}>
          {formatDate(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default NotificationCard;

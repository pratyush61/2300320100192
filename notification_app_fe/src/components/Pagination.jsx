// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        style={btnStyle(page === 1)}
      >
        ← Prev
      </button>

      <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        style={btnStyle(page === totalPages)}
      >
        Next →
      </button>
    </div>
  );
};

const btnStyle = (disabled) => ({
  padding: "8px 18px",
  borderRadius: "8px",
  border: "2px solid #E5E7EB",
  background: disabled ? "#F9FAFB" : "#fff",
  color: disabled ? "#9CA3AF" : "#374151",
  fontWeight: 600,
  fontSize: "13px",
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "all 0.15s",
});

export default Pagination;

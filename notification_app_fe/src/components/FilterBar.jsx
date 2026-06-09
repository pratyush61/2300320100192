// src/components/FilterBar.jsx
import React from "react";

const FILTERS = [
  { label: "All",       value: "all"       },
  { label: "Events",    value: "Event"     },
  { label: "Alerts",    value: "Alert"     },
  { label: "Placement", value: "Placement" },
];

const FilterBar = ({ active, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginBottom: "20px",
    }}
  >
    {FILTERS.map((f) => (
      <button
        key={f.value}
        onClick={() => onChange(f.value)}
        style={{
          padding: "8px 18px",
          borderRadius: "24px",
          border: active === f.value ? "2px solid #4F46E5" : "2px solid #E5E7EB",
          background: active === f.value ? "#4F46E5" : "#fff",
          color: active === f.value ? "#fff" : "#374151",
          fontWeight: 600,
          fontSize: "13px",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        {f.label}
      </button>
    ))}
  </div>
);

export default FilterBar;

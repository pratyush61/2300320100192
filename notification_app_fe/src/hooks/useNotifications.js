// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../services/api";
import Log from "../middleware/logger";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [filter, setFilter]               = useState("all");
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);

  const LIMIT = 10;

  const load = useCallback(async () => {
    Log("frontend", "debug", "hook", `useNotifications called — filter:${filter} page:${page}`);
    setLoading(true);
    setError(null);

    const params = { page, limit: LIMIT };
    if (filter !== "all") params.notification_type = filter;

    try {
      const data = await fetchNotifications(params);
      // Support both { notifications: [] } and plain array responses
      const list = Array.isArray(data) ? data : (data.notifications ?? data.data ?? []);
      const total = data.totalPages ?? data.total_pages ?? 1;
      setNotifications(list);
      setTotalPages(total);
      Log("frontend", "info", "api", `Fetched ${list.length} notifications`);
    } catch (err) {
      setError("Failed to load notifications.");
      Log("frontend", "error", "api", `Notification fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  const changeFilter = (f) => {
    Log("frontend", "info", "state", `Filter changed to: ${f}`);
    setFilter(f);
    setPage(1);
  };

  const changePage = (p) => {
    Log("frontend", "info", "state", `Page changed to: ${p}`);
    setPage(p);
  };

  return {
    notifications,
    loading,
    error,
    filter,
    page,
    totalPages,
    changeFilter,
    changePage,
    reload: load,
  };
};

export default useNotifications;

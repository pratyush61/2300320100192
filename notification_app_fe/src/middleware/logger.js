// ============================================================
// Logging Middleware  — src/middleware/logger.js
// ============================================================

const BASE_URL = "http://4.224.186.213";

let accessToken = null;

export const setAuthToken = (token) => {
  accessToken = token;
};

const Log = async (stack, level, pkg, message) => {
  console.log(`[${stack.toUpperCase()}][${level.toUpperCase()}][${pkg}] ${message}`);

  if (!accessToken) return;

  try {
    await fetch(`${BASE_URL}/evaluation-service/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (err) {
    console.error("[Logger] Send failed:", err.message);
  }
};

export default Log;

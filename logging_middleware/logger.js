// ============================================================
// Logging Middleware
// Usage: Log(stack, level, package, message)
// ============================================================

const BASE_URL = "http://4.224.186.213";

let accessToken = null;

/**
 * Set the access token for authenticated log calls.
 * Call this after you get the token from /evaluation-service/auth
 */
export const setAuthToken = (token) => {
  accessToken = token;
};

/**
 * Log(stack, level, pkg, message)
 *
 * @param {"frontend"|"backend"} stack
 * @param {"debug"|"info"|"warn"|"error"|"fatal"} level
 * @param {"api"|"component"|"hook"|"page"|"state"|"style"} pkg
 * @param {string} message
 */
const Log = async (stack, level, pkg, message) => {
  const VALID_STACKS = ["frontend", "backend"];
  const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
  const VALID_PACKAGES = ["api", "component", "hook", "page", "state", "style"];

  // Validation
  if (!VALID_STACKS.includes(stack)) {
    console.error(`[Logger] Invalid stack: ${stack}`);
    return;
  }
  if (!VALID_LEVELS.includes(level)) {
    console.error(`[Logger] Invalid level: ${level}`);
    return;
  }
  if (!VALID_PACKAGES.includes(pkg)) {
    console.error(`[Logger] Invalid package: ${pkg}`);
    return;
  }

  // Always log to console too
  console.log(`[${stack.toUpperCase()}][${level.toUpperCase()}][${pkg}] ${message}`);

  if (!accessToken) {
    console.warn("[Logger] No access token set. Call setAuthToken(token) first.");
    return;
  }

  try {
    await fetch(`${BASE_URL}/evaluation-service/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch (err) {
    console.error("[Logger] Failed to send log:", err.message);
  }
};

export default Log;

/**
 * Base URL for the backend API server.
 *
 * - Local dev: falls back to http://localhost:4000 (the api-server default port).
 * - Production: set VITE_API_URL at build time to the deployed API origin,
 *   e.g. VITE_API_URL=https://api.truecleankc.com
 */
export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

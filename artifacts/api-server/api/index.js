// Vercel serverless entrypoint.
//
// Points at the esbuild-bundled output (dist/app.mjs, produced by
// `pnpm run build`, which Vercel's build step already runs) rather than
// the raw TypeScript source in ../src. Vercel runs files under /api
// directly via Node's native TypeScript support instead of bundling
// them, and Node's strict ESM resolver can't handle the
// directory/extensionless relative imports our source files use (e.g.
// `import router from "./routes"`) — the bundled file has none of that
// left to resolve.
import app from "../dist/app.mjs";

export default app;

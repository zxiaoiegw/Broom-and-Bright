// Vercel serverless entrypoint.
//
// Vercel builds every file under /api into its own serverless function. This
// file re-exports the plain Express app (see ../src/app.ts) as the default
// export, which Vercel's Node.js runtime knows how to call directly with
// (req, res) on every request — src/index.ts's app.listen(...) is only used
// for the standalone/local server and never runs here.
import app from "../src/app";

export default app;

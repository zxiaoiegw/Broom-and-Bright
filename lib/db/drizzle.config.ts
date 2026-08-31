import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// drizzle-kit's schema glob needs forward slashes even on Windows —
// path.join() produces backslashes there, which the glob matcher treats as
// escape characters and silently matches nothing.
const schemaGlob = path.join(__dirname, "./src/schema/*.ts").split(path.sep).join("/");

export default defineConfig({
  schema: schemaGlob,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

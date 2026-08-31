// One-time bootstrap: creates the first staff account (an "owner"). There's
// no public signup endpoint on purpose — every account after this one is
// created by an owner from the staff dashboard.
//
// Usage (after `pnpm --filter @workspace/api-server run build`):
//   SEED_OWNER_NAME="Jane Doe" SEED_OWNER_EMAIL=jane@example.com SEED_OWNER_PASSWORD=... \
//     node --env-file=.env dist/scripts/seed-owner.mjs
//
// Safe to re-run — it no-ops (with a message) if any staff account already exists.
import { db, staffTable } from "@workspace/db";
import { hashPassword } from "../lib/auth";

async function main() {
  const name = process.env.SEED_OWNER_NAME;
  const email = process.env.SEED_OWNER_EMAIL;
  const password = process.env.SEED_OWNER_PASSWORD;

  if (!name || !email || !password) {
    console.error("Set SEED_OWNER_NAME, SEED_OWNER_EMAIL, and SEED_OWNER_PASSWORD and try again.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("SEED_OWNER_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const existing = await db.select().from(staffTable).limit(1);
  if (existing.length > 0) {
    console.log("A staff account already exists — not creating another owner. Log in and use Add Staff instead.");
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);
  await db.insert(staffTable).values({ name, email: email.toLowerCase(), passwordHash, role: "owner" });
  console.log(`Owner account created for ${email}. You can now log in at /staff/login.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

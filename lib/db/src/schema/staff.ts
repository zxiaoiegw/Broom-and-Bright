import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// "owner" can see/manage every staff member's availability and bookings.
// "cleaner" only sees and manages their own.
export const staffRoleEnum = pgEnum("staff_role", ["owner", "cleaner"]);

export const staffTable = pgTable("staff", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  // scrypt hash, format "<saltHex>:<hashHex>" — see api-server/src/lib/auth.ts
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: staffRoleEnum("role").notNull().default("cleaner"),
  // Secret token in this staff member's personal calendar-subscription URL
  // (Google/Apple "subscribe by URL" — see routes/calendar-feed.ts). Null
  // until they generate one from the dashboard. Anyone with this token can
  // read that person's booking schedule with no login, so it must never be
  // included in toPublicStaff — same treatment as passwordHash.
  calendarFeedToken: text("calendar_feed_token").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStaffSchema = createInsertSchema(staffTable).omit({
  id: true,
  createdAt: true,
});
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staffTable.$inferSelect;

// Public-safe view of a staff row — never send passwordHash or
// calendarFeedToken (a bearer secret) to the client at large; the feed token
// is only ever returned directly to its own owner, from the dedicated
// calendar-feed-token endpoint.
export type PublicStaff = Omit<Staff, "passwordHash" | "calendarFeedToken">;
export function toPublicStaff(staff: Staff): PublicStaff {
  const { passwordHash: _passwordHash, calendarFeedToken: _calendarFeedToken, ...rest } = staff;
  return rest;
}

// Opaque bearer token stored in an httpOnly cookie. One row per logged-in
// session/device so logout (or revoking a compromised session) is a delete.
export const staffSessionsTable = pgTable("staff_sessions", {
  token: text("token").primaryKey(),
  staffId: integer("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StaffSession = typeof staffSessionsTable.$inferSelect;

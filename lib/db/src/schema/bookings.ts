import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { staffTable } from "./staff";

export const bookingStatusEnum = pgEnum("booking_status", ["confirmed", "cancelled", "completed"]);

// Mirrors the free-quote service keys (standard/deep/moveInOut) plus the
// separate hourly flow — see artifacts/broom-and-bright/.../free-quote/pricing.ts.
export const bookingServiceTypeEnum = pgEnum("booking_service_type", [
  "standard",
  "deep",
  "moveInOut",
  "hourly",
]);

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  // Auto-assigned at creation time from whoever is available for the slot.
  staffId: integer("staff_id").notNull().references(() => staffTable.id, { onDelete: "restrict" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  address: text("address").notNull(),
  serviceType: bookingServiceTypeEnum("service_type").notNull(),
  notes: text("notes"),
  // Quote-time context, shown read-only in the staff dashboard. Nullable —
  // the hourly flow only ever sets estimatedTotal/preferredContact, and none
  // of this drives pricing logic (that already happened client-side before
  // submission); it's here purely so staff can see what the customer picked.
  bedrooms: integer("bedrooms"),
  bathrooms: text("bathrooms"), // e.g. "2.5" — combined full + half baths
  squareFeet: text("square_feet"),
  addons: text("addons"), // comma-joined labels
  frequency: text("frequency"),
  estimatedTotal: text("estimated_total"), // pre-formatted, e.g. "from $209"
  preferredContact: text("preferred_contact"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  status: bookingStatusEnum("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;

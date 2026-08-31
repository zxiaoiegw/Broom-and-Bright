import { pgTable, serial, integer, text, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { staffTable } from "./staff";

// Recurring weekly working hours per staff member, e.g. "Mondays 09:00-17:00".
// A staff member can have multiple rows per weekday (a split shift) — the
// slot calculator just unions whatever rows exist for that weekday.
export const availabilityRulesTable = pgTable("availability_rules", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  weekday: integer("weekday").notNull(), // 0 = Sunday .. 6 = Saturday
  startTime: text("start_time").notNull(), // "09:00", 24h, local business time
  endTime: text("end_time").notNull(), // "17:00"
});

export const insertAvailabilityRuleSchema = createInsertSchema(availabilityRulesTable)
  .omit({ id: true })
  .extend({
    weekday: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24h HH:MM"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24h HH:MM"),
  });
export type InsertAvailabilityRule = z.infer<typeof insertAvailabilityRuleSchema>;
export type AvailabilityRule = typeof availabilityRulesTable.$inferSelect;

// One-off exception to the weekly rules for a single date: either a day off
// (isAvailable: false — the weekly rule is ignored that day) or custom hours
// (isAvailable: true with its own startTime/endTime, e.g. a half-day).
export const availabilityOverridesTable = pgTable("availability_overrides", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull().references(() => staffTable.id, { onDelete: "cascade" }),
  date: date("date").notNull(), // "2026-12-25"
  isAvailable: boolean("is_available").notNull().default(false),
  startTime: text("start_time"), // only read when isAvailable is true
  endTime: text("end_time"),
});

export const insertAvailabilityOverrideSchema = createInsertSchema(availabilityOverridesTable).omit({ id: true });
export type InsertAvailabilityOverride = z.infer<typeof insertAvailabilityOverrideSchema>;
export type AvailabilityOverride = typeof availabilityOverridesTable.$inferSelect;

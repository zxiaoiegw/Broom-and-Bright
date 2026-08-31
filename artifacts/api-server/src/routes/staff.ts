import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { asc } from "drizzle-orm";
import { db, staffTable, toPublicStaff } from "@workspace/db";
import { requireStaffAuth, requireOwner, hashPassword } from "../lib/auth";

const router: IRouter = Router();

router.get("/staff", requireStaffAuth, async (_req, res) => {
  const rows = await db.select().from(staffTable).orderBy(asc(staffTable.name));
  res.json({ staff: rows.map(toPublicStaff) });
});

const createStaffSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["owner", "cleaner"]).default("cleaner"),
});

// Owner-only: invite a new cleaner. There's no public signup — accounts are
// provisioned by the business owner (or the one-time seed script for the
// very first owner account, see lib/db's seed script).
router.post("/staff", requireStaffAuth, requireOwner, async (req, res) => {
  const parsed = createStaffSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const { name, email, password, role } = parsed.data;
  const passwordHash = await hashPassword(password);

  try {
    const [created] = await db
      .insert(staffTable)
      .values({ name, email: email.toLowerCase(), passwordHash, role })
      .returning();
    res.status(201).json({ staff: toPublicStaff(created) });
  } catch {
    res.status(409).json({ error: "A staff account with that email already exists." });
  }
});

export default router;

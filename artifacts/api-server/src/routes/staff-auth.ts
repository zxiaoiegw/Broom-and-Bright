import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { db, staffTable, toPublicStaff } from "@workspace/db";
import { verifyPassword, createSession, deleteSession, setSessionCookie, clearSessionCookie } from "../lib/auth";

const router: IRouter = Router();

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

router.post("/staff/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const { email, password } = parsed.data;
  const [staff] = await db.select().from(staffTable).where(eq(staffTable.email, email.toLowerCase())).limit(1);

  // Same error for "no such account" and "wrong password" — don't leak which one.
  if (!staff || !(await verifyPassword(password, staff.passwordHash))) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const { token } = await createSession(staff.id);
  setSessionCookie(res, token);
  res.json({ staff: toPublicStaff(staff) });
});

router.post("/staff/logout", async (req, res) => {
  const token = req.cookies?.["staff_session"];
  if (token) await deleteSession(token);
  clearSessionCookie(res);
  res.json({ success: true });
});

router.get("/staff/me", (req, res) => {
  res.json({ staff: req.staff ?? null });
});

export default router;

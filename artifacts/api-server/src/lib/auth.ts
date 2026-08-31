import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Request, Response, NextFunction } from "express";
import { eq, and, gt } from "drizzle-orm";
import { db, staffTable, staffSessionsTable, toPublicStaff, type PublicStaff } from "@workspace/db";

const scrypt = promisify(scryptCallback);

const SESSION_COOKIE_NAME = "staff_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/* ------------------------------------------------------------------ *
 * Password hashing — scrypt + random salt, no extra dependency needed.
 * Stored as "<saltHex>:<hashHex>".
 * ------------------------------------------------------------------ */

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/* ------------------------------------------------------------------ *
 * Sessions — opaque bearer token in an httpOnly cookie, one DB row per
 * logged-in device so logout (or revoking a stolen session) is a delete.
 * ------------------------------------------------------------------ */

export async function createSession(staffId: number): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(staffSessionsTable).values({ token, staffId, expiresAt });
  return { token, expiresAt };
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(staffSessionsTable).where(eq(staffSessionsTable.token, token));
}

async function getStaffForToken(token: string): Promise<PublicStaff | null> {
  const rows = await db
    .select({ staff: staffTable })
    .from(staffSessionsTable)
    .innerJoin(staffTable, eq(staffSessionsTable.staffId, staffTable.id))
    .where(and(eq(staffSessionsTable.token, token), gt(staffSessionsTable.expiresAt, new Date())))
    .limit(1);

  const row = rows[0];
  return row ? toPublicStaff(row.staff) : null;
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    // Cross-origin (frontend and API are on different domains) needs SameSite=None
    // in production; localhost dev over http can't set Secure, so fall back to Lax.
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    maxAge: SESSION_TTL_MS,
    path: "/",
  };
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE_NAME, token, cookieOptions());
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
}

/** Attaches `req.staff` when a valid session cookie is present; never rejects. */
export async function attachStaff(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  req.staff = token ? await getStaffForToken(token) : null;
  next();
}

/** Rejects with 401 unless attachStaff already found a valid session. */
export function requireStaffAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.staff) {
    res.status(401).json({ error: "Not signed in." });
    return;
  }
  next();
}

/** Rejects with 403 unless the signed-in staff member is an owner. */
export function requireOwner(req: Request, res: Response, next: NextFunction): void {
  if (req.staff?.role !== "owner") {
    res.status(403).json({ error: "Owner access required." });
    return;
  }
  next();
}

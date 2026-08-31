import type { PublicStaff } from "@workspace/db";

declare global {
  namespace Express {
    interface Request {
      /** Set by attachStaff middleware — null when not signed in. */
      staff?: PublicStaff | null;
    }
  }
}

export {};

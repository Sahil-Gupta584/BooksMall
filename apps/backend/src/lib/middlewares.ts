import { NextFunction, Request, Response } from "express";

// Extend Express Request interface to include 'payload'
declare global {
  namespace Express {
    interface Request {
      payload?: any;
    }
  }
}

import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const publicRoutes = ["/api/books"];
  if (publicRoutes.includes(req.path)) {
    next();
    return;
  }

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  console.log(session?.user);
  if (!session?.user.id) {
    res.status(402).json({ error: "Unauthorized" });
  }
  req.payload = { user: session?.user };
  next();
}

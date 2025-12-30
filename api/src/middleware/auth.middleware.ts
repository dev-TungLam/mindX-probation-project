import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // NOTE: In a real production app, verify signature against IDP's public keys (JWKS).
  // For this onboarding step, we just decode to verify structure/existence
  // as fetching JWKS might require more setup/caching.
  const decoded = jwt.decode(token);

  if (!decoded) {
    return res.status(403).json({ message: "Invalid token structure" });
  }

  (req as any).user = decoded;
  next();
};

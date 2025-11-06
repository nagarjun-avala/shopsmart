import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export interface JwtPayloadMinimal {
  sub?: string;
  deviceId?: string;
  iat?: number;
  exp?: number;
  [k: string]: unknown;
}

export function createAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

export function createRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): JwtPayloadMinimal | null {
  try { return jwt.verify(token, JWT_SECRET) as JwtPayloadMinimal; } catch { return null; }
}

export function verifyRefreshToken(token: string): JwtPayloadMinimal | null {
  try { return jwt.verify(token, REFRESH_SECRET) as JwtPayloadMinimal; } catch { return null; }
}

import { createHmac, timingSafeEqual, createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

export const AUTH_TTL_SECONDS = 60 * 60 * 24 * 7;

export type JwtUser = {
  sub: string;
  email: string;
  name: string;
  role: Role;
};

export type JwtClaims = JwtUser & jwt.JwtPayload & { session: string };

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

function sessionFingerprint(userId: string, passwordHash: string) {
  return createHmac("sha256", getJwtSecret())
    .update(`portal-session:${userId}:${passwordHash}`)
    .digest("hex");
}

export function signAuthToken(payload: JwtUser, passwordHash: string) {
  return jwt.sign({ ...payload, session: sessionFingerprint(payload.sub, passwordHash) }, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: AUTH_TTL_SECONDS
  });
}

export function verifyAuthToken(token: string): JwtClaims | null {
  try {
    const claims = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
    if (typeof claims === "string" || typeof claims.sub !== "string" || typeof claims.session !== "string") {
      return null;
    }
    return claims as JwtClaims;
  } catch {
    return null;
  }
}

export function isAuthSessionCurrent(claims: JwtClaims, passwordHash: string) {
  const expected = Buffer.from(sessionFingerprint(claims.sub, passwordHash), "hex");
  if (!/^[a-f0-9]{64}$/.test(claims.session)) return false;
  const actual = Buffer.from(claims.session, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";

interface TokenPayload {
  id: string;
  role: string;
}

/**
 *
 * @param id The currenttly Logged in user id
 * @param role The currenttly Logged in user role
 * @returns accessToken and refreshToken
 */
const generateTokens = (id: string, role: string) => {
  // Fix: Provide explicit type for options and ensure expiresIn is properly typed
  const accessTokenOptions: jwt.SignOptions = {
    expiresIn: ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };

  const refreshTokenOptions: jwt.SignOptions = {
    expiresIn: REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };

  const accessToken = jwt.sign(
    { id, role },
    ACCESS_TOKEN_SECRET,
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { id, role },
    REFRESH_TOKEN_SECRET,
    refreshTokenOptions
  );

  return { accessToken, refreshToken };
};

/**
 *
 * @param token accessToken from cookies
 * @returns boolean
 */
const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
};

/**
 *
 * @param token refreshToken
 * @returns boolean
 */
const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
};

/**
 *
 * @param res Response Object
 * @param tokens Object containing access and refresh tokens
 */
const setAuthCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) => {
  // Access token - short lived (15 minutes)
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  });

  // Refresh token - longer lived (7 days)
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

export {
  setAuthCookies,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
};

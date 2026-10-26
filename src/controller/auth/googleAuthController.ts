import type { Request, Response } from "express";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../../model/User.ts";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

const stateCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth/google",
  maxAge: 5 * 60 * 1000,
};

// 1. Start Google login
export function googleLogin(_req: Request, res: Response) {
  const state = randomBytes(32).toString("hex");

  res.cookie("oauth_state", state, stateCookieOptions);

  const googleUrl = googleClient.generateAuthUrl({
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account",
  });

  return res.redirect(googleUrl);
}

// 2. Handle Google's callback
export async function googleCallback(req: Request, res: Response) {
  try {
    const { code, state, error } = req.query;

    const savedState = req.cookies?.oauth_state as string | undefined;

    res.clearCookie("oauth_state", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/google",
    });

    if (error || typeof code !== "string") {
      return res.redirect(
        `${FRONTEND_URL}/auth/login?error=google_login_failed`,
      );
    }

    // Validate OAuth state
    if (
      typeof state !== "string" ||
      !savedState ||
      state.length !== savedState.length ||
      !timingSafeEqual(Buffer.from(state), Buffer.from(savedState))
    ) {
      return res.status(400).send("Invalid OAuth state");
    }

    // Exchange the authorization code for tokens
    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      return res.status(401).send("Google ID token missing");
    }

    // Verify Google's identity token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const profile = ticket.getPayload();

    if (!profile?.sub || !profile.email || profile.email_verified !== true) {
      return res.status(401).send("Google account not verified");
    }

    // Find an existing Google account
    let user = await User.findOne({
      googleId: profile.sub,
    });

    if (!user) {
      const email = profile.email.toLowerCase();

      // Don't silently link an existing password account
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.redirect(`${FRONTEND_URL}/auth/login?error=account_exists`);
      }

      // Adapt these fields to your User schema
      user = await User.create({
        name: profile.name ?? "",
        email,
        googleId: profile.sub,
        profileImage: profile.picture ?? "",
      });
    }

    // Use your existing JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Match the payload expected by your auth middleware
    const accessToken = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      secret,
      { expiresIn: "15m" },
    );

    // Set the application authentication cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    return res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("Google callback error:", err);

    return res.redirect(`${FRONTEND_URL}/auth/login?error=google_login_failed`);
  }
}

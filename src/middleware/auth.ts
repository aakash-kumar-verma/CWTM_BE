/// <reference path="../types/express.d.ts" />
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env.ts";
export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    // Expected format: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // JWT payload can be a string or an object
    if (typeof decoded === "string") {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    // Validate required claims
    if (typeof decoded.sub !== "string" || typeof decoded.email !== "string") {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    // Attach verified identity to the request.
    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };
    next();
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

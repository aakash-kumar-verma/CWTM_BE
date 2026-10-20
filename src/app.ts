import express from "express";
import cors from "cors";
import { connectDB } from "./config/dbconnection.js";

import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateUser } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check: does not require MongoDB
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "WorkHub API is running",
  });
});

// Ensure the database is connected before API routes run
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(503).json({
      success: false,
      message: "Database unavailable",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/", authenticateUser, userRoutes);

export default app;

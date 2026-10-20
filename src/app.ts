import express from "express";
import cors from "cors";
import { connectDB } from "./config/dbconnection.js";
import { initCollections } from "./config/initCollections.js";
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
// Cache initialization within this server instance.
let collectionsPromise: Promise<void> | null = null;
// Ensure the database is connected before API routes run
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    if (!collectionsPromise) {
      collectionsPromise = initCollections().catch((error: unknown) => {
        collectionsPromise = null;
        throw error;
      });
    }

    await collectionsPromise;
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

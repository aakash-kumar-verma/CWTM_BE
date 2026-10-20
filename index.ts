import "./src/env.js";
import express from "express";
import "./src/config/dbconnection.js";

import userRoutes from "./src/routes/userRoute.js";
import authRoutes from "./src/routes/authRoutes.js";
import { authenticateUser } from "./src/middleware/auth.js";
import { env } from "./src/env.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/", authenticateUser, userRoutes);

app.listen(env.PORT);

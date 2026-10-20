/// <reference path="../types/express.d.ts" />
import express, { Request, Response } from "express";
import { registerUser, login } from "../controller/auth/auth.ts";
import { authenticateUser } from "../middleware/auth.ts";
import { User } from "../model/User.ts";
const router = express.Router();

// Public APIs
router.post("/register", registerUser);
router.post("/login", login);

// Protected API: only logged-in users
router.get("/me", authenticateUser, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;

import express from "express";
import {
  getUserDetails,
  addUserDetails,
  deleteUserDetails,
} from "../controller/user/user.ts";

const router = express.Router();

//Get
router.get("/userDetails{/:id}", getUserDetails);

//POST
router.post("/userDetails", addUserDetails);

//DELETE
router.delete("/userDetails/:id", deleteUserDetails);

export default router;

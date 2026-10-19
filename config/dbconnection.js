import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected Successfully");
  })
  .catch(() => {
    console.log("Something went wrong");
  });

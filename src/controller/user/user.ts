import { Request, Response } from "express";
import { User } from "../../model/user/User.js";

export const getUserDetails = async (req: Request, resp: Response) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const userData = await User.findOne({ _id: userId });
      resp.status(200).send(userData);
    } else {
      const userData = await User.find();
      resp.status(200).send(userData);
    }
  } catch (error) {
    console.log({ error });
    resp.status(500).send(error._message);
  }
};
export const addUserDetails = async (req: Request, resp: Response) => {
  try {
    const { name, password, email } = req.body;
    const result = await User.create({ name, email, password });
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error._message);
  }
};

export const deleteUserDetails = async (req: Request, resp: Response) => {
  try {
    const userId = req.params.id;
    const isUserExisted = await User.findOne({ _id: userId });
    if (isUserExisted) {
      const result = await User.deleteOne({ _id: userId });
      if (result.deletedCount) {
        resp.status(200).send("user deleted successfully");
      }
    } else {
      resp.status(500).send("User not found");
    }
  } catch (error) {
    console.log({ error });
    resp.status(500).send(error._message);
  }
};

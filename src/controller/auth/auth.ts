import bcrypt from "bcryptjs";
import { User } from "../../model/User.ts";
import {
  PASSWORD_REGEX,
  REGEX,
  REQUIRED_FIELDS,
} from "../../constants/auth.js";
import jwt, { type SignOptions } from "jsonwebtoken";
import { Request, Response } from "express";
import { env } from "../../env.ts";

const registerUser = async (req: Request, resp: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return resp.status(400).send({ message: REQUIRED_FIELDS });
    }
    if (!REGEX.PASSWORD.test(password)) {
      return resp.status(400).send({ message: PASSWORD_REGEX });
    }
    const normaliseEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normaliseEmail });
    if (existingUser) {
      return resp.status(409).send({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userCreated = await User.create({
      name,
      password: hashedPassword,
      email: normaliseEmail,
    });

    if (userCreated) {
      const { _id, name, email, createdAt, updatedAt } = userCreated;
      return resp.status(200).send({
        message: "User registered successfully",
        data: {
          _id,
          name,
          email,
          createdAt,
          updatedAt,
        },
      });
    }
  } catch (error) {
    return resp.status(500).send({ message: "Something went wrong" });
  }
};

const login = async (req: Request, resp: Response) => {
  try {
    const { email, password } = req.body;

    const normalisedEmail = email.trim().toLowerCase();

    if (!email || !password) {
      return resp
        .status(400)
        .send({ message: "Email and password are required" });
    }
    const isUserExist = await User.findOne({ email: normalisedEmail }).select(
      "+password",
    );

    if (!isUserExist) {
      return resp.status(401).send({ message: "Invalid Email or password" });
    }
    const { _id, email: userEmail, name, password: userPassword } = isUserExist;

    const isPasswordValid = await bcrypt.compare(password, userPassword);

    if (!isPasswordValid) {
      return resp.status(401).send({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        id: isUserExist._id.toString(),
        email: isUserExist.email,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
        algorithm: "HS256",
      },
    );

    return resp.status(200).send({
      message: "login successfully",
      token,
      user: {
        _id,
        userEmail,
        name,
      },
    });
  } catch (error) {
    console.log({ error });
    return resp.status(500).send({ message: "Internal server error" });
  }
};

export { login, registerUser };

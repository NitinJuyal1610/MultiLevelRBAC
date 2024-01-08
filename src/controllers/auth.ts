import {
  createUser,
  findOneUser,
  userExists,
  validatePassword,
} from "../services/userService";
import { NextFunction, Request, Response } from "express";
import { omit } from "lodash";
import { sign } from "../util/jwt";

import { ApiError } from "../util/ApiError";
const omitData = ["password"];

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = req.body;
    const userExist = await userExists({
      email: user.email,
      mobile: user.mobile,
    });
    if (userExist) {
      throw new ApiError(400, "Email is alredy used");
    }
    user = await createUser(user);
    const userData = omit(user?.toJSON(), omitData);
    const accessToken = sign({ ...userData });

    return res.status(200).json({
      data: userData,
      error: false,
      accessToken,
      msg: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await findOneUser({ email });
    if (!user) {
      throw new ApiError(400, "Email id is incorrect");
    }

    const validPassword = await validatePassword(user.email, password);
    if (!validPassword) {
      throw new ApiError(400, "Password is incorrect");
    }
    const userData = omit(user?.toJSON(), omitData);
    const accessToken = sign({ ...userData });

    return res.status(200).json({
      data: userData,
      access_token: accessToken,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

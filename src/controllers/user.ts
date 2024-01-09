import { createUser } from "../services/userService";
import { NextFunction, Response } from "express";
import { customRequest } from "../types/customDefinition";
import { ApiError } from "../util/ApiError";
import { ROLES } from "../config/consts";
import { UserType } from "../types/customDefinition";
export const createUserHandler = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role, branchManagerId } = req.body;

    // action validation

    const payload: UserType = {
      name,
      email,
      password,
      role,
    };

    // Roles
    const userRole: ROLES = req.user.role;

    if (userRole === ROLES.SUPERADMIN) {
      payload["superAdminId"] = req.user.id;

      if (role === ROLES.SALESPERSON && branchManagerId) {
        payload["branchManagerId"] = branchManagerId;
      }
    }

    if (userRole === ROLES.BRANCHMANAGER) {
      if (role != ROLES.SALESPERSON) {
        throw new ApiError(401, "Unauthorized!");
      }
      payload["branchManagerId"] = req.user.id;
      payload["superAdminId"] = req.user.superAdminId;
    }

    // create user
    const user = await createUser(payload);

    if (!user) {
      throw new ApiError(400, "Failed to create user");
    }

    return res.status(200).json({
      user: user,
      msg: user ? "User Create successfully" : "failed to create a user",
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const getListHandler = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({
      data: [],
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUserHandler = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({
      data: [],
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserData = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({
      data: req.user,
      error: false,
    });
  } catch (err) {
    next(err);
  }
};

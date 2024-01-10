import {
  createUser,
  deleteUserById,
  findManyUser,
  findOneUser,
  getUserById,
  userExists,
} from "../services/userService";
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

      if (role === ROLES.SALESPERSON) {
        if (!branchManagerId) {
          throw new ApiError(
            400,
            "Please provide branch manager id for sales person"
          );
        }
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

    // existence
    const userExist = await userExists({ email });

    if (userExist) {
      throw new ApiError(400, "Email is alredy used");
    }
    // create user
    const user = await createUser(payload);

    if (!user) {
      throw new ApiError(400, "Failed to create user");
    }

    return res.status(201).json({
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
    const query: any = {};
    // Roles
    if (req.user.role == ROLES.SUPERADMIN) {
      query["superAdminId"] = req.user.id;
    }
    if (req.user.role == ROLES.BRANCHMANAGER) {
      query["branchManagerId"] = req.user.id;
    }

    const users = await findManyUser(query);
    return res.status(200).json({
      data: users ? users : [],
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
    const { id } = req.params;
    const user = await getUserById(Number(id));

    if (!user) {
      throw new ApiError(400, "User not found");
    }
    //authorization
    if (req.user.role == ROLES.BRANCHMANAGER) {
      if (
        user.role !== ROLES.SALESPERSON ||
        user.branchManagerId !== req.user.id
      ) {
        throw new ApiError(401, "Unauthorized!");
      }
    }

    await deleteUserById(Number(id));
    //
    return res.status(200).json({
      data: {
        msg: "User deleted successfully",
      },
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

import { Router } from "express";
import { authorize } from "../../middleware";
import { ROLES } from "../../config/consts";
import {
  createUserHandler,
  deleteUserHandler,
  getListHandler,
  getUserData,
} from "../../controllers/user";

import validateRequest from "../../middleware/validateRequest";
import { createUserSchema } from "../../validation/user";
const userRouter = Router();

userRouter.get("/", authorize(["all"]), getUserData);
userRouter.post(
  "/create",
  authorize([ROLES.SUPERADMIN, ROLES.BRANCHMANAGER]),
  validateRequest(createUserSchema),
  createUserHandler
);

userRouter.get(
  "/lists",
  authorize([ROLES.SUPERADMIN, ROLES.BRANCHMANAGER]),
  getListHandler
);

userRouter.delete(
  "delete/:id",
  authorize([ROLES.SUPERADMIN, ROLES.BRANCHMANAGER]),
  deleteUserHandler
);
export default userRouter;

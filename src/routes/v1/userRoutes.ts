import { Router } from "express";
import { requireUser } from "../../middleware";
import { getUserData } from "../../controllers/user";

const userRouter = Router();

userRouter.get("/", requireUser, getUserData);

export default userRouter;

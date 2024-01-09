import { Router } from "express";
import { validateRequest } from "../../middleware";
import { loginUser } from "../../controllers/auth";
import { loginSchema } from "../../validation/user";
const authRouter = Router();

authRouter.post("/login", validateRequest(loginSchema), loginUser);

export default authRouter;

import { Router } from "express";
import { validateRequest } from "../../middleware";
import { loginUser, registerUser } from "../../controllers/auth";
import { loginSchema, registerSchema } from "../../validation/user";
const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), registerUser);
authRouter.post("/login", validateRequest(loginSchema), loginUser);

export default authRouter;

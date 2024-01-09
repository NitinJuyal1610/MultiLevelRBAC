import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  role: Joi.string()
    .valid("SUPERADMIN", "BRANCHMANAGER", "SALESPERSON")
    .required(),
  branchManagerId: Joi.number().optional(),
  superAdminId: Joi.number().optional(),
});

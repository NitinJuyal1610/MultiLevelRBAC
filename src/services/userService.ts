import { encryptSync } from "../util/encrypt";
import User from "../models/User";
import { Op } from "sequelize";

export const createUser = async (payload: any) => {
  payload.password = encryptSync(payload.password);
  console.log(payload);
  const user = await User.create(payload);
  return user;
};

export const getUserById = async (id: number) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const userExists = async (
  options: { email: string | null } = {
    email: null,
  }
) => {
  if (!options.email) {
    throw new Error("Please provide either of these options: email");
  }
  const where: any = {
    [Op.or]: [],
  };
  if (options.email) {
    where[Op.or].push({ email: options.email });
  }

  const users = await User.findAll({ where: where });
  return users.length > 0;
};

export const validatePassword = async (email: string, password: string) => {
  if (!email && !password) {
    throw new Error("Please provide email and password");
  }
  const where = {
    [Op.or]: [] as any,
  };

  if (email) {
    where[Op.or].push({ email: email });
  }

  const user = await User.findOne({ where });

  return User.validPassword(password, user.password);
};

export const findOneUser = async (options: any) => {
  if (
    !options.email &&
    !options.id &&
    !options.superAdminId &&
    !options.branchManagerId
  ) {
    throw new Error("Please provide valid attributes");
  }

  const where: any = {};

  if (options.email) {
    where["email"] = options.email;
  }
  if (options.id) {
    where["id"] = options.id;
  }
  if (options.superAdminId) {
    where["superAdminId"] = options.superAdminId;
  }
  if (options.branchManagerId) {
    where["branchManagerId"] = options.branchManagerId;
  }

  const user = await User.findOne({
    where,
    attributes: { exclude: ["password"] },
  });

  return user;
};

export const findManyUser = async (options: any) => {
  if (
    !options.email &&
    !options.id &&
    !options.superAdminId &&
    !options.branchManagerId
  ) {
    throw new Error("Please provide valid attributes");
  }

  const where: any = {};

  if (options.email) {
    where["email"] = options.email;
  }
  if (options.id) {
    where["id"] = options.id;
  }
  if (options.superAdminId) {
    where["superAdminId"] = options.superAdminId;
  }
  if (options.branchManagerId) {
    where["branchManagerId"] = options.branchManagerId;
  }

  const user = await User.findAll({
    where,
    attributes: { exclude: ["password"] },
  });

  return user;
};

export const deleteUserById = (userId: number) => {
  if (!userId) {
    throw new Error("Please user id to delete");
  }
  if (userId && isNaN(userId)) {
    throw new Error("Invalid user id");
  }

  return User.destroy({
    where: { id: userId },
  });
};

import { get } from "lodash";
import { Response, NextFunction } from "express";
import { customRequest } from "../types/customDefinition";

const authorizeUser = (allowed: string[]) => {
  return async (req: customRequest, res: Response, next: NextFunction) => {
    try {
      const user: any = get(req, "user");

      if (!user) {
        return res
          .status(403)
          .json({ errorMsg: "Auth token user not found", error: true });
      }

      if (!allowed.includes(user.role) && allowed[0] !== "all") {
        return res
          .status(403)
          .json({ errorMsg: "User not authorized", error: true });
      }

      return next();
    } catch (err) {
      let msg = "Internal Server Error";
      if (err instanceof Error) {
        msg = err.message;
      } else if (err) {
        msg = err;
      }
      return res.status(400).json({ errorMsg: msg, error: true });
    }
  };
};
export default authorizeUser;

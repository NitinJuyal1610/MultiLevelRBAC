import express from "express";
import logger from "morgan";

import { dbSync } from "./db/connection";
import cors from "cors";
import { customRequest } from "./types/customDefinition";
import { deserializeUser } from "./middleware";
import appRouter from "./routes/v1";
import { errorHandler } from "./middleware/error";
import { createUser, userExists } from "./services/userService";

// Create Express server
const app = express();

app.use(logger("dev"));
app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(deserializeUser);

/**
 * Primary app routes.
 */

app.use("/api", appRouter);

/**
 * route to test server
 */

app.get("/api/", (req: customRequest, res) => {
  res.status(200).json({ msg: "server is up..", user: req.user });
});

/**
 * route to sync db
 */
app.patch("/api/sync", async (req, res) => {
  try {
    const sync = await dbSync();
    res.status(200).json({ ...sync, error: false });
  } catch (err) {
    console.log("ERR", err);
    let msg = "Internal Server Error";
    if (err instanceof Error) {
      msg = err.message;
    } else if (err) {
      msg = err;
    }
    return res.status(400).json({ errorMsg: msg, error: true });
  }
});

// middleware to handle error
app.use(errorHandler);

dbSync()
  .then(async res => {
    const userExist = await userExists({
      email: "admin@admin.com",
    });
    if (!userExist) {
      const user = await createUser({
        name: "superAdmin",
        email: "admin@admin.com",
        password: "admin",
        role: "SUPERADMIN",
      });

      console.info(`Admin user created: ${user.name}`);
    }
    console.info(`DB sync with status: ${res.success}`);
  })
  .catch(err => {
    console.error("Failed to sync DB", err);
  });

export { dbSync };
export default app;

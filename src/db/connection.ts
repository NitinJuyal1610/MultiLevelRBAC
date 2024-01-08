import { Sequelize } from "sequelize";
import { dbConfig } from "../config/config";
import logger from "../util/logger";
import { createUser, userExists } from "../services/userService";

const isDev = process.env.NODE_ENV === "development";

const sequelizeConnection = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: "mysql",
    logging: (msg: string) => logger.debug(msg),
  }
);

const dbSync = async () => {
  try {
    await sequelizeConnection.sync({ alter: isDev });
    return { success: true };
  } catch (error) {
    throw error;
  }
};
dbSync()
  .then(async res => {
    const userExist = await userExists({
      email: "admin@admin.com",
    });

    // if (!userExist) {
    //   logger.info("Creating default admin user");
    //   await createUser({
    //     email: "admin@admin.com",
    //     password: "admin@123",
    //     name: "superAdmin",
    //     role: "SUPERADMIN",
    //   });
    // }
    logger.info(`DB sync with status: ${res.success}`);
  })
  .catch(err => {
    logger.error("Failed to sync DB", err);
  });

export { dbSync };

export default sequelizeConnection;

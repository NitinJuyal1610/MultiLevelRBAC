import { Sequelize } from "sequelize";
import { dbConfig } from "../config/config";
import logger from "../util/logger";

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
    await sequelizeConnection.sync({ alter: isDev, force: isDev });
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export { dbSync };

export default sequelizeConnection;

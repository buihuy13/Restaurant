import { Sequelize } from "sequelize";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.PAYMENT_SERVICE_DB_URL, {
  dialect: process.env.DB_DIALECT || "mysql",
  logging: (msg) => logger.debug(msg),
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    min: parseInt(process.env.DB_POOL_MIN) || 5,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const connectDB = async () => {
  try {
    console.log("DB URL:", process.env.PAYMENT_SERVICE_DB_URL);

    await sequelize.authenticate();
    logger.info("MySQL database connected successfully");

    // đồng bộ tất cả các model Sequelize với cơ sở dữ liệu.
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    logger.info("Database models synchronized");
  } catch (error) {
    logger.error("Unable to connect to database:", error);
    process.exit(1);
  }
};

export default sequelize;

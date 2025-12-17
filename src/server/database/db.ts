import "dotenv/config";
import { createPool, Pool } from "mysql2/promise";
import { DBConfig } from "../types/db.types";

// Database connection configuration
const DB_CONFIG: DBConfig = {
  user: process.env.DB_USER || "root",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "trail_forward",
  password: process.env.DB_PASSWORD || "trailforward",
};

const connectionPool: Pool = createPool(DB_CONFIG);

export default connectionPool;

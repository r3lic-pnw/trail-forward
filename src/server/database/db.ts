import { createPool, Pool } from "mysql2/promise";
import { DBConfig } from "../types/db.types"

// Database connection configuration
const DB_CONFIG: DBConfig = {
    user: process.env.DB_USER || "traikcgk_traikcgk",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "traikcgk_events",
    password: process.env.DB_PASSWORD || "trailforwardnotback",
}

const connectionPool: Pool = createPool(DB_CONFIG);

export default connectionPool;
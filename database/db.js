import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Database connection configuration
const DB_CONFIG = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
}
const connectionPool = createPool({
    ...DB_CONFIG,
});

export default connectionPool;
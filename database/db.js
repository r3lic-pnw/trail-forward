import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const DB_CONFIG = {
    // Database connection configuration
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }, // Disable SSL for local development; set to true for production if needed 
    // connectionPool: process.env.NODE_ENV === "development" ? process.env.DB_URL_EXTERNAL : process.env.DB_URL_INTERNAL,

    // Pool configuration options
    max: 20, // Maximum number of clients in the pool
    min: 5, // Minimum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if a connection cannot be established
}
const connectionPool = new Pool(DB_CONFIG);

export default connectionPool;
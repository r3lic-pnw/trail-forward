import { readFileSync } from "fs";
import { join } from "path";
import { createPool } from "mysql2/promise";
import "dotenv/config";
async function initializeDatabase() {
    const pool = createPool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        multipleStatements: true,
    });
    const sql = readFileSync(join(process.cwd(), "database", "schema.sql"), "utf-8");
    try {
        await pool.query(sql);
        console.log("Database initialized successfully");
    }
    catch (error) {
        console.error("Error initializing database:", error);
    }
    finally {
        await pool.end();
    }
}
initializeDatabase();

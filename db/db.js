import dotenv from "dotenv";

dotenv.config("../.env");
// Load environment variables from .env file
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST, // 'postgres' (from docker-compose service name)
  port: process.env.DB_PORT, // 5432
  user: process.env.DB_USER, // 'postgres'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle PostgreSQL client", err);
  process.exit(-1);
});

export default pool;

/** 
// db.js
require("dotenv").config("../.env"); // Load environment variables from .env file
const { Pool } = require("pg");

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DB_URI, // Use the connection string from .env
  ssl: {
    // Add SSL configuration
    rejectUnauthorized: false, // Set to false for self-signed certificates or if you don't have a valid CA bundle
  },
});

// Add a connection test to ensure the database is reachable
pool.connect((err, client, done) => {
  if (err) {
    console.error("Database connection error:", err.stack);
    return;
  }
  console.log("Successfully connected to the PostgreSQL database!");
  done(); // Release the client back to the pool
});

module.exports = pool; // Export the pool for use in other modules
*/

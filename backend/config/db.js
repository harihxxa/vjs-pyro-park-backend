const { Pool } = require("pg");
require("dotenv").config();

const databaseUrl = new URL(process.env.DATABASE_URL);

// Remove sslmode from the connection string
// so the SSL configuration below is used.
databaseUrl.searchParams.delete("sslmode");

const pool = new Pool({
    connectionString: databaseUrl.toString(),

    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("connect", () => {
    console.log("PostgreSQL database connected");
});

pool.on("error", (error) => {
    console.error("PostgreSQL pool error:", error);
});

module.exports = pool;
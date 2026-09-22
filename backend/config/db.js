const { Pool } = require("pg");

const dbUrl = new URL(process.env.DATABASE_URL);

// Remove sslmode from DATABASE_URL so pg does not override our SSL setting
dbUrl.searchParams.delete("sslmode");

const pool = new Pool({
    connectionString: dbUrl.toString(),
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;
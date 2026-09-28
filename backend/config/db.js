const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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

module.exports = pool;const { Pool } = require("pg");
require("dotenv").config();

let poolConfig;

/*
 * Render / Aiven compatibility
 *
 * If DATABASE_URL exists, use it.
 * Otherwise use individual DB_* variables.
 */

if (process.env.DATABASE_URL) {

    poolConfig = {
        connectionString: process.env.DATABASE_URL,

        ssl: {
            rejectUnauthorized: false
        }
    };

} else {

    poolConfig = {

        host: process.env.DB_HOST,

        port: Number(
            process.env.DB_PORT || 5432
        ),

        user: process.env.DB_USER,

        password: process.env.DB_PASSWORD,

        database: process.env.DB_NAME,

        ssl: {
            rejectUnauthorized: false
        }

    };

}


const pool =
    new Pool(poolConfig);


pool.on(
    "connect",
    () => {

        console.log(
            "PostgreSQL database connected"
        );

    }
);


pool.on(
    "error",
    (error) => {

        console.error(
            "PostgreSQL pool error:",
            error
        );

    }
);


module.exports = pool;
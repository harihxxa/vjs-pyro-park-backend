require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function createAdmin() {
    try {

        const hash = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        await db.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password_hash,
                role
            )
            VALUES
            ($1, $2, $3, $4)

            ON CONFLICT (email)
            DO UPDATE SET
                password_hash = EXCLUDED.password_hash,
                role = EXCLUDED.role
            `,
            [
                "VJ Spyro Park Admin",
                process.env.ADMIN_EMAIL,
                hash,
                "admin"
            ]
        );

        console.log("");
        console.log("======================================");
        console.log("ADMIN USER CREATED SUCCESSFULLY");
        console.log("EMAIL:", process.env.ADMIN_EMAIL);
        console.log("======================================");
        console.log("");

        await db.end();

    } catch (error) {

        console.error("ADMIN CREATION FAILED");
        console.error(error.message);

        await db.end();
    }
}

createAdmin();
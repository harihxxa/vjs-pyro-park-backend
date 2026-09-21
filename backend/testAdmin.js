require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function testAdmin() {
    try {

        const result = await db.query(
            "SELECT email, password_hash, role FROM users WHERE email = $1",
            [process.env.ADMIN_EMAIL]
        );

        if (!result.rows.length) {
            console.log("ADMIN USER NOT FOUND");
            await db.end();
            return;
        }

        const user = result.rows[0];

        const valid = await bcrypt.compare(
            process.env.ADMIN_PASSWORD,
            user.password_hash
        );

        console.log("");
        console.log("======================================");
        console.log("ADMIN EMAIL:", user.email);
        console.log("ADMIN ROLE:", user.role);
        console.log("PASSWORD MATCH:", valid);
        console.log("======================================");
        console.log("");

        await db.end();

    } catch (error) {
        console.error(error.message);
        await db.end();
    }
}

testAdmin();
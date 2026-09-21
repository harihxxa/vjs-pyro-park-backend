require("dotenv").config();

const db = require("./config/db");

async function checkProducts() {

    try {

        const result = await db.query(`
            SELECT
                id,
                code,
                name,
                final_rate,
                active
            FROM products
            ORDER BY id
            LIMIT 20
        `);

        console.log("\n==============================");
        console.log("AIVEN PRODUCTS");
        console.log("==============================");
        console.log("Total products found:", result.rows.length);
        console.table(result.rows);
        console.log("==============================\n");

    } catch (error) {

        console.error("PRODUCT CHECK ERROR:");
        console.error(error.message);

    } finally {

        await db.end();

    }
}

checkProducts();
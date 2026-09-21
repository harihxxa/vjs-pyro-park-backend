require("dotenv").config();

const fs = require("fs");
const path = require("path");
const db = require("./config/db");

async function seedProducts() {
    const client = await db.connect();

    try {
        const scriptPath = path.join(
            __dirname,
            "..",
            "frontend",
            "script.js"
        );

        const script = fs.readFileSync(scriptPath, "utf8");

        // Find PRODUCTS array
        const match = script.match(
            /let\s+PRODUCTS\s*=\s*(\[[\s\S]*?\]);/
        );

        if (!match) {
            throw new Error(
                "PRODUCTS array not found in frontend/script.js"
            );
        }

        // Convert JavaScript array text into real array
        const products = Function(
            `"use strict"; return (${match[1]});`
        )();

        console.log("");
        console.log("==============================");
        console.log("VJS PYRO PARK PRODUCT SEED");
        console.log("==============================");
        console.log(
            "Products found in frontend:",
            products.length
        );

        if (!Array.isArray(products) || products.length === 0) {
            throw new Error("PRODUCTS array is empty.");
        }

        await client.query("BEGIN");

        // Get categories
        const categoryResult = await client.query(`
            SELECT id, name
            FROM categories
        `);

        const categoryMap = {};

        for (const category of categoryResult.rows) {
            categoryMap[
                String(category.name).trim().toLowerCase()
            ] = category.id;
        }

        let inserted = 0;
        let updated = 0;
        let skipped = 0;

        for (const product of products) {
            const categoryName = String(
                product.cat || "Others"
            )
                .trim()
                .toLowerCase();

            const categoryId = categoryMap[categoryName];

            if (!categoryId) {
                console.log(
                    `SKIPPED: ${product.name} - category not found`
                );

                skipped++;
                continue;
            }

            const mrp = Number(product.offer || 0);
            const finalRate = Number(product.price || 0);

            const discount =
                mrp > 0
                    ? Number(
                        (
                            ((mrp - finalRate) / mrp) *
                            100
                        ).toFixed(2)
                    )
                    : 0;

            const code =
                "VJS-" +
                String(product.id).padStart(3, "0");

            // Check whether product already exists by name
            const existing = await client.query(
                `
                SELECT id
                FROM products
                WHERE LOWER(TRIM(name))
                    = LOWER(TRIM($1))
                LIMIT 1
                `,
                [product.name]
            );

            if (existing.rows.length > 0) {

                // Update existing product
                await client.query(
                    `
                    UPDATE products
                    SET
                        category_id = $1,
                        mrp = $2,
                        discount = $3,
                        final_rate = $4,
                        active = TRUE,
                        icon = $5
                    WHERE id = $6
                    `,
                    [
                        categoryId,
                        mrp,
                        discount,
                        finalRate,
                        "🎆",
                        existing.rows[0].id
                    ]
                );

                updated++;

            } else {

                // Make sure generated code is unique
                let finalCode = code;

                const codeCheck = await client.query(
                    `
                    SELECT id
                    FROM products
                    WHERE code = $1
                    LIMIT 1
                    `,
                    [finalCode]
                );

                if (codeCheck.rows.length > 0) {
                    finalCode =
                        code +
                        "-" +
                        Date.now() +
                        "-" +
                        product.id;
                }

                // Insert new product
                await client.query(
                    `
                    INSERT INTO products
                    (
                        code,
                        name,
                        category_id,
                        pack,
                        mrp,
                        discount,
                        final_rate,
                        stock,
                        icon,
                        active
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7,
                        $8,
                        $9,
                        TRUE
                    )
                    `,
                    [
                        finalCode,
                        product.name,
                        categoryId,
                        "",
                        mrp,
                        discount,
                        finalRate,
                        0,
                        "🎆"
                    ]
                );

                inserted++;
            }
        }

        await client.query("COMMIT");

        // Show final active product count
        const countResult = await client.query(`
            SELECT COUNT(*) AS count
            FROM products
            WHERE active = TRUE
        `);

        console.log("");
        console.log("Inserted :", inserted);
        console.log("Updated  :", updated);
        console.log("Skipped  :", skipped);
        console.log(
            "Active DB products:",
            countResult.rows[0].count
        );

        console.log("");
        console.log("==============================");
        console.log("PRODUCT SEED COMPLETED ✅");
        console.log("==============================");
        console.log("");

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("");
        console.error("PRODUCT SEED ERROR ❌");
        console.error(error);
        console.error("");

    } finally {
        client.release();
        await db.end();
    }
}

seedProducts();
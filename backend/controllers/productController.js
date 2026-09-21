const db = require("../config/db");

// Get all products
exports.list = async (req, res) => {
    try {
        const { q = "", category = "" } = req.query;

        let sql = `
            SELECT
                p.*,
                c.name AS category
            FROM products p
            LEFT JOIN categories c
                ON c.id = p.category_id
            WHERE p.active = TRUE
        `;

        const values = [];

        if (q) {
            sql += `
                AND (
                    p.name ILIKE $1
                    OR p.code ILIKE $2
                )
            `;

            values.push(`%${q}%`, `%${q}%`);
        }

        if (category) {
            const categoryParam = values.length + 1;

            sql += `
                AND c.name = $${categoryParam}
            `;

            values.push(category);
        }

        sql += `
            ORDER BY p.id DESC
        `;

        const result = await db.query(sql, values);

        return res.json({
            products: result.rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// Get single product
exports.get = async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT
                p.*,
                c.name AS category
            FROM products p
            LEFT JOIN categories c
                ON c.id = p.category_id
            WHERE p.id = $1
            `,
            [req.params.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.json({
            product: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// Create product
exports.create = async (req, res) => {
    try {
        const {
            code,
            name,
            category_id,
            pack,
            mrp,
            discount,
            final_rate,
            stock,
            icon = "🎆"
        } = req.body;

        if (!code || !name || !category_id) {
            return res.status(400).json({
                message: "code, name, category_id required"
            });
        }

        const result = await db.query(
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
                icon
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
            `,
            [
                code,
                name,
                category_id,
                pack || "",
                mrp || 0,
                discount || 0,
                final_rate || 0,
                stock || 0,
                icon
            ]
        );

        return res.status(201).json({
            id: result.rows[0].id
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};
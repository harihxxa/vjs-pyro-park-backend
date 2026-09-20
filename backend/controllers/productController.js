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
            WHERE p.active = 1
        `;

        const values = [];

        if (q) {
            sql += `
                AND (
                    p.name LIKE ?
                    OR p.code LIKE ?
                )
            `;

            values.push(`%${q}%`, `%${q}%`);
        }

        if (category) {
            sql += `
                AND c.name = ?
            `;

            values.push(category);
        }

        sql += `
            ORDER BY p.id DESC
        `;

        const [rows] = await db.query(sql, values);

        return res.json({
            products: rows
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
        const [rows] = await db.query(
            `
            SELECT
                p.*,
                c.name AS category
            FROM products p
            LEFT JOIN categories c
                ON c.id = p.category_id
            WHERE p.id = ?
            `,
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.json({
            product: rows[0]
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

        const [result] = await db.query(
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            id: result.insertId
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};
const db = require("../config/db");

// Get all categories
exports.list = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                id,
                name,
                created_at
            FROM categories
            ORDER BY name ASC
        `);

        return res.json({
            categories: result.rows
        });

    } catch (error) {
        console.error("Category list error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// Create category
exports.create = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name required"
            });
        }

        const categoryName = name.trim();

        const result = await db.query(
            `
            INSERT INTO categories (name)
            VALUES ($1)
            RETURNING id, name
            `,
            [categoryName]
        );

        return res.status(201).json({
            id: result.rows[0].id,
            name: result.rows[0].name
        });

    } catch (error) {
        console.error("Category create error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};
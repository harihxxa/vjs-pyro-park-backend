const db = require("../config/db");


// Get all categories
exports.list = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT *
            FROM categories
            ORDER BY name
        `);

        res.json({
            categories: rows
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Create category
exports.create = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name required"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO categories(name)
            VALUES(?)
            `,
            [name]
        );

        res.status(201).json({
            id: result.insertId,
            name
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

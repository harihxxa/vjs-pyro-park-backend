const db = require("../config/db");

const Product = {

    getAll: async () => {

        const [rows] = await db.query(`
            SELECT
                p.*,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c
            ON p.category_id = c.id
            WHERE p.is_active = TRUE
            ORDER BY p.id DESC
        `);

        return rows;
    },

    getById: async (id) => {

        const [rows] = await db.query(
            `SELECT
                p.*,
                c.name AS category_name
             FROM products p
             LEFT JOIN categories c
             ON p.category_id = c.id
             WHERE p.id = ?`,
            [id]
        );

        return rows[0];
    },

    create: async (product) => {

        const [result] = await db.query(
            `INSERT INTO products
            (category_id,name,description,price,stock,image)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                product.category_id,
                product.name,
                product.description,
                product.price,
                product.stock,
                product.image
            ]
        );

        return result.insertId;
    },

    update: async (id, product) => {

        await db.query(
            `UPDATE products
             SET category_id=?,
                 name=?,
                 description=?,
                 price=?,
                 stock=?,
                 image=?
             WHERE id=?`,
            [
                product.category_id,
                product.name,
                product.description,
                product.price,
                product.stock,
                product.image,
                id
            ]
        );
    },

    delete: async (id) => {

        await db.query(
            "UPDATE products SET is_active = FALSE WHERE id = ?",
            [id]
        );
    }
};

module.exports = Product;
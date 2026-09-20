const db = require("../config/db");

const User = {

    findByEmail: async (email) => {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        return rows[0];
    },

    create: async (name, email, password, phone, role = "customer") => {

        const [result] = await db.query(
            `INSERT INTO users
            (name, email, password, phone, role)
            VALUES (?, ?, ?, ?, ?)`,
            [name, email, password, phone, role]
        );

        return result.insertId;
    },

    findById: async (id) => {

        const [rows] = await db.query(
            "SELECT id,name,email,phone,role FROM users WHERE id = ?",
            [id]
        );

        return rows[0];
    }
};

module.exports = User;
const { query } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async createAccount({ email, rawPassword, tipoConta }) {
        const password_hash = await bcrypt.hash(rawPassword, 10);

        const sql = `INSERT INTO users (email, passwd, tipoConta) VALUES (?, ?, ?)`;

        const result = await query(sql, [email, password_hash, tipoConta]);
        return result.insertId;
    };

    static async findById(id) {
        const sql = `SELECT * FROM users WHERE userID = ?`;
        const result = await query(sql, [id]);
        return result[0] || null;
    };

    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const result = await query(sql, [email]);
        return result[0] || null;
    };

    static async findByIdWithData(userID) {
        const sql = `SELECT * FROM user_data UD LEFT JOIN users U ON U.userID = UD.userID WHERE U.userID = ?`;
        const result = await query(sql, [userID]);
        return result[0];
    };

    static async deleteAccount(userID) {
        const sql = `DELETE FROM users WHERE userID = ?`;
        const result = await query(sql, [userID]);
        return result.affectedRows > 0;
    };

    static async emailExists(email) {
        const sql = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
        const result = await query(sql, [email]);
        return result[0].count > 0;
    };
};

module.exports = User;
const { query } = require('../config/database');

class Resume_links {
    
    static async create({curriculoID, linkedin, github, portfolio, outros}){
        const sql = `INSERT INTO resume_links (curriculoID, linkedin, github, portfolio, outros)
        VALUES (?, ?, ?, ?, ?)`;;

        const result = await query(sql, [curriculoID, linkedin, github, portfolio, outros]);
        return result.insertId;
    };

    static async update(id, {linkedin, github, portfolio, outros}){
        const sql = `UPDATE resume_links SET linkedin = ?, github = ?, portfolio = ?, outros = ? WHERE id = ?`;

        const result = await query(sql, [linkedin, github, portfolio, outros, id]);
        return result.affectedRows > 0;
    };

    static async findByResume(id){
        const sql = `SELECT * FROM resume_links WHERE id = ?`;
        return await query(sql, [id]);
    };

    static async delete(id){
        const sql = `DELETE FROM resume_links WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    };
};

module.exports = Resume_links;
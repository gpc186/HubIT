const { query } = require('../config/database');

class Languages {
    
    static async create({curriculoID, idioma, nivel}){
        const sql = `INSERT INTO languages (curriculoID, idioma, nivel)
        VALUES (?, ?, ?)`;;

        const result = await query(sql, [curriculoID, idioma, nivel]);
        return result.insertId;
    };

    static async update(id, {idioma, nivel}){
        const sql = `UPDATE languages SET idioma = ?, nivel = ? WHERE id = ?`;

        const result = await query(sql, [idioma, nivel, id]);
        return result.affectedRows > 0;
    };

    static async findByResume(id){
        const sql = `SELECT * FROM languages WHERE id = ?`;
        return await query(sql, [id]);
    };

    static async delete(id){
        const sql = `DELETE FROM languages WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    };
};

module.exports = Languages;
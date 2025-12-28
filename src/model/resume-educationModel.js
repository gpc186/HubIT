const { query } = require('../config/database');

class Educations {
    
    static async create({curriculoID, curso, instituicao, dataInicio, dataFim = null, status = 'cursando'}){
        const sql = `INSERT INTO educations (curriculoID, curso, instituicao, dataInicio, dataFim, status)
        VALUES (?, ?, ?, ?, ?, ?)`;;

        const result = await query(sql, [curriculoID, curso, instituicao, dataInicio, dataFim, status]);
        return result.insertId;
    };

    static async update(id, {curso, instituicao, dataInicio, dataFim, status}){
        const sql = `UPDATE educations SET curso = ?, instituicao = ?, dataInicio = ?, dataFim = ?, status = ? WHERE id = ?`;

        const result = await query(sql, [curso, instituicao, dataInicio, dataFim, status, id]);
        return result.affectedRows > 0;
    };

    static async findByResume(id){
        const sql = `SELECT * FROM educations WHERE id = ?`;
        return await query(sql, [id]);
    };

    static async delete(id){
        const sql = `DELETE FROM educations WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    };
};

module.exports = Educations;
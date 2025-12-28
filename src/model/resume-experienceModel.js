const { query } = require('../config/database');

class Experiences {
    
    static async create({curriculoID, cargo, empresa, dataInicio, dataFim = null, atual = false, descricao}){
        const sql = `INSERT INTO experiences (curriculoID, cargo, empresa, dataInicio, dataFim, atual, descricao)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;;

        const result = await query(sql, [curriculoID, cargo, empresa, dataInicio, dataFim, atual, descricao]);
        return result.insertId;
    };

    static async update(id, {cargo, empresa, dataInicio, dataFim, atual, descricao}){
        const sql = `UPDATE experiences SET cargo = ?, empresa = ?, dataInicio = ?, dataFim = ?, atual = ?, descricao = ? WHERE id = ?`;

        const result = await query(sql, [cargo, empresa, dataInicio, dataFim, atual, descricao, id]);
        return result.affectedRows > 0;
    };

    static async findByResume(id){
        const sql = `SELECT * FROM experiences WHERE id = ?`;
        return await query(sql, [id]);
    };

    static async delete(id){
        const sql = `DELETE FROM experiences WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    };
};

module.exports = Experiences;
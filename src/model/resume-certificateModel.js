const { query } = require('../config/database');

class Certificates {
    
    static async create({curriculoID, nome, instituicao, dataEmissao, dataValidade = null, linkCredencial = 'cursando'}){
        const sql = `INSERT INTO certificates (curriculoID, nome, instituicao, dataEmissao, dataValidade, linkCredencial)
        VALUES (?, ?, ?, ?, ?, ?)`;;

        const result = await query(sql, [curriculoID, nome, instituicao, dataEmissao, dataValidade, linkCredencial]);
        return result.insertId;
    };

    static async update(id, {nome, instituicao, dataEmissao, dataValidade, linkCredencial}){
        const sql = `UPDATE certificates SET nome = ?, instituicao = ?, dataEmissao = ?, dataValidade = ?, linkCredencial = ? WHERE id = ?`;

        const result = await query(sql, [nome, instituicao, dataEmissao, dataValidade, linkCredencial, id]);
        return result.affectedRows > 0;
    };

    static async findByResume(id){
        const sql = `SELECT * FROM certificates WHERE id = ?`;
        return await query(sql, [id]);
    };

    static async delete(id){
        const sql = `DELETE FROM certificates WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    };
};

module.exports = Certificates;
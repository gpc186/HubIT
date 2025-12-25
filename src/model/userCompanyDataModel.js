const { query } = require('../config/database');

class Company_data {
    static async create({userID, nomeEmpresa, cnpj, telefone, localizacao, setor, numeroFuncionarios, site, linkedin, descricao, logoEmpresa}) {
        const sql = `INSERT INTO company_data (userID, nomeEmpresa, cnpj, telefone, localizacao, setor, numeroFuncionarios, site, linkedin, descricao, logoEmpresa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await query(sql, [userID, nomeEmpresa, cnpj, telefone, localizacao, setor, numeroFuncionarios, site, linkedin, descricao, logoEmpresa]);
        return result.insertId;
    };

    static async update({userID, nomeEmpresa, cnpj, telefone, localizacao, setor, numeroFuncionarios, site, linkedin, descricao, logoEmpresa}){
        const sql = `UPDATE company_data SET nomeEmpresa = ?,
        cnpj = ?,
        telefone = ?,
        localizacao = ?,
        setor = ?,
        numeroFuncionarios = ?,
        site = ?,
        linkedin = ?,
        descricao = ?,
        logoEmpresa = ?
        WHERE userID = ?`;

        const result = await query(sql, [nomeEmpresa, cnpj, telefone, localizacao, setor, numeroFuncionarios, site, linkedin, descricao, logoEmpresa, userID]);
        return result.affectedRows > 0;
    };

    static async findByUserId(userID){
        const sql = `SELECT * FROM company_data WHERE userID = ?`;
        const result = await query(sql, [userID]);
        return result[0] || null;
    };

    static async delete(userID){
        const sql = `DELETE FROM company_data WHERE userID = ?`;
        const result = await query(sql, [userID]);
        return result.affectedRows > 0;
    };
};

module.exports = Company_data;
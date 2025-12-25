const { query } = require('../config/database');

class Job {
    static async create({empresaID, empresaNome, imgEmpresa, qtdFuncionario, titulo, descricao, area, nivel, tipoContrato, cargaHoraria, mediaSalario, localizacao, requisitos, diferenciais, beneficios, corDestaque}){
        const sql = `INSERT INTO jobs 
        (empresaID, empresaNome, imgEmpresa, qtdFuncionario, titulo, descricao, area, nivel, tipoContrato, cargaHoraria, mediaSalario, localizacao, requisitos, diferenciais, beneficios, corDestaque)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const result = await query(sql, [empresaID, empresaNome, imgEmpresa, qtdFuncionario, titulo, descricao, area, nivel, tipoContrato, cargaHoraria, mediaSalario, localizacao, requisitos, diferenciais, beneficios, corDestaque]);
        return result.insertId;
    };

    static async update(id, {titulo, descricao, nivel, tipoContrato, tipoTrabalho, localizacao, mediaSalario, status}){
        const sql = `UPDATE jobs SET titulo = ?,
        descricao = ?,
        nivel = ?,
        tipoContrato = ?,
        tipoTrabalho = ?,
        localizacao = ?,
        mediaSalario = ?,
        status = ?
        WHERE empregoID = ?`;

        const result = await query(sql, [titulo, descricao, nivel, tipoContrato, tipoTrabalho, localizacao, mediaSalario, status, id]);
        return result.affectedRows > 0;
    };

    static async findById(id) {
        const sql = `SELECT * FROM jobs WHERE empregoID = ?`;
        const result = await query(sql, [id]);
        return result[0] || null;
    };

    static async findByCompany(company) {
        const sql = `SELECT * FROM jobs WHERE empresaID = ? ORDER BY dataCriacao DESC`;
        return await query(sql, [company]);
    };

    static async findAll({nivel, tipoTrabalho, localizacao, status = 'ativo'} = {}){
        let sql = `SELECT * FROM jobs WHERE 1=1`;
        let params = []

        if (status) {
            sql += ` AND status = ?`;
            params.push(status)
        }
        if (localizacao) {
            sql += ` AND localizacao LIKE ?`;
            params.push(`%${localizacao}%`)
        }
        if (nivel) {
            sql += ` AND nivel = ?`;
            params.push(nivel)
        }
        if (tipoTrabalho) {
            sql += ` AND tipoTrabalho = ?`;
            params.push(tipoTrabalho)
        }

        sql += ` ORDER BY dataCriacao DESC`;

        return await query(sql, params);
    };

    static async delete(id) {
        const sql = `DELETE FROM jobs WHERE empregoID = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    };
};

module.exports = Job
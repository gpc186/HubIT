const { query } = require('../config/database');

class Job {
    static async create({empresaID, empresaNome, imgEmpresa, qtdFuncionario, titulo, descricao, area, nivel, tipoContrato, cargaHoraria, mediaSalario, localizacao, requisitos, diferenciais, beneficios, corDestaque, status}){
        const sql = `INSERT INTO jobs 
        (empresaID, empresaNome, imgEmpresa, qtdFuncionario, titulo, descricao, area, nivel, tipoContrato, cargaHoraria, mediaSalario, localizacao, requisitos, diferenciais, beneficios, corDestaque, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const result = await query(sql, [empresaID, empresaNome, imgEmpresa, qtdFuncionario, titulo, descricao, area, nivel, tipoContrato, cargaHoraria, mediaSalario, localizacao, requisitos, diferenciais, beneficios, corDestaque, status]);
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

    static async updateStatus(empregoID, status){
        const sql = `UPDATE jobs SET status = ? WHERE empregoID = ?`;
        const result = await query(sql, [status, empregoID]);
        return result.affectedRows > 0;
    };

    static async findById(empregoID) {
        const sql = `SELECT * FROM jobs WHERE empregoID = ?`;
        const result = await query(sql, [empregoID]);
        return result[0] || null;
    };

    static async findByCompany(empresaID) {
        const sql = `SELECT * FROM jobs WHERE empresaID = ? ORDER BY dataCriacao DESC`;
        return await query(sql, [empresaID]);
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

    static async delete(empregoID) {
        const sql = `DELETE FROM jobs WHERE empregoID = ?`;
        const result = await query(sql, [empregoID]);
        return result.affectedRows > 0;
    };
};

module.exports = Job
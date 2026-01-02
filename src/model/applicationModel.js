const { query } = require('../config/database');

class Application {
    static async create({empregoID,
        userID,
        curriculoID,
        status,
        candidato_nome,
        candidato_email,
        candidato_telefone,
        candidato_localizacao,
        candidato_areaAtuacao,
        candidato_nivelExperiencia,
        candidato_linkedin,
        candidato_github,
        vaga_titulo,
        vaga_empresaNome,
        vaga_localizacao,
        vaga_area
    }){
        const sql = `INSERT INTO applications (empregoID,
        userID,
        curriculoID,
        status,
        candidato_nome,
        candidato_email,
        candidato_telefone,
        candidato_localizacao,
        candidato_areaAtuacao,
        candidato_nivelExperiencia,
        candidato_linkedin,
        candidato_github,
        vaga_titulo,
        vaga_empresaNome,
        vaga_localizacao,
        vaga_area)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await query(sql, [empregoID,
        userID,
        curriculoID,
        status,
        candidato_nome,
        candidato_email,
        candidato_telefone,
        candidato_localizacao,
        candidato_areaAtuacao,
        candidato_nivelExperiencia,
        candidato_linkedin,
        candidato_github,
        vaga_titulo,
        vaga_empresaNome,
        vaga_localizacao,
        vaga_area]);
        return result.insertId;
    };

    static async findById(candidaturaID){
        const sql = `SELECT * FROM application WHERE candidaturaID = ? ORDER BY dataCandidatura DESC`;
        return await query(sql, [candidaturaID]);
    };
    
    static async findByJobId(empregoID){
        const sql = `SELECT * FROM application WHERE empregoID = ? ORDER BY dataCandidatura DESC`;
        return await query(sql, [empregoID]);
    };

    static async findByUserId(userID){
        const sql = `SELECT * FROM application WHERE userID = ? ORDER BY dataCandidatura DESC`;
        return await query(sql, [userID]);
    };

    static async updateStatus(candidaturaID, status){
        const sql = `UPDATE applications SET status = ? WHERE candidaturaID = ?`;
        const result = await query(sql, [candidaturaID, status]);
        return result.affectedRows > 0;
    };

    static async delete(candidaturaID){
        const sql = `DELETE FROM applications WHERE candidaturaID = ?`;
        const result = await query(sql, [candidaturaID]);
        return result.affectedRows > 0;
    };

};

module.exports = Application;
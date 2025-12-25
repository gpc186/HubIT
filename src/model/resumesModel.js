const { query } = require('../config/database');

class Resume {
    static async create({userID, nome, email, telefone, localizacao, titulo, resumoProfissional, habilidades, softSkills}){
        const sql = `INSERT INTO resumes
        (userID, nome, email, telefone, localizacao, titulo, resumoProfissional, habilidades, softSkills)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await query(sql, [userID, nome, email, telefone, localizacao, titulo, resumoProfissional, JSON.stringify(habilidades || []), JSON.stringify(softSkills || [])]);
        return result.insertId;
    };

    static async update(curriculoID, {nome, email, telefone, localizacao, titulo, resumoProfissional, habilidades, softSkills}){
        const sql = `UPDATE resumes SET nome = ?,
        email = ?,
        telefone = ?,
        localizacao = ?,
        titulo = ?,
        resumoProfissional = ?,
        habilidades = ?,
        softSkills = ?
        WHERE curriculoID = ?`;

        const result = await query(sql, [nome, email, telefone, localizacao, titulo, resumoProfissional, JSON.stringify(habilidades || []), JSON.stringify(softSkills || []), curriculoID]);
        return result.affectedRows > 0;
    };

    static async findById(id){
        const sql = `SELECT * FROM resumes WHERE curriculoID = ?`;
        const result = await query(sql, [id]);
        return result[0] || null
    };

    static async findByUser(userID){
        const sql = `SELECT * FROM resumes WHERE userID = ?`;
        return await query(sql, [userID])
    };

    static async delete(id){
        const sql = `DELETE FROM resumes WHERE curriculoID = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    };
};

module.exports = Resumes
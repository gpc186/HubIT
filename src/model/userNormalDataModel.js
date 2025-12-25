const { query } = require('../config/database');

class User_data {
    static async create({userID, nome, telefone, dataNasc, localizacao, areaAtuacao, nivelExperiencia, linkedin, github, biografia, fotoPerfil}) {
        const sql = `INSERT INTO user_data (userID, nome, telefone, dataNasc, localizacao, areaAtuacao, nivelExperiencia, linkedin, github, biografia, fotoPerfil)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await query(sql, [userID, nome, telefone, dataNasc, localizacao, areaAtuacao, nivelExperiencia, linkedin, github, biografia, fotoPerfil]);
        return result.insertId;
    };

    static async update({userID, nome, telefone, dataNasc, localizacao, areaAtuacao, nivelExperiencia, linkedin, github, biografia, fotoPerfil}){
        const sql = `UPDATE user_data SET nome = ?, 
        telefone = ?,
        dataNasc = ?,
        localizacao = ?,
        areaAtuacao = ?,
        nivelExperiencia = ?,
        linkedin = ?,
        github = ?,
        biografia = ?,
        fotoPerfil = ?
        WHERE userID = ?`;

        const result = await query(sql, [userID, nome, telefone, dataNasc, localizacao, areaAtuacao, nivelExperiencia, linkedin, github, biografia, fotoPerfil]);
        return result.affectedRows > 0;
    };

    static async findByUserId(userID){
        const sql = `SELECT * FROM user_data WHERE userID = ?`;
        const result = await query(sql, [userID]);
        return result[0];
    };

    static async delete(userID){
        const sql = `DELTE FROM user_data WHERE userID = ?`;
        const result = await query(sql, [userID]);
        return result.affectedRows > 0;
    };
};

module.exports = User_data
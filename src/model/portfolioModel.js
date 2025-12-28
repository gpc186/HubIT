const { query } = require('../config/database');

class Portfolio {
    static async create({userID, usuarioNome, titulo, descricao, tecnologias, categoria, linkGithub, linkDemo, linkOutros, imagemCapa, imagensAdicionais}){
        const sql = `INSERT INTO portfolio (userID, usuarioNome, titulo, descricao, tecnologias, categoria, linkGithub, linkDemo, linkOutros, imagemCapa, imagensAdicionais, curtidas)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await query(sql, [userID, usuarioNome, titulo, descricao, JSON.stringify(tecnologias || []), categoria, linkGithub, linkDemo, JSON.stringify(linkOutros || []), imagemCapa, JSON.stringify(imagensAdicionais || [])]);
        return result.insertId;
    };

    static async update(portfolioID, {titulo, descricao, tecnologias, categoria, linkGithub, linkDemo, linkOutros, imagemCapa, imagensAdicionais}){
        const sql = `UPDATE portfolio SET titulo, descricao = ?, tecnologias = ?, categoria = ?, linkGithub = ?, linkDemo = ?, linkOutros = ?, imagemCapa = ?, imagensAdicionais = ? WHERE portfolioID = ?`;

        const result = await query(sql, [titulo, descricao, tecnologias, categoria, linkGithub, linkDemo, linkOutros, imagemCapa, imagensAdicionais, portfolioID]);
        return result.affectedRows > 0;
    };

    static async findById(portfolioID){
        const sql = `SELECT * FROM portfolio WHERE portfolioID = ? ORDER BY dataCriacao DESC`;
        return await query(sql, [portfolioID]);
    };

    static async delete(portfolioID){
        const sql = `DELETE FROM portfolio WHERE portfolioID = ?`;
        const result = await query(sql, [portfolioID]);
        return result.affectedRows > 0;
    };
};

module.exports = Portfolio
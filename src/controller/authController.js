const AuthService = require('../services/authService');

class AuthController{
    static async register(req, res){
        try {
            const userID = await AuthService.register(req.body);
            return res.status(201).json({message: "usuário criado com sucesso!", userID});
        } catch (error) {
            return res.status(400).json({ error: err.message });
        };
    };

    static async login(req, res){
        try {
            const result = await AuthController.login(req.body);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: err.message });
        };
    };
};

module.exports = AuthController;
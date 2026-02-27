const AuthService = require('../services/authService');

class AuthController {
    static async register(req, res) {
        try {
            const userID = await AuthService.register(req.body);
            return res.status(201).json({ message: "usuário criado com sucesso!", userID });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        };
    };

    static async login(req, res) {
        try {
            const result = await AuthService.login(req.body);
            return res.json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        };
    };

    static async refresh(req, res) {
        try {
            const refreshToken = req.headers["refresh-token"];

            if (!refreshToken) {
                return res.status(401).json({ error: "Refresh token inexistente!" });
            };

            const newAccessToken = await AuthService.refresh({ refreshToken });

            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        };
    };

    static async logout(req, res) {
        try {
            const userID = req.user.userID;

            const result = await AuthService.logout({ userID });

            return res.status(200).json( result )

        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }
};

module.exports = AuthController;
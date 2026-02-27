const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido!" });
    };

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Formato de token inválido!" });
    };

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token inexistente!" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userID: decoded.userID,
            tipoConta: decoded.tipoConta
        };

        next();

    } catch (error) {
        return res.status(401).json({ error: "Credenciais não são válidas!" })
    };
};

module.exports = authMiddleware;
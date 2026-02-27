const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtil');


class AuthService {
    static async register({ email, senha, tipoConta }) {
        const userExists = await User.findByEmail(email);

        if (userExists) {
            throw new Error("Email já cadastrado!");
        };

        const passwordHash = await bcrypt.hash(senha, 10);

        const userID = await User.createAccount({ email, passwordHash, tipoConta });

        return userID;
    };

    static async login({ email, passwd }) {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Usuário não foi encontrado!');
        };

        const validLogin = await bcrypt.compare(passwd, user.passwd);
        if (!validLogin) {
            throw new Error('Credenciais inválidos!');
        };
        const accessToken = generateAccessToken({
            userID: user.userID,
            tipoConta: user.tipoConta
        });

        const refreshToken = generateRefreshToken({
            userID: user.userID
        });

        const refresh_token_hash = await bcrypt.hash(refreshToken, 10);
        await User.storeRefreshToken(user.userID, refresh_token_hash);
        return {
            accessToken,
            refreshToken,
            user: {
                userID: user.userID,
                tipoConta: user.tipoConta
            }
        };
    };

    static async refresh({ refreshToken }) {
        try {
            const verifiedToken = verifyRefreshToken(refreshToken);

            const { userID } = verifiedToken;

            const user = await User.findById(userID);
            if (!user) {
                throw new Error("Usuário não encontrado!");
            };

            const oldRefreshHash = await User.getRefreshToken(userID);
            if (!oldRefreshHash || !oldRefreshHash.refresh_token_hash) {
                throw new Error("Refresh token inexistente!");
            }

            const validRefreshToken = await bcrypt.compare(refreshToken, oldRefreshHash.refresh_token_hash);
            if (!validRefreshToken) {
                throw new Error("Token não válido!");
            };

            const accessToken = generateAccessToken({
                userID: user.userID,
                tipoConta: user.tipoConta
            });

            return accessToken;
        } catch (error) {
            throw new Error("Refresh inválido!");
        };
    };

    static async logout({ userID }) {
        const user = await User.findById(userID);
        if (!user) {
            throw new Error("Usuário não foi encontrado!");
        };

        await User.clearRefreshToken(userID);
        return { ok: true };
    };
};

module.exports = AuthService
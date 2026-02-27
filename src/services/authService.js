const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

class AuthService {
    static async register({email, senha, tipoUsuario}){

        const userExists = await User.findByEmail(email);
        
        if (userExists){
            throw new AppError("Email já cadastrado!", );
        };

        const passwordHash = await bcrypt.hash(senha, 10);

        const userID = await User.createAccount({email, passwordHash, tipoUsuario});

        return userID;
    };

    static async login({email, passwd}){

        const user = await User.findByEmail(email);;
        if(!user) {
            throw new AppError('Usuário não foi encontrado!');
        };

        const validLogin = await bcrypt.compare(passwd, user.passwd);
        if(!validLogin){
            throw new AppError('Credenciais inválidos!');
        };

        const token = jwt.sign({userID: user.userID, tipoUsuario: user.tipoUsuario}, process.env.JWT_SECRET, {expiresIn: "1d"});
        return {
            token,
            user: {
                userID: user.userID,
                email: user.email,
                tipoUsuario: user.tipoUsuario
            }
        };
    };
};

module.exports = AuthService
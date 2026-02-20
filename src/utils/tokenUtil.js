// generateAccessToken(payload)
// generateRefreshToken(payload)
// verifyAccessToken(token)
// verifyRefreshToken(token)
const jwt = require('jsonwebtoken')

function generateAccessToken({userID, tipoConta}) {
    if (!userID || !tipoConta) {
        throw new Error("generateAccessToken: payload incompleto");
    };
    return jwt.sign({userID, tipoConta}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN});
};


function generateRefreshToken({userID}){
    if(!userID){
        throw new Error('generateRefreshToken: Payload incompleto');
    };
    return jwt.sign({userID}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN});
};

function verifyAccessToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
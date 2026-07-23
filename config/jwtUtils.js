const jwt = require('jsonwebtoken');

const generateToken = (payload, duration) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: duration
    });
};

const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};

const validateToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token invalide ou expiré');
    }
};

module.exports = {
    generateToken,
    decodeToken,
    validateToken
};

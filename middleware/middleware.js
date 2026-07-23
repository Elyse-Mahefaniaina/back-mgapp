const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(403).json({message: "veuillez vous authentifier !", isAuthError: true});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({message: "Token invalid ou éxpiré !"});
        req.user = user;
        return next();
    });
};

module.exports = authenticateToken;

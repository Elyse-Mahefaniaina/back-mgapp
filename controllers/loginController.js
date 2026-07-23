const { generateToken, validateToken } = require('../config/jwtUtils');
const User = require('../models/user/User');

// En production, le front et le back sont sur des domaines différents :
// il faut sameSite:'None' + secure:true pour que le cookie soit envoyé
// en cross-site. En dev local (HTTP), on retombe sur 'Lax' sans secure,
// sinon le navigateur refuse de poser le cookie.
const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax'
};

const accessCookieOptions = {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000
};

const refreshCookieOptions = {
    ...baseCookieOptions,
    path: '/api/auth/refresh-token',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const buildPayload = (user) => ({
    id: user.id,
    matricule: user.matricule
});

const publicUser = (user) => ({
    id: user.id,
    matricule: user.matricule,
    nom: user.nom,
    isPasswordTemp: user.isPasswordTemp
});

const login = async (req, res) => {
    try {
        const { matricule, password } = req.body;
        if (!matricule || !password) {
            return res.status(400).json({ message: "Matricule et mot de passe requis" });
        }

        const user = await User.findOne({
            where: { matricule: matricule.toUpperCase().trim() }
        });

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const validPassword = await user.verifyPassword(password);
        if (!validPassword) return res.status(401).json({ message: "Mot de passe incorrect" });

        const payload = buildPayload(user);
        res.cookie('accessToken', generateToken(payload, '15m'), accessCookieOptions);
        res.cookie('refreshToken', generateToken(payload, '7d'), refreshCookieOptions);

        res.json({
            message: "Connexion réussie",
            user: publicUser(user)
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(403).json({ message: "Refresh token manquant", isAuthError: true });
        }

        let decoded;
        try {
            decoded = validateToken(token);
        } catch (err) {
            return res.status(403).json({ message: "Refresh token invalide ou expiré", isAuthError: true });
        }

        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const payload = buildPayload(user);
        res.cookie('accessToken', generateToken(payload, '15m'), accessCookieOptions);
        res.cookie('refreshToken', generateToken(payload, '7d'), refreshCookieOptions);

        res.json({
            message: "Nouveau token généré",
            user: publicUser(user)
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du renouvellement du token", error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('accessToken', baseCookieOptions);

        res.clearCookie('refreshToken', {
            ...baseCookieOptions,
            path: '/api/auth/refresh-token'
        });

        return res.json({ message: "Déconnexion réussie" });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors du logout" });
    }
};

module.exports = { login, refreshToken, logout };

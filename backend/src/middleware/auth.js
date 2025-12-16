// ═══════════════════════════════════════════════════════════════════════════
// 🔐 MIDDLEWARE D'AUTHENTIFICATION
// ═══════════════════════════════════════════════════════════════════════════

const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Token manquant. Authentification requise.' });
	}

	// Vérifier que le token est valide
	jwt.verify(token, config.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Token invalide ou expiré.' });
		}

		// Token valide : ajouter les infos user à la requête
		req.user = user;
		next(); // Continuer vers la route
	});
};

const requireAdmin = (req, res, next) => {
	if (!req.user || req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
	}
	next();
};

module.exports = {
	authenticateToken,
	requireAdmin
};
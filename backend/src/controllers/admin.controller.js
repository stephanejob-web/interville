const db = require('../database');

/**
 * @apiGroup Admin
 * @apiPermission Admin
 */

/**
 * @api {get} /api/admin/users Liste de tous les utilisateurs
 * @apiName GetAllUsers
 * @apiGroup Admin
 * @apiPermission admin
 * @apiDescription Récupère tous les utilisateurs (sans les mots de passe).
 */
exports.getAllUsers = (req, res) => {
	try {
        // Récupérer tous les users (sans les passwords hashés)
		const users = db.prepare(`
			SELECT id, email, pseudo, city, promo, role, email_verified, account_validated, created_at
			FROM users
			ORDER BY created_at DESC
		`).all();

		res.json({
			message: 'Liste des utilisateurs',
			count: users.length,
			users: users
		});
	}
	catch (error) {
		console.error('❌ Erreur admin users:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

/**
 * @api {get} /api/admin/pending-users Utilisateurs en attente
 * @apiName GetPendingUsers
 * @apiGroup Admin
 * @apiPermission admin
 * @apiDescription Liste les utilisateurs ayant vérifié leur email mais pas encore validés par un admin.
 */
exports.getPendingUsers = (req, res) => {
	try {
		const pendingUsers = db.prepare(`
			SELECT id, email, pseudo, city, promo, role, email_verified, account_validated, created_at
			FROM users
			WHERE account_validated = 0 AND email_verified = 1
			ORDER BY created_at DESC
		`).all();

		res.json({
			message: 'Liste des utilisateurs en attente de validation',
			count: pendingUsers.length,
			pendingUsers: pendingUsers
		});
	} catch (error) {
		console.error('❌ Erreur pending users:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
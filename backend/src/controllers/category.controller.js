const db = require('../database');

/**
 * @apiGroup User
 * @apiPermission Authentifié
 */

/**
 * @api {get} /api/categories Liste de toutes les catégories
 * @apiName GetCategories
 * @apiGroup Categories
 * @apiDescription Récupère toutes les catégories disponibles (id, nom, description).
 * @apiSuccess {String} message Message de succès.
 * @apiSuccess {Number} count Nombre de catégories trouvées.
 * @apiSuccess {Object[]} categories Liste des objets catégories.
 * @apiError (500) {String} error Erreur serveur.
 */
exports.getAllCategories = (req, res) => {
	try {
		// Récupérer toutes les catégories
		const categories = db.prepare(`
			SELECT * FROM categories ORDER BY name ASC
		`).all();

		// Renvoyer la réponse
		res.json({
			message: 'Liste des catégories',
			count: categories.length,
			categories: categories
		});

	} catch (error) {
		console.error('❌ Erreur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
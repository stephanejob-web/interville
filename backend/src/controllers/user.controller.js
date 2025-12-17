/**
 * @apiGroup User
 * @apiPermission Authentifié
 */

/**
 * @api {get} /api/profile Voir son profil
 * @apiName GetProfile
 * @apiGroup User
 * @apiDescription Récupère les informations de l'utilisateur connecté à partir de son jeton JWT.
 * * @apiHeader {String} Authorization Jeton JWT (Format: Bearer TOKEN).
 *
 * @apiSuccess {String} message Message de succès.
 * @apiSuccess {Object} user Informations contenues dans le token (id, pseudo, email, role, etc.).
 *
 * @apiError (401) {String} error Token manquant ou invalide.
 */
exports.getProfile = (req, res) => {
    // req.user contient les infos décodées du token JWT
	res.json({
		message: 'Voici ton profil',
		user: req.user
	});
};
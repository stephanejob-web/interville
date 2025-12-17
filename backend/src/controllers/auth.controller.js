const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database'); // Our new database index
const config = require('../config');


/**
 * @api {post} /api/register Inscription d'un nouvel utilisateur
 * @apiName Register
 * @apiGroup Auth
 * @apiDescription Crée un nouveau compte utilisateur. Seules les adresses e-mail @laplateforme.io sont acceptées.
 *
 * @apiBody {String} email Email de l'utilisateur (doit se terminer par @laplateforme.io).
 * @apiBody {String} password Mot de passe de l'utilisateur en clair.
 * @apiBody {String} pseudo Nom d'affichage de l'utilisateur.
 * @apiBody {String} city Ville de l'utilisateur.
 * @apiBody {String} promo Promotion de l'utilisateur.
 *
 * @apiSuccess (201) {String} message Message de succès.
 * @apiSuccess (201) {Number} userId ID de l'utilisateur créé.
 *
 * @apiError (400) {String} error Champs manquants, domaine d'e-mail invalide ou e-mail déjà utilisé.
 * @apiError (500) {String} error Erreur interne du serveur.
 */
exports.register = async (req, res) => {
	try {
		const { email, password, pseudo, city, promo } = req.body;

		// VALIDATION : Vérifier que tous les champs sont présents
		if (!email || !password || !pseudo || !city || !promo) {
			return res.status(400).json({
				error: 'Tous les champs sont requis'
			});
		}

		// VALIDATION : Vérifier que l'email est @laplateforme.io
		if (!email.endsWith('@laplateforme.io')) {
			return res.status(400).json({
				error: 'Seules les adresses @laplateforme.io sont acceptées'
			});
		}

		// VALIDATION : Vérifier si l'email n'est pas déjà utilisé
		const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
		if (existingUser) {
			return res.status(400).json({
				error: 'Cet email est déjà utilisé'
			});
		}

		// SÉCURITÉ : Hasher le mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		// INSERTION : Créer le compte dans la base de données
		const result = db.prepare(`
			INSERT INTO users (email, password, pseudo, city, promo, role, email_verified, account_validated)
			VALUES (?, ?, ?, ?, ?, 'user', 0, 0)
		`).run(email, hashedPassword, pseudo, city, promo);

		// SUCCÈS : Compte créé
		res.status(201).json({
			message: 'Inscription réussie ! Votre compte doit être validé par un administrateur.',
			userId: result.lastInsertRowid
		});

	}
	catch (error) {
		console.error('❌ Erreur lors de l\'inscription:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};


/**
 * @api {post} /api/login Connexion d'un utilisateur
 * @apiName Login
 * @apiGroup Auth
 * @apiDescription Authentifie un utilisateur et renvoie un jeton JWT. Le compte doit être validé par un administrateur.
 *
 * @apiBody {String} email Email de l'utilisateur.
 * @apiBody {String} password Mot de passe de l'utilisateur.
 *
 * @apiSuccess {String} message Message de succès.
 * @apiSuccess {String} token Jeton d'authentification JWT.
 * @apiSuccess {Object} user Informations sur le profil de l'utilisateur.
 *
 * @apiError (400) {String} error Email et mot de passe requis.
 * @apiError (401) {String} error Identifiants invalides.
 * @apiError (403) {String} error Compte en cours de validation par un administrateur.
 * @apiError (500) {String} error Erreur interne du serveur.
 */
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// VALIDATION : Vérifier que les champs sont présents
		if (!email || !password) {
			return res.status(400).json({
				error: 'Email et mot de passe requis'
			});
		}

		// RECHERCHE : Trouver l'utilisateur dans la base
		const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

		// VALIDATION : Vérifier que l'utilisateur existe
		if (!user) {
			return res.status(401).json({
				error: 'Email ou mot de passe incorrect'
			});
		}

		// VALIDATION : Vérifier que le compte est validé par un admin
		if (!user.account_validated) {
			return res.status(403).json({
				error: 'Votre compte n\'a pas encore été validé par un administrateur'
			});
		}

		// SÉCURITÉ : Vérifier le mot de passe
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({
				error: 'Email ou mot de passe incorrect'
			});
		}

		// GÉNÉRATION : Créer un token JWT valable 24h
		const token = jwt.sign(
		{
			userId: user.id,
			email: user.email,
			pseudo: user.pseudo,
			role: user.role,
			city: user.city,
			promo: user.promo
		},
		config.JWT_SECRET,
		{ expiresIn: config.JWT_EXPIRES_IN }
		);

		// SUCCÈS : Renvoyer le token et les infos user
		res.json({
			message: 'Connexion réussie !',
			token: token,
			user: {
				id: user.id,
				pseudo: user.pseudo,
				email: user.email,
				city: user.city,
				promo: user.promo,
				role: user.role
			}
		});

	}
	catch (error) {
		console.error('❌ Erreur lors de la connexion:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
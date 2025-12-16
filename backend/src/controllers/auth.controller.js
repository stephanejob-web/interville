const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database'); // Our new database index
const config = require('../config');

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
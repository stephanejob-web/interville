// src/controllers/challenge.controller.js
const db = require('../database');

/**
 * @api {get} /api/challenges Liste légère des défis
 * @apiName GetChallenges
 * @apiGroup Challenges
 * @apiDescription Récupère tous les défis avec infos de base, auteur, catégorie et compteurs.
 * @apiHeader {String} Authorization Bearer TOKEN
 * @apiSuccess {Object[]} challenges Liste des défis
 * @apiError (500) {String} error Erreur interne du serveur.
 */
 /* Note : N'inclut PAS le détail des commentaires/likes/participations
 *        Pour ça, utilise GET /api/challenges/:id
 */
exports.getAllChallenges = (req, res) => {
	try {
		const currentUserId = req.user.userId;

		// Récupérer la liste avec compteurs (optimisé pour la page d'accueil)
		const challenges = db.prepare(`
			SELECT
				-- Infos du challenge
				c.*,

				-- Infos de l'auteur
				u.id as author_id,
				u.pseudo as author_pseudo,
				u.city as author_city,
				u.promo as author_promo,
				u.avatar_url as author_avatar,

				-- Infos de la catégorie
				cat.name as category_name,
				cat.description as category_description,

				-- Compteurs
				COUNT(DISTINCT l.id) as likes_count,
				CASE WHEN ul.id IS NOT NULL THEN 1 ELSE 0 END as user_has_liked,
				(SELECT COUNT(*) FROM comments WHERE challenge_id = c.id) as comments_count,
				(SELECT COUNT(*) FROM participations WHERE challenge_id = c.id) as participations_count

			FROM challenges c
			JOIN users u ON c.user_id = u.id
			JOIN categories cat ON c.category_id = cat.id
			LEFT JOIN likes l ON c.id = l.challenge_id
			LEFT JOIN likes ul ON c.id = ul.challenge_id AND ul.user_id = ?
			GROUP BY c.id
			ORDER BY c.created_at DESC
		`).all(currentUserId);

		res.json({
			message: 'Liste des challenges',
			count: challenges.length,
			challenges: challenges
		});

	}
	catch (error) {
		console.error('❌ Erreur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

/**
 * @api {get} /api/challenges/:id Détails complets d'un défi
 * @apiName GetChallengeById
 * @apiGroup Challenges
 * @apiDescription Récupère un défi avec ses commentaires, participations et likes.
 * @apiHeader {String} Authorization Bearer TOKEN
 * @apiParam {Number} id ID du défi
 * @apiSuccess {Object} challenge Détails complets du défi
 * @apiError (404) {String} error Challenge introuvable.
 * @apiError (500) {String} error Erreur interne du serveur.
 */
exports.getChallengeById = (req, res) => {
	try {
		const challengeId = req.params.id;
		const currentUserId = req.user.userId;

		// ÉTAPE 1 : Récupérer le challenge avec infos de base
		const challenge = db.prepare(`
			SELECT
				c.*,
				u.id as author_id,
				u.pseudo as author_pseudo,
				u.city as author_city,
				u.promo as author_promo,
				u.avatar_url as author_avatar,
				cat.name as category_name,
				cat.description as category_description,
				COUNT(DISTINCT l.id) as likes_count,
				CASE WHEN ul.id IS NOT NULL THEN 1 ELSE 0 END as user_has_liked
			FROM challenges c
			JOIN users u ON c.user_id = u.id
			JOIN categories cat ON c.category_id = cat.id
			LEFT JOIN likes l ON c.id = l.challenge_id
			LEFT JOIN likes ul ON c.id = ul.challenge_id AND ul.user_id = ?
			WHERE c.id = ?
			GROUP BY c.id
		`).get(currentUserId, challengeId);

		// Vérifier que le challenge existe
		if (!challenge) {
			return res.status(404).json({ error: 'Challenge introuvable' });
		}

		// ÉTAPE 2 : Récupérer tous les commentaires
		const comments = db.prepare(`
			SELECT
				com.id,
				com.content,
				com.created_at,
				com.updated_at,
				u.id as user_id,
				u.pseudo,
				u.avatar_url,
				u.city,
				u.promo
			FROM comments com
			JOIN users u ON com.user_id = u.id
			WHERE com.challenge_id = ?
			ORDER BY com.created_at DESC
		`).all(challengeId);

		// ÉTAPE 3 : Récupérer toutes les participations
		const participations = db.prepare(`
			SELECT
				p.id,
				p.status,
				p.proof_url,
				p.completed_at,
				p.created_at,
				p.updated_at,
				u.id as user_id,
				u.pseudo,
				u.avatar_url,
				u.city,
				u.promo
			FROM participations p
			JOIN users u ON p.user_id = u.id
			WHERE p.challenge_id = ?
			ORDER BY p.created_at DESC
		`).all(challengeId);

		// ÉTAPE 4 : Récupérer tous les utilisateurs qui ont liké
		const likedBy = db.prepare(`
			SELECT
				u.id as user_id,
				u.pseudo,
				u.avatar_url,
				u.city,
				u.promo,
				l.created_at
			FROM likes l
			JOIN users u ON l.user_id = u.id
			WHERE l.challenge_id = ?
			ORDER BY l.created_at DESC
		`).all(challengeId);

		// RÉPONSE : Envoyer tout en une seule fois
		res.json({
			message: 'Détails du challenge',
			challenge: {
				...challenge,
				comments_count: comments.length,
				comments: comments,
				participations_count: participations.length,
				participations: participations,
				liked_by: likedBy
			}
		});

	}
	catch (error) {
		console.error('❌ Erreur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

/**
 * @api {post} /api/challenges Créer un défi
 * @apiName CreateChallenge
 * @apiGroup Challenges
 * @apiDescription Permet à un utilisateur connecté de créer un nouveau défi.
 * @apiHeader {String} Authorization Bearer TOKEN
 * @apiParam {Object} body Données du défi
 * @apiError (400) {String} error Champs obligatoires manquants ou invalides.
 * @apiError (404) {String} error Catégorie introuvable.
 * @apiError (500) {String} error Erreur interne du serveur.
 */
exports.createChallenge = (req, res) => {
	try {
		// ÉTAPE 1 : Récupérer les données du body et du token
		const { title, description, category_id, difficulty, image_url, video_url } = req.body;
		const userId = req.user.userId;  // L'utilisateur connecté (vient du token JWT)

		// VALIDATION : Vérifier les champs obligatoires
		if (!title || !description || !category_id || !difficulty) {
			return res.status(400).json({
				error: 'Les champs title, description, category_id et difficulty sont obligatoires'
			});
		}

		// VALIDATION : Vérifier que la difficulté est valide
		const validDifficulties = ['facile', 'moyen', 'difficile'];
		if (!validDifficulties.includes(difficulty)) {
			return res.status(400).json({
				error: 'La difficulté doit être "facile", "moyen" ou "difficile"'
			});
		}

		// VALIDATION : Vérifier que la catégorie existe
		const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
		if (!category) {
			return res.status(404).json({
				error: 'Catégorie introuvable. Les IDs valides sont de 1 à 10.'
			});
		}

		// ÉTAPE 2 : Insérer le challenge en base de données
		const result = db.prepare(`
			INSERT INTO challenges (title, description, category_id, difficulty, user_id, image_url, video_url)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`).run(title, description, category_id, difficulty, userId, image_url || null, video_url || null);

		const challengeId = result.lastInsertRowid;

		// ÉTAPE 3 : Récupérer le challenge créé avec toutes les infos
		const challenge = db.prepare(`
			SELECT
				c.*,
				u.id as author_id,
				u.pseudo as author_pseudo,
				u.city as author_city,
				u.promo as author_promo,
				u.avatar_url as author_avatar,
				cat.name as category_name,
				cat.description as category_description
			FROM challenges c
			JOIN users u ON c.user_id = u.id
			JOIN categories cat ON c.category_id = cat.id
			WHERE c.id = ?
		`).get(challengeId);

		// SUCCÈS : Retourner le challenge créé
		res.status(201).json({
			message: 'Challenge créé avec succès !',
			challenge: challenge
		});

	}
	catch (error) {
		console.error('❌ Erreur lors de la création du challenge:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

/**
 * @api {post} /api/challenges/:id/like Liker/Unliker (Toggle)
 * @apiName LikeChallenge
 * @apiGroup Challenges
 * @apiDescription Permet à un utilisateur de liker ou unliker un défi (fonction toggle).
 * @apiHeader {String} Authorization Bearer TOKEN
 * @apiParam {Number} id ID du challenge à liker/unliker
 * @apiSuccess {String} message Message de succès
 * @apiSuccess {Boolean} liked true si liké, false si unliké
 * @apiSuccess {Number} likes_count Nombre total de likes après l'action
 * @apiError (404) {String} error Challenge introuvable.
 * @apiError (500) {String} error Erreur interne du serveur.
 */
exports.likeChallenge = (req, res) => {
	try {
		const challengeId = req.params.id;
		const userId = req.user.userId;

        // VALIDATION : Vérifier que le challenge existe
		const challenge = db.prepare('SELECT id FROM challenges WHERE id = ?').get(challengeId);
		if (!challenge) {
			return res.status(404).json({ error: 'Challenge introuvable' });
		}

        // VÉRIFICATION : Est-ce que l'utilisateur a déjà liké ?
		const existingLike = db.prepare(
			'SELECT id FROM likes WHERE user_id = ? AND challenge_id = ?'
			).get(userId, challengeId);

		if (existingLike) {
            // CAS 1 : Déjà liké → UNLIKER
			db.prepare('DELETE FROM likes WHERE id = ?').run(existingLike.id);

            // Compter les likes restants
			const likesCount = db.prepare(
				'SELECT COUNT(*) as count FROM likes WHERE challenge_id = ?'
				).get(challengeId);

			return res.json({
				message: 'Like retiré',
				liked: false,
				likes_count: likesCount.count
			});

		} else {
            // CAS 2 : Pas encore liké → LIKER
			db.prepare(
				'INSERT INTO likes (user_id, challenge_id) VALUES (?, ?)'
				).run(userId, challengeId);

            // Compter les likes
			const likesCount = db.prepare(
				'SELECT COUNT(*) as count FROM likes WHERE challenge_id = ?'
				).get(challengeId);

			return res.json({
				message: 'Challenge liké',
				liked: true,
				likes_count: likesCount.count
			});
		}

	}
	catch (error) {
		console.error('❌ Erreur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

/**
 * @api {get} /api/challenges/:id/participants - Liste des participants d'un challenge
 * @apiName GetChallengeParticipants
 * @apiGroup Challenges
 * @apiHeader {String} Authorization Bearer TOKEN
 * @apiParam {Number} id ID du challenge
 * @apiSuccess {Object} challenge Liste des participants du challenge
 * @apiError (404) {String} error Challenge introuvable.
 * @apiError (500) {String} error Erreur interne du serveur.
 */
exports.getParticipants = (req, res) => {
	try {
		const challengeId = req.params.id;

		// ÉTAPE 1 : Récupérer le challenge avec infos de base
		const challenge = db.prepare(`
			SELECT c.*
			FROM challenges c
			WHERE c.id = ?
		`).get(challengeId);

		// Vérifier que le challenge existe
		if (!challenge) {
			return res.status(404).json({ error: 'Challenge introuvable' });
		}


		// ÉTAPE 2 : Récupérer toutes les participations
		const participations = db.prepare(`
			SELECT
				p.id,
				p.status,
				p.proof_url,
				p.completed_at,
				p.created_at,
				p.updated_at,
				u.id as user_id,
				u.pseudo,
				u.avatar_url,
				u.city,
				u.promo
			FROM participations p
			JOIN users u ON p.user_id = u.id
			WHERE p.challenge_id = ?
			ORDER BY p.created_at DESC
		`).all(challengeId);

		// RÉPONSE : Envoyer tout en une seule fois
		res.json({
			message: 'Participants du challenge',
			challenge: {
				participations_count: participations.length,
				participations: participations
			}
		});

	}
	catch (error) {
		console.error('Erreur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

/**
 * @api {put} /api/challenges/:id Modifier un challenge
 * @apiName UpdateChallenge
 * @apiGroup Challenges
 * @apiDescription Permet de modifier un défi existant.
 * @apiHeader {String} Authorization Bearer TOKEN
 * @apiParam {Number} id ID du défi à modifier
 * @apiParam {Object} body Données du défi à modifier
 * @apiError (400) {String} error Champs obligatoires manquants.
 * @apiError (500) {String} error Erreur interne du serveur.
 */
exports.updateChallenge = (req, res) => {
	try {
		const challengeId = req.params.id;
		const { title, description, category_id, difficulty, image_url, video_url } = req.body;

		if (!title || !description || !category_id || !difficulty) {
			return res.status(400).json({ error: 'Tous les champs sont requis' });
		}

		db.prepare(`
			UPDATE challenges
			SET title = ?, description = ?, category_id = ?, difficulty = ?, image_url = ?, video_url = ?
			WHERE id = ?
		`).run(title, description, category_id, difficulty, image_url || null, video_url || null, challengeId);

		res.json({ message: 'Challenge modifié' });

	}
	catch (error) {
		console.error('Erreur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};

/**
 * @api {delete} /api/challenges/:id Supprimer un défi
 * @apiName DeleteChallenge
 * @apiGroup Challenges
 * @apiDescription Permet de supprimer un défi existant.
 * @apiHeader {String} Authorization Bearer TOKEN
 * @apiParam {Number} id ID du défi à supprimer
 * @apiError (500) {String} error Erreur interne du serveur.
 */
exports.deleteChallenge = (req, res) => {
	try {
		const challengeId = req.params.id;
		db.prepare('DELETE FROM challenges WHERE id = ?').run(challengeId);
		res.json({ message: 'Challenge supprimé' });
	}
	catch (error) {
		console.error('Erreur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
};
// ═══════════════════════════════════════════════════════════════════════════
// 📦 IMPORTS - Tous les modules nécessaires pour le serveur
// ═══════════════════════════════════════════════════════════════════════════

const express = require('express');           // Framework web pour créer l'API
const cors = require('cors');                 // Permet les requêtes depuis le frontend
const bcrypt = require('bcrypt');             // Pour hasher les mots de passe
const jwt = require('jsonwebtoken');          // Pour créer et vérifier les tokens JWT
const Database = require('better-sqlite3');   // Base de données SQLite
const path = require('path');                 // Pour gérer les chemins de fichiers
require('dotenv').config();                   // Charger les variables d'environnement


// ═══════════════════════════════════════════════════════════════════════════
//  CONFIGURATION - Paramètres du serveur
// ═══════════════════════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 3000;  // Port du serveur (3000 par défaut)

// Configuration JWT (tokens d'authentification)
const JWT_SECRET = 'votre_super_secret_key_a_changer_en_production_2024';
const JWT_EXPIRES_IN = '24h';  // Les tokens sont valables 24 heures


// ═══════════════════════════════════════════════════════════════════════════
//   BASE DE DONNÉES - Connexion à SQLite
// ═══════════════════════════════════════════════════════════════════════════

const dbPath = path.join(__dirname, 'database', 'interville.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');  // Active les clés étrangères pour l'intégrité des données


// ═══════════════════════════════════════════════════════════════════════════
//  MIDDLEWARE - Configuration Express
// ═══════════════════════════════════════════════════════════════════════════

// CORS : Autorise les requêtes depuis le frontend React
app.use(cors({
    origin: 'http://localhost:5173',  // URL du frontend Vite
    credentials: true                  // Autorise l'envoi de cookies
}));

// Parser JSON : Permet de lire les données JSON dans req.body
app.use(express.json());


// ═══════════════════════════════════════════════════════════════════════════
// 🔐 MIDDLEWARE D'AUTHENTIFICATION
// ═══════════════════════════════════════════════════════════════════════════

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token manquant. Authentification requise.' });
    }

    // Vérifier que le token est valide
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide ou expiré.' });
        }

        // Token valide : ajouter les infos user à la requête
        req.user = user;
        next();  // Continuer vers la route
    });
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
    }
    next();
};


// ═══════════════════════════════════════════════════════════════════════════
// ROUTES PUBLIQUES (pas besoin de token)
// ═══════════════════════════════════════════════════════════════════════════


app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur le serveur Interville!' });
});


app.post('/api/register', async (req, res) => {
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

    } catch (error) {
        console.error('❌ Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/login', async (req, res) => {
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
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
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

    } catch (error) {
        console.error('❌ Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// ═══════════════════════════════════════════════════════════════════════════
//  ROUTES PROTÉGÉES - Nécessitent un token JWT valide
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/profile - Voir son profil
 *
 * Headers requis :
 * - Authorization: Bearer TOKEN
 *
 * Retourne : Les infos du token (id, pseudo, email, etc.)
 */
app.get('/api/profile', authenticateToken, (req, res) => {
    // req.user contient les infos décodées du token JWT
    res.json({
        message: 'Voici ton profil',
        user: req.user
    });
});


/**
 * GET /api/users - Liste de tous les utilisateurs (ADMIN UNIQUEMENT)
 *
 * Headers requis :
 * - Authorization: Bearer TOKEN (avec role admin)
 *
 * Retourne : Tous les utilisateurs de la plateforme
 */
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
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

    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


/**
 * GET /api/challenges - Liste LÉGÈRE de tous les challenges
 *
 * Headers requis :
 * - Authorization: Bearer TOKEN
 *
 * Retourne :
 * - Tous les challenges avec infos de base
 * - Infos de l'auteur (pseudo, city, promo)
 * - Infos de la catégorie
 * - Compteurs (likes, comments, participations)
 *
 * Note : N'inclut PAS le détail des commentaires/likes/participations
 *        Pour ça, utilise GET /api/challenges/:id
 */
app.get('/api/challenges', authenticateToken, (req, res) => {
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

    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


/**
 * GET /api/challenges/:id - Détails COMPLETS d'un challenge
 *
 * Headers requis :
 * - Authorization: Bearer TOKEN
 *
 * Paramètres :
 * - id : ID du challenge
 *
 * Retourne :
 * - Toutes les infos du challenge
 * - TOUS les commentaires (avec infos des auteurs)
 * - TOUTES les participations (avec infos des participants)
 * - TOUS les likes (liste des users qui ont liké)
 */
app.get('/api/challenges/:id', authenticateToken, (req, res) => {
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

    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * POST /api/challenges/ - Creer un challegnes
 *
 * Headers requis :
 * - Authorization: Bearer TOKEN
 *
 * Paramètres :
 *      - title
 *     - description
 *     - category_id
 *     - difficulty
 *     - user_id (utilisateur connecté)
 *     - image_url (peut être NULL)
 *     - video_url (peut être NULL)
 *
 * */

app.post('/api/challenges', authenticateToken, (req, res) => {
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

    } catch (error) {
        console.error('❌ Erreur lors de la création du challenge:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
})


/**
 * POST /api/challenges/:id/like - Liker/Unliker un challenge (toggle)
 *
 * Headers requis :
 * - Authorization: Bearer TOKEN
 *
 * Paramètres :
 * - id : ID du challenge à liker
 *
 * Comportement :
 * - Si pas encore liké → Ajoute un like
 * - Si déjà liké → Retire le like
 *
 * Retourne :
 * - liked : boolean (true si liké, false si unliké)
 * - likes_count : nombre total de likes
 */
app.post('/api/challenges/:id/like', authenticateToken, (req, res) => {
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

    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

/**
 * GET /api/categories - Liste de toutes les catégories
 *
 * Headers requis :
 * - Authorization: Bearer TOKEN
 *
 * Retourne :
 * - Toutes les catégories disponibles (id, name, description)
 */
app.get('/api/categories', authenticateToken, (req, res) => {
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
})

// ═══════════════════════════════════════════════════════════════════════════
//  DÉMARRAGE DU SERVEUR
// ═══════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════');
    console.log(`✅ Serveur Interville démarré sur le port ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log('═══════════════════════════════════════════');
});

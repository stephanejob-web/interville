const express = require('express');
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// JWT Configuration
const JWT_SECRET = 'votre_super_secret_key_a_changer_en_production_2024';
const JWT_EXPIRES_IN = '24h';

// Connexion à la base de données
const dbPath = path.join(__dirname, 'database', 'interville.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // URL du frontend Vite
    credentials: true
}));
app.use(express.json());

// ========================================
// MIDDLEWARE : Vérification du token JWT
// ========================================
const authenticateToken = (req, res, next) => {
    // 1. Récupérer le token depuis le header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    // 2. Si pas de token, accès refusé
    if (!token) {
        return res.status(401).json({ error: 'Token manquant. Authentification requise.' });
    }

    // 3. Vérifier le token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide ou expiré.' });
        }

        // 4. Ajouter les infos de l'utilisateur à la requête
        req.user = user;
        next(); // Passer au prochain middleware/route
    });
};

// ========================================
// MIDDLEWARE : Vérifier si l'utilisateur est admin
// ========================================
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
    }
    next();
};

// Route de test (publique)
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur le serveur Interville!' });
});


// ========================================
// ROUTE : INSCRIPTION (Register)
// ========================================

app.post('/api/register', async (req, res) => {
    try {
        // 1. Récupérer les données envoyées par l'utilisateur
        const { email, password, pseudo, city, promo } = req.body;

        // 2. Vérifier que tous les champs sont remplis
        if (!email || !password || !pseudo || !city || !promo) {
            return res.status(400).json({
                error: 'Tous les champs sont requis'
            });
        }

        // 3. Vérifier que l'email est @laplateforme.io
        if (!email.endsWith('@laplateforme.io')) {
            return res.status(400).json({
                error: 'Seules les adresses @laplateforme.io sont acceptées'
            });
        }

        // 4. Vérifier si l'email existe déjà
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (existingUser) {
            return res.status(400).json({
                error: 'Cet email est déjà utilisé'
            });
        }

        // 5. Hasher le mot de passe (pour la sécurité)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Insérer le nouvel utilisateur dans la base de données
        const result = db.prepare(`
      INSERT INTO users (email, password, pseudo, city, promo, role, email_verified, account_validated)
      VALUES (?, ?, ?, ?, ?, 'user', 0, 0)
    `).run(email, hashedPassword, pseudo, city, promo);

        res.status(201).json({
            message: 'Inscription réussie ! Votre compte doit être validé par un administrateur.',
            userId: result.lastInsertRowid
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ========================================
// ROUTE : CONNEXION (Login)
// ========================================
app.post('/api/login', async (req, res) => {
    try {
        // 1. Récupérer l'email et le mot de passe
        const { email, password } = req.body;

        // 2. Vérifier que les champs sont remplis
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email et mot de passe requis'
            });
        }

        // 3. Chercher l'utilisateur dans la base de données
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        // 4. Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(401).json({
                error: 'Email ou mot de passe incorrect'
            });
        }

        // 5. Vérifier si le compte est validé
        if (!user.account_validated) {
            return res.status(403).json({
                error: 'Votre compte n\'a pas encore été validé par un administrateur'
            });
        }

        // 6. Comparer le mot de passe avec bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Email ou mot de passe incorrect'
            });
        }

        // 7. Créer un JWT token
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

        // 8. Répondre avec le token
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
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ========================================
// ROUTE PROTÉGÉE : Profil utilisateur
// ========================================
app.get('/api/profile', authenticateToken, (req, res) => {
    // req.user contient les infos du token JWT
    res.json({
        message: 'Voici ton profil',
        user: req.user
    });
});

// ========================================
// ROUTE PROTÉGÉE : Liste des utilisateurs (ADMIN ONLY)
// ========================================
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    try {
        const users = db.prepare(`
            SELECT id, email, pseudo, city, promo, role, email_verified, account_validated, created_at
            FROM users
        `).all();

        res.json({
            message: 'Liste des utilisateurs',
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ========================================
// ROUTE PROTÉGÉE : Liste des challenges
// ========================================
app.get('/api/challenges', authenticateToken, (req, res) => {
    try {
        const challenges = db.prepare(`
            SELECT
                c.*,
                u.pseudo as author_pseudo,
                cat.name as category_name
            FROM challenges c
            JOIN users u ON c.user_id = u.id
            JOIN categories cat ON c.category_id = cat.id
            ORDER BY c.created_at DESC
        `).all();

        res.json({
            message: 'Liste des challenges',
            count: challenges.length,
            challenges: challenges
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

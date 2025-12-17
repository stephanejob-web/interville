// ═══════════════════════════════════════════════════════════════════════════
// 📦 IMPORTS - Tous les modules nécessaires pour le serveur
// ═══════════════════════════════════════════════════════════════════════════

const express = require('express');           // Framework web pour créer l'API
const config = require('./src/config');		  // Charger les variables d'environnement
const cors = require('cors');                 // Permet les requêtes depuis le frontend
const http = require("http");                 // Pour créer le serveur HTTP
const { Server } = require('socket.io');      // Pour Socket.IO
const { authenticateToken, requireAdmin } = require('./src/middleware/auth'); // Middleware d'authentification
const chatSocket = require('./src/socket/chat.socket'); // Gestion du chat Socket.IO
const db = require('./src/database');         // Importer la connexion à la base de données
const app = express();
const authRoutes = require('./src/routes/auth.routes');
const challengeRoutes = require('./src/routes/challenge.routes');
const categoryRoutes = require('./src/routes/category.routes');



// ═══════════════════════════════════════════════════════════════════════════
// 🔌 SOCKET.IO - Configuration du serveur WebSocket
// ═══════════════════════════════════════════════════════════════════════════

const serveurHTTP = http.createServer(app)

const io = new Server(serveurHTTP, {
	cors: config.CORS_OPTIONS
})

chatSocket(io);  // Initialiser le chat Socket.IO

// ═══════════════════════════════════════════════════════════════════════════
//  MIDDLEWARE - Configuration Express
// ═══════════════════════════════════════════════════════════════════════════

// CORS : Autorise les requêtes depuis le frontend React (et ngrok)
app.use(cors(config.CORS_OPTIONS));

// Parser JSON : Permet de lire les données JSON dans req.body
app.use(express.json());


// ═══════════════════════════════════════════════════════════════════════════
// ROUTES PUBLIQUES (pas besoin de token)
// ═══════════════════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
	res.json({ message: 'Bienvenue sur le serveur Interville!' });
});
app.use('/api', authRoutes);


// ═══════════════════════════════════════════════════════════════════════════
//  ROUTES PROTÉGÉES - Nécessitent un token JWT valide
// ═══════════════════════════════════════════════════════════════════════════
app.use('/api', challengeRoutes);
app.use('/api', categoryRoutes);
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
 * @api {get} /api/admin/pending-users - Liste des utilisateurs en attente de validation (ADMIN UNIQUEMENT)
 * @apiHeader {String} Authorization Token JWT (Bearer TOKEN)
 * @apiPermission admin
 * @apiSuccess {String} message Message de succès
 * @apiSuccess {Number} count Nombre d'utilisateurs en attente
 * @apiSuccess {Object[]} pendingUsers Liste des utilisateurs en attente avec leurs informations
 * @apiError (401) {String} error Token manquant ou invalide
 * @apiError (403) {String} error Accès refusé. Droits administrateur requis.
 * @apiError (500) {String} error Erreur serveur
 **/

app.get('/api/admin/pending-users', authenticateToken, requireAdmin, (req, res) => {
	try {
        // Récupérer tous les users en attente de validation
		const pendingUsers = db.prepare(`
            SELECT id, email, pseudo, city, promo, role, email_verified, account_validated, created_at
            FROM users
            ORDER BY created_at DESC
            WHERE account_validated = 0 AND email_verified = 1
		`).all();

		res.json({
			message: 'Liste des utilisateurs en attente de validation',
			count: pendingUsers.length,
			pendingUsers: pendingUsers
		});

	} catch (error) {
		console.error('Erreur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});



// ═══════════════════════════════════════════════════════════════════════════
//  DÉMARRAGE DU SERVEUR
// ═══════════════════════════════════════════════════════════════════════════

serveurHTTP.listen(config.PORT, () => {
	console.log(`🚀 Serveur démarré sur http://localhost:${config.PORT}`)
	console.log(`🔌 Socket.IO prêt à accepter des connexions`)
})

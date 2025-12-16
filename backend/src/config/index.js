// ═══════════════════════════════════════════════════════════════════════════
//  CONFIGURATION - Paramètres du serveur
// ═══════════════════════════════════════════════════════════════════════════

const path = require('path');
require('dotenv').config();                   // Charger les variables d'environnement

// Configuration CORS - Liste des origines autorisées
const allowedOrigins =  process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'];

module.exports = {
	PORT: process.env.PORT || 3000,  // Port du serveur (3000 par défaut)

	JWT_EXPIRES_IN: '24h',  // Les tokens sont valables 24 heures
	JWT_SECRET: process.env.JWT_SECRET || 'votre_super_secret_key_a_changer_en_production_2024',

	DB_PATH: path.join(__dirname, '../../database', 'interville.db'),

	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

	CORS_OPTIONS: {
		origin: (origin, callback) => { // Fonction pour vérifier si l'origine est autorisée
		// Autoriser les requêtes sans origin (mobile apps, Postman, etc.)
			if (!origin) return callback(null, true);

		// Autoriser les domaines ngrok
			if (origin.includes('.ngrok-free.dev') || origin.includes('.ngrok.io')) {
				return callback(null, true);
			}

		// Vérifier si l'origine est dans la liste
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			callback(new Error('Non autorisé par CORS'));
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"]
	}
}
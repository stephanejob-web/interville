const path = require('path');
require('dotenv').config();                   // Charger les variables d'environnement

module.exports = {
	PORT: process.env.PORT || 3000,  // Port du serveur (3000 par défaut)
	ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'], //

	JWT_EXPIRES_IN: '24h',  // Les tokens sont valables 24 heures
	JWT_SECRET: process.env.JWT_SECRET || 'votre_super_secret_key_a_changer_en_production_2024',

	DB_PATH: path.join(__dirname, '../../database', 'interville.db'),

	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
}
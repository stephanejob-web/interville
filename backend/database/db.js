const Database = require('better-sqlite3');
const path = require('path');

// Créer ou ouvrir la base de données
const dbPath = path.join(__dirname, 'interville.db');
const db = new Database(dbPath, { verbose: console.log });

// Activer les contraintes de clés étrangères
db.pragma('foreign_keys = ON');

module.exports = db;

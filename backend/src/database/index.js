// ═══════════════════════════════════════════════════════════════════════════
//   BASE DE DONNÉES - Connexion à SQLite
// ═══════════════════════════════════════════════════════════════════════════

const Database = require('better-sqlite3'); // Base de données SQLite
const config = require('../config');

const db = new Database(config.DB_PATH);
db.pragma('foreign_keys = ON');

console.log('Connexion DB :', config.DB_PATH);

module.exports = db;
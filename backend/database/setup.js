// ============================================
// SETUP - Création du schéma de base de données
// Crée uniquement les tables (pas de données)
// ============================================

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'interville.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('🔧 Création du schéma de base de données...\n');

// ============================================
// Supprimer les anciennes tables
// ============================================
console.log('🗑️  Suppression des anciennes tables...');
db.exec(`
  DROP TABLE IF EXISTS likes;
  DROP TABLE IF EXISTS messages;
  DROP TABLE IF EXISTS comments;
  DROP TABLE IF EXISTS participations;
  DROP TABLE IF EXISTS challenges;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS users;
`);
console.log('✅ Tables supprimées\n');

// ============================================
// Créer les nouvelles tables
// ============================================
console.log('🏗️  Création des nouvelles tables...\n');

// TABLE USERS
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE CHECK(email LIKE '%@laplateforme.io'),
    password TEXT NOT NULL,
    pseudo TEXT NOT NULL,
    city TEXT NOT NULL,
    promo INTEGER NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    email_verified INTEGER DEFAULT 0 CHECK(email_verified IN (0, 1)),
    account_validated INTEGER DEFAULT 0 CHECK(account_validated IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('  ✅ Table users');

// TABLE CATEGORIES
db.exec(`
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('  ✅ Table categories');

// TABLE CHALLENGES
db.exec(`
  CREATE TABLE challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    difficulty TEXT CHECK(difficulty IN ('facile', 'moyen', 'difficile')),
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  )
`);
console.log('  ✅ Table challenges');

// TABLE PARTICIPATIONS
db.exec(`
  CREATE TABLE participations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    status TEXT DEFAULT 'en_cours' CHECK(status IN ('en_cours', 'terminé', 'abandonné')),
    proof_url TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
  )
`);
console.log('  ✅ Table participations');

// TABLE COMMENTS
db.exec(`
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
  )
`);
console.log('  ✅ Table comments');

// TABLE MESSAGES
db.exec(`
  CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);
console.log('  ✅ Table messages');

// TABLE LIKES
db.exec(`
  CREATE TABLE likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
  )
`);
console.log('  ✅ Table likes');

db.close();

console.log('\n✅ Schéma créé avec succès!\n');
console.log('💡 Pour ajouter des données de test: node database/seed.js\n');

module.exports = { dbPath };

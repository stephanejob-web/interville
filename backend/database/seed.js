// ============================================
// SEED - Insertion des données de test
// Ajoute des données pour tester l'application
// ============================================

const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'interville.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('🌱 Insertion des données de test...\n');

// ============================================
// 1. CATEGORIES
// ============================================
console.log('📁 Catégories...');
const categories = [
    ['Code', 'Défis de programmation et développement'],
    ['Cuisine', 'Défis culinaires et recettes'],
    ['Gaming', 'Défis de jeux vidéo'],
    ['Sport', 'Défis sportifs et fitness'],
    ['Photo', 'Défis photographiques'],
    ['Vidéo', 'Défis de création vidéo'],
    ['Musique', 'Défis musicaux'],
    ['Art', 'Défis artistiques'],
    ['Culture', 'Défis culturels'],
    ['DIY', 'Défis de bricolage']
];

const insertCategory = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
categories.forEach(cat => insertCategory.run(cat[0], cat[1]));
console.log(`   ✅ ${categories.length} catégories ajoutées\n`);

// ============================================
// 2. UTILISATEURS
// ============================================
console.log('👤 Utilisateurs...');
const password = bcrypt.hashSync('password123', 10);

const users = [
    ['admin@laplateforme.io', password, 'Admin', 'Marseille', 2024, 'admin', 1, 1],
    ['marie.dubois@laplateforme.io', password, 'MarieDev', 'Paris', 2024, 'user', 1, 1],
    ['lucas.martin@laplateforme.io', password, 'LucasGamer', 'Lyon', 2023, 'user', 1, 1],
    ['emma.bernard@laplateforme.io', password, 'EmmaChef', 'Bordeaux', 2024, 'user', 1, 1],
    ['thomas.petit@laplateforme.io', password, 'ThomasPhoto', 'Marseille', 2023, 'user', 1, 1],
    ['alice.robert@laplateforme.io', password, 'AliceArt', 'Paris', 2024, 'user', 1, 1]
];

const insertUser = db.prepare(`
  INSERT INTO users (email, password, pseudo, city, promo, role, email_verified, account_validated)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
users.forEach(user => insertUser.run(...user));
console.log(`   ✅ ${users.length} utilisateurs ajoutés (mdp: password123)\n`);

// ============================================
// 3. CHALLENGES
// ============================================
console.log('🎯 Challenges...');
const challenges = [
    [2, 1, 'Créer un jeu Snake en JavaScript', 'Développez le jeu classique Snake en utilisant uniquement JavaScript vanilla et Canvas. Le jeu doit avoir un système de score et augmenter en difficulté.', null, null, 'moyen'],
    [3, 3, 'Speedrun Dark Souls en moins de 2h', 'Tentez de finir Dark Souls le plus rapidement possible. Partagez votre temps et votre stratégie!', null, null, 'difficile'],
    [4, 2, 'Cuisiner un plat de votre région', 'Préparez une recette traditionnelle de votre région et partagez les photos du résultat. Bonus si vous donnez la recette!', null, null, 'facile'],
    [5, 5, 'Photo de coucher de soleil', 'Prenez la plus belle photo de coucher de soleil de votre ville. Soyez créatif avec les angles et la composition!', null, null, 'facile'],
    [6, 8, 'Dessiner un portrait en 30 minutes', 'Challenge de dessin rapide : réalisez un portrait (réel ou imaginaire) en maximum 30 minutes. Tous les styles acceptés!', null, null, 'moyen'],
    [2, 1, 'Résoudre 5 katas sur Codewars', 'Résolvez 5 katas de niveau 6 kyu ou plus sur Codewars. Partagez vos solutions les plus élégantes!', null, null, 'moyen'],
    [3, 4, 'Faire 100 pompes en une journée', 'Défi fitness : réalisez 100 pompes dans la journée (en plusieurs séries). Partagez votre progression!', null, null, 'difficile'],
    [4, 2, 'Gâteau au chocolat sans balance', 'Préparez un gâteau au chocolat en utilisant uniquement des mesures approximatives (verres, cuillères). Qui aura le meilleur résultat?', null, null, 'facile'],
    [5, 7, 'Composer une mélodie de 30 secondes', 'Créez une courte mélodie originale avec l\'instrument de votre choix (ou votre voix!). Tous les genres musicaux acceptés.', null, null, 'moyen'],
    [6, 10, 'Fabriquer un objet utile avec du carton', 'Challenge DIY : créez quelque chose d\'utile uniquement avec du carton et du scotch. Organisateur de bureau, support de téléphone, etc.', null, null, 'facile']
];

const insertChallenge = db.prepare(`
  INSERT INTO challenges (user_id, category_id, title, description, image_url, video_url, difficulty)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
challenges.forEach(ch => insertChallenge.run(...ch));
console.log(`   ✅ ${challenges.length} challenges ajoutés\n`);

// ============================================
// 4. PARTICIPATIONS
// ============================================
console.log('🏃 Participations...');
const participations = [
    [3, 1, 'en_cours', null, null],
    [4, 1, 'terminé', 'https://example.com/snake-demo.gif', '2024-12-01 14:30:00'],
    [5, 1, 'en_cours', null, null],
    [2, 2, 'en_cours', null, null],
    [4, 2, 'abandonné', null, null],
    [2, 3, 'terminé', 'https://example.com/bouillabaisse.jpg', '2024-11-28 19:00:00'],
    [5, 3, 'terminé', 'https://example.com/tartiflette.jpg', '2024-11-29 20:15:00'],
    [6, 3, 'en_cours', null, null],
    [2, 4, 'terminé', 'https://example.com/sunset1.jpg', '2024-11-30 18:45:00'],
    [6, 4, 'terminé', 'https://example.com/sunset2.jpg', '2024-12-02 18:30:00'],
    [3, 5, 'en_cours', null, null],
    [4, 5, 'terminé', 'https://example.com/portrait.jpg', '2024-12-01 15:00:00'],
    [3, 6, 'terminé', 'https://codewars.com/users/lucas/completed', '2024-11-27 22:00:00'],
    [4, 6, 'en_cours', null, null],
    [5, 6, 'en_cours', null, null],
    [2, 7, 'en_cours', null, null],
    [5, 7, 'terminé', 'https://example.com/fitness-tracker.jpg', '2024-12-03 21:00:00']
];

const insertParticipation = db.prepare(`
  INSERT INTO participations (user_id, challenge_id, status, proof_url, completed_at)
  VALUES (?, ?, ?, ?, ?)
`);
participations.forEach(p => insertParticipation.run(...p));
console.log(`   ✅ ${participations.length} participations ajoutées\n`);

// ============================================
// 5. COMMENTAIRES
// ============================================
console.log('💬 Commentaires...');
const comments = [
    ['Super idée! Je vais tenter ça ce week-end 🐍', 3, 1],
    ['J\'ai déjà fait Snake en Python, mais JavaScript sera un bon challenge!', 4, 1],
    ['Courage! Dark Souls c\'est pas facile 💪', 2, 2],
    ['Impossible en moins de 2h! Bonne chance 😅', 4, 2],
    ['Miam! Hâte de voir les recettes 😋', 5, 3],
    ['Je vais faire la bouillabaisse marseillaise!', 2, 3],
    ['Belle initiative! La golden hour c\'est magique 📸', 6, 4],
    ['J\'adore le concept du time limit! Ça force à être spontané', 3, 5],
    ['30 minutes c\'est court mais ça rend le résultat plus authentique', 4, 5],
    ['Codewars c\'est top pour s\'entraîner 💻', 4, 6],
    ['100 pompes! Ça va piquer 🔥', 5, 7],
    ['Quelqu\'un veut faire une compétition?', 3, 7],
    ['Le gâteau à l\'instinct, j\'adore! 🎂', 6, 8],
    ['Perso je mets toujours trop de chocolat, tant mieux!', 3, 8]
];

const insertComment = db.prepare(`
  INSERT INTO comments (content, user_id, challenge_id)
  VALUES (?, ?, ?)
`);
comments.forEach(c => insertComment.run(...c));
console.log(`   ✅ ${comments.length} commentaires ajoutés\n`);

// ============================================
// 6. MESSAGES (CHAT)
// ============================================
console.log('💬 Messages du chat...');
const messages = [
    ['Bienvenue sur Interville! 🎉', 1],
    ['Salut tout le monde!', 2],
    ['Qui lance un challenge aujourd\'hui?', 3],
    ['Je viens de terminer le challenge Snake, c\'était génial!', 4],
    ['Bravo Emma! 👏', 2],
    ['Quelqu\'un pour un défi cuisine ce soir?', 5]
];

const insertMessage = db.prepare('INSERT INTO messages (content, user_id) VALUES (?, ?)');
messages.forEach(m => insertMessage.run(...m));
console.log(`   ✅ ${messages.length} messages ajoutés\n`);

// ============================================
// 7. LIKES
// ============================================
console.log('❤️  Likes...');
const likes = [
    [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], // Challenge 1: 5 likes
    [2, 3], [3, 3], [5, 3], [6, 3],         // Challenge 3: 4 likes
    [2, 4], [3, 4], [6, 4],                 // Challenge 4: 3 likes
    [3, 6], [4, 6], [5, 6],                 // Challenge 6: 3 likes
    [2, 7], [4, 7], [5, 7], [6, 7]          // Challenge 7: 4 likes
];

const insertLike = db.prepare('INSERT INTO likes (user_id, challenge_id) VALUES (?, ?)');
likes.forEach(l => insertLike.run(...l));
console.log(`   ✅ ${likes.length} likes ajoutés\n`);

// ============================================
// TERMINÉ !
// ============================================
db.close();

console.log('═══════════════════════════════════════════');
console.log('✅ DONNÉES DE TEST AJOUTÉES !');
console.log('═══════════════════════════════════════════');
console.log('\n📊 Résumé:');
console.log(`  ✅ ${categories.length} catégories`);
console.log(`  ✅ ${users.length} utilisateurs`);
console.log(`  ✅ ${challenges.length} challenges`);
console.log(`  ✅ ${participations.length} participations`);
console.log(`  ✅ ${comments.length} commentaires`);
console.log(`  ✅ ${messages.length} messages`);
console.log(`  ✅ ${likes.length} likes`);
console.log('\n🚀 Base de données prête! Lancez le serveur: npm run dev\n');

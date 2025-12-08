// ============================================
// INIT - Initialisation complète de la base de données
// Exécute setup.js puis seed.js automatiquement
// ============================================

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 INITIALISATION COMPLÈTE DE LA BASE DE DONNÉES\n');
console.log('═══════════════════════════════════════════\n');

try {
    // Étape 1 : Créer le schéma (tables)
    console.log('📋 ÉTAPE 1/2 : Création du schéma\n');
    execSync('node ' + path.join(__dirname, 'setup.js'), { stdio: 'inherit' });

    console.log('\n');

    // Étape 2 : Insérer les données de test
    console.log('📋 ÉTAPE 2/2 : Insertion des données\n');
    execSync('node ' + path.join(__dirname, 'seed.js'), { stdio: 'inherit' });

    console.log('═══════════════════════════════════════════');
    console.log('🎉 INITIALISATION TERMINÉE !');
    console.log('═══════════════════════════════════════════\n');

} catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    process.exit(1);
}

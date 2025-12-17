// ═══════════════════════════════════════════════════════════════════════════
// 📦 IMPORTS - Tous les modules nécessaires pour le serveur
// ═══════════════════════════════════════════════════════════════════════════

const express = require('express');           // Framework web pour créer l'API
const config = require('./src/config');		  // Charger les variables d'environnement
const cors = require('cors');                 // Permet les requêtes depuis le frontend
const http = require("http");                 // Pour créer le serveur HTTP
const { Server } = require('socket.io');      // Pour Socket.IO
const chatSocket = require('./src/socket/chat.socket'); // Gestion du chat Socket.IO
const app = express();
const authRoutes = require('./src/routes/auth.routes');
const challengeRoutes = require('./src/routes/challenge.routes');
const categoryRoutes = require('./src/routes/category.routes');
const userRoutes = require('./src/routes/user.routes');
const adminRoutes = require('./src/routes/admin.routes');


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
app.use('/api', userRoutes);
app.use('/api', adminRoutes);

// ═══════════════════════════════════════════════════════════════════════════
//  DÉMARRAGE DU SERVEUR
// ═══════════════════════════════════════════════════════════════════════════

serveurHTTP.listen(config.PORT, () => {
	console.log(`🚀 Serveur démarré sur http://localhost:${config.PORT}`)
	console.log(`🔌 Socket.IO prêt à accepter des connexions`)
})

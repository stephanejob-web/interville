const express = require('express');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/auth.routes');
const challengeRoutes = require('./routes/challenge.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ═══════════════════════════════════════════════════════════════════════════
//  MIDDLEWARE - Configuration Express
// ═══════════════════════════════════════════════════════════════════════════
app.use(cors(config.CORS_OPTIONS));
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

module.exports = app;
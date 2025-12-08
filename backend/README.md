# 📘 Documentation API - Interville

API REST pour la plateforme de challenges Interville.

---

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Initialiser la base de données
node database/init.js

# Lancer le serveur
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

---

## 🔐 Authentification

L'API utilise des **tokens JWT** (JSON Web Tokens) pour sécuriser les routes.

### Comment ça marche ?

1. Tu te connectes avec `/api/login`
2. Tu reçois un **token** valable 24h
3. Tu envoies ce token dans le header `Authorization` pour accéder aux routes protégées

**Format du header :**
```
Authorization: Bearer TON_TOKEN_ICI
```

---

## 📍 Routes disponibles

### 🟢 Routes publiques (pas besoin de token)

#### **GET /**
Message de bienvenue

**Exemple :**
```bash
curl http://localhost:3000/
```

**Réponse :**
```json
{
  "message": "Bienvenue sur le serveur Interville!"
}
```

---

#### **POST /api/register**
Créer un nouveau compte

**Body (JSON) :**
```json
{
  "email": "test@laplateforme.io",
  "password": "monmotdepasse",
  "pseudo": "TestUser",
  "city": "Marseille",
  "promo": 2024
}
```

**Règles :**
- Email doit finir par `@laplateforme.io`
- Tous les champs sont requis
- Le compte sera en attente de validation par un admin

**Réponse (201) :**
```json
{
  "message": "Inscription réussie ! Votre compte doit être validé par un administrateur.",
  "userId": 7
}
```

**Erreurs possibles :**
- `400` - Champs manquants
- `400` - Email non autorisé
- `400` - Email déjà utilisé

---

#### **POST /api/login**
Se connecter et obtenir un token

**Body (JSON) :**
```json
{
  "email": "admin@laplateforme.io",
  "password": "password123"
}
```

**Réponse (200) :**
```json
{
  "message": "Connexion réussie !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "pseudo": "Admin",
    "email": "admin@laplateforme.io",
    "city": "Marseille",
    "promo": 2024,
    "role": "admin"
  }
}
```

**Erreurs possibles :**
- `400` - Champs manquants
- `401` - Email ou mot de passe incorrect
- `403` - Compte pas encore validé

---

### 🔒 Routes protégées (token requis)

Pour toutes ces routes, ajoute le header :
```
Authorization: Bearer TON_TOKEN
```

---

#### **GET /api/profile**
Voir ton profil

**Exemple :**
```bash
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer TON_TOKEN"
```

**Réponse (200) :**
```json
{
  "message": "Voici ton profil",
  "user": {
    "userId": 1,
    "email": "admin@laplateforme.io",
    "pseudo": "Admin",
    "role": "admin",
    "city": "Marseille",
    "promo": 2024
  }
}
```

**Erreurs possibles :**
- `401` - Token manquant
- `403` - Token invalide ou expiré

---

#### **GET /api/challenges**
Liste de tous les challenges

**Exemple :**
```bash
curl http://localhost:3000/api/challenges \
  -H "Authorization: Bearer TON_TOKEN"
```

**Réponse (200) :**
```json
{
  "message": "Liste des challenges",
  "count": 10,
  "challenges": [
    {
      "id": 1,
      "title": "Créer un jeu Snake en JavaScript",
      "description": "Développez le jeu classique Snake...",
      "difficulty": "moyen",
      "author_pseudo": "MarieDev",
      "category_name": "Code",
      "created_at": "2024-12-01 10:30:00"
    }
  ]
}
```

**Erreurs possibles :**
- `401` - Token manquant
- `403` - Token invalide ou expiré

---

#### **GET /api/users** 🔴 ADMIN ONLY
Liste de tous les utilisateurs (réservé aux admins)

**Exemple :**
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer TON_TOKEN_ADMIN"
```

**Réponse (200) :**
```json
{
  "message": "Liste des utilisateurs",
  "count": 6,
  "users": [
    {
      "id": 1,
      "email": "admin@laplateforme.io",
      "pseudo": "Admin",
      "city": "Marseille",
      "promo": 2024,
      "role": "admin",
      "email_verified": 1,
      "account_validated": 1,
      "created_at": "2024-12-01 10:00:00"
    }
  ]
}
```

**Erreurs possibles :**
- `401` - Token manquant
- `403` - Token invalide ou expiré
- `403` - Droits administrateur requis

---

## 👤 Comptes de test

Tous les mots de passe sont : **password123**

| Email | Pseudo | Rôle | Validé |
|-------|--------|------|--------|
| admin@laplateforme.io | Admin | admin | ✅ |
| marie.dubois@laplateforme.io | MarieDev | user | ✅ |
| lucas.martin@laplateforme.io | LucasGamer | user | ✅ |
| emma.bernard@laplateforme.io | EmmaChef | user | ✅ |
| thomas.petit@laplateforme.io | ThomasPhoto | user | ✅ |
| alice.robert@laplateforme.io | AliceArt | user | ✅ |

---

## 📋 Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | OK - Tout s'est bien passé |
| 201 | Created - Ressource créée avec succès |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant |
| 403 | Forbidden - Token invalide ou droits insuffisants |
| 500 | Internal Server Error - Erreur serveur |

---

## 🛠️ Tester avec Postman

### 1. Se connecter
- **Méthode :** POST
- **URL :** http://localhost:3000/api/login
- **Body :** raw → JSON
```json
{
  "email": "admin@laplateforme.io",
  "password": "password123"
}
```
- Copie le **token** de la réponse

### 2. Utiliser une route protégée
- **Méthode :** GET
- **URL :** http://localhost:3000/api/profile
- **Headers :**
  - Key: `Authorization`
  - Value: `Bearer COLLE_TON_TOKEN_ICI`

---

## 🔧 Configuration

### JWT
- **Secret :** défini dans `server.js` ligne 14
- **Durée de validité :** 24h

### Base de données
- **Type :** SQLite
- **Fichier :** `database/interville.db`
- **Réinitialiser :** `node database/init.js`

### Port
- **Par défaut :** 3000
- **Modifier :** Ligne 11 dans `server.js`

---

## 📁 Structure de la base de données

- **users** - Utilisateurs de la plateforme
- **categories** - Catégories de challenges
- **challenges** - Défis créés par les users
- **participations** - Participations aux challenges
- **comments** - Commentaires sur les challenges
- **likes** - Likes des challenges
- **messages** - Messages du chat

---

## ❓ Besoin d'aide ?

Vérifie le fichier `database/COMMENT_INSTALLER.txt` pour l'installation de la base de données.

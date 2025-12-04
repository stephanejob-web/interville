# Interville

Application web moderne construite avec React et Express.

## Prérequis

### Node.js 24.11.1 (LTS)

**Installation de Node.js :**

1. Téléchargez et installez Node.js v24.11.1 LTS depuis [nodejs.org](https://nodejs.org/)

2. Vérifiez l'installation :
```bash
node --version  # Doit afficher v24.11.1
npm --version
```

## Architecture du projet

```
interville/
├── backend/              # Serveur API Express
│   ├── server.js        # Point d'entrée du serveur
│   ├── package.json     # Dépendances backend
│   └── .env            # Variables d'environnement
│
├── frontend/            # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/      # Pages de l'application
│   │   ├── context/    # Gestion d'état (Context API)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # Appels API
│   │   ├── utils/      # Fonctions utilitaires
│   │   ├── App.jsx     # Composant principal
│   │   └── main.jsx    # Point d'entrée
│   ├── package.json    # Dépendances frontend
│   └── vite.config.js  # Configuration Vite
│
├── package.json        # Scripts racine
└── README.md          # Documentation
```

## Technologies utilisées

### Frontend
- **React 19** - Bibliothèque UI
- **React Router DOM v7** - Routing
- **Vite** - Build tool et dev server
- **Tailwind CSS v4** - Framework CSS
- **DaisyUI** - Composants UI
- **Axios** - Client HTTP
- **Context API** - Gestion d'état

### Backend
- **Express 5** - Framework web Node.js
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Variables d'environnement
- **SQLite3** - Base de données
- **Socket.IO** - Communication temps réel
- **Nodemon** - Redémarrage automatique en dev

## Dépendances installées

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "express": "^5.2.1",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "better-sqlite3": "^12.5.0",
    "socket.io": "^4.8.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

### Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.10.0",
    "axios": "^1.13.2"
  },
  "devDependencies": {
    "vite": "^7.2.4",
    "@vitejs/plugin-react": "^5.1.1",
    "tailwindcss": "^4.1.17",
    "@tailwindcss/postcss": "^4.1.17",
    "daisyui": "latest",
    "autoprefixer": "latest"
  }
}
```

## Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd interville
```

### 2. Installer les dépendances

**IMPORTANT :** Vous devez installer les dépendances séparément pour le backend et le frontend.

**Étape 1 - Installer les dépendances du backend :**
```bash
cd backend
npm install
```
Cette commande installe :
- Express, CORS, dotenv
- SQLite (better-sqlite3)
- Socket.IO
- Nodemon (pour le développement)

**Étape 2 - Revenir à la racine :**
```bash
cd ..
```

**Étape 3 - Installer les dépendances du frontend :**
```bash
cd frontend
npm install
```
Cette commande installe :
- React 19 et React DOM
- React Router DOM v7
- Vite (build tool)
- Tailwind CSS v4 et DaisyUI
- Axios

**Étape 4 - Revenir à la racine :**
```bash
cd ..
```

Vous êtes maintenant prêt à lancer le projet !

## Démarrage du projet

### ⚡ Démarrage rapide (Recommandé)

**À la racine du projet :**
```bash
npm run dev
```

Cette commande lance automatiquement :
- ✅ Backend Express sur `http://localhost:5000`
- ✅ Frontend React sur `http://localhost:5173`
- ✅ Tailwind CSS compilé automatiquement
- ✅ Hot reload activé

## Configuration

### Variables d'environnement

**Backend (`backend/.env`)** :
```env
PORT=5000
```

**Frontend (`frontend/.env`)** :
```env
VITE_API_URL=http://localhost:5000
```

## Développement

### Ajouter une nouvelle page

1. Créer un dossier dans `frontend/src/pages/` :
```
pages/
└── MaPage/
    └── MaPage.jsx
```

2. Créer le composant :
```jsx
export const MaPage = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Ma Page</h1>
    </div>
  );
};
```

3. Ajouter la route dans `App.jsx` :
```jsx
import { MaPage } from './pages/MaPage/MaPage';

<Route path="/ma-page" element={<MaPage />} />
```

### Utiliser le Context (état global)

```jsx
import { useApp } from '../../context/AppContext';

const { user, setUser } = useApp();
```

### Appeler l'API backend

```jsx
import axios from 'axios';

const response = await axios.get('http://localhost:5000/api/endpoint');
```

## Documentation

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Express](https://expressjs.com/)
- [React Router](https://reactrouter.com/)

## Support

Pour toute question, contactez l'équipe de développement.

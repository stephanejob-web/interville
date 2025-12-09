import { Navigate } from 'react-router-dom';

// Composant pour protéger les routes
// Si l'utilisateur n'est pas connecté, il est redirigé vers /login
export const ProtectedRoute = ({ children }) => {
  // Vérifier si un token existe dans localStorage
  const token = localStorage.getItem('token');

  // Si pas de token, rediriger vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si le token existe, afficher la page demandée
  return children;
};

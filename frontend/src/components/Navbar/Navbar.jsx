import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      setIsLoggedIn(true);
      const user = JSON.parse(userString);
      setUsername(user.pseudo);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer le token et les infos user du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Mettre à jour l'état
    setIsLoggedIn(false);
    setUsername('');

    // Rediriger vers la page de login
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <span className="text-xl font-bold">Interville</span>
      </div>
      <div className="navbar-end gap-2">
        <NavLink to="/" className="btn btn-sm btn-ghost">
          Accueil
        </NavLink>

        {/* Afficher Challenges et Chat seulement si connecté */}
        {isLoggedIn && (
          <>
            <NavLink to="/challenges" className="btn btn-sm btn-ghost">
              Challenges
            </NavLink>
            <NavLink to="/chat" className="btn btn-sm btn-ghost">
              Chat
            </NavLink>
          </>
        )}

        {/* Afficher Login/Register seulement si NON connecté */}
        {!isLoggedIn && (
          <>
            <NavLink to="/login" className="btn btn-sm btn-ghost">
              Login
            </NavLink>
            <NavLink to="/register" className="btn btn-sm btn-ghost">
              Register
            </NavLink>
          </>
        )}

        <NavLink to="/about" className="btn btn-sm btn-ghost">
          À propos
        </NavLink>

        {/* Afficher Déconnexion seulement si connecté */}
        {isLoggedIn && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">👤 {username}</span>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-error"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

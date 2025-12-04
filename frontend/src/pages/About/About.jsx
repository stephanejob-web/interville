import { useApp } from '../../context/AppContext';
import './About.css';

export const About = () => {
  const { user, setUser } = useApp();

  return (
    <div className="about">
      <h1>À propos d'Interville</h1>

      <div className="context-demo">
        <h2>Démo Context</h2>
        <p>Utilisateur: {user || 'Non connecté'}</p>

        <div className="actions">
          <button onClick={() => setUser('Étudiant')}>
            Se connecter
          </button>
          <button onClick={() => setUser(null)}>
            Se déconnecter
          </button>
        </div>
      </div>

      <div className="about-content">
        <p>Application développée avec React et Express.</p>
      </div>
    </div>
  );
};

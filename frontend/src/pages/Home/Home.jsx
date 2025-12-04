import { useToggle } from '../hooks/useToggle';
import { Button } from '../components/Button';
import './Home.css';

export const Home = () => {
  const [isVisible, toggle] = useToggle(true);

  return (
    <div className="home">
      <h1>Page d'accueil</h1>
      <p>Bienvenue sur Interville</p>

      <div className="home-content">
        <Button onClick={toggle}>
          {isVisible ? 'Masquer' : 'Afficher'} le contenu
        </Button>

        {isVisible && (
          <div className="content-box">
            <p>Ceci est un exemple de contenu</p>
          </div>
        )}
      </div>
    </div>
  );
};

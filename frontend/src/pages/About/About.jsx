import { useApp } from '../../context/AppContext';

export const About = () => {
  const { user, setUser } = useApp();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">À propos</h1>

      <div className="mb-6">
        <p className="mb-2">Utilisateur: {user || 'Non connecté'}</p>
        <button
          className="btn btn-primary mr-2"
          onClick={() => setUser('Étudiant')}
        >
          Connexion
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setUser(null)}
        >
          Déconnexion
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Technologies</h2>
        <ul className="list-disc ml-6">
          <li>React</li>
          <li>Express</li>
          <li>DaisyUI</li>
        </ul>
      </div>
    </div>
  );
};

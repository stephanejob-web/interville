import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page non trouvée</p>
      <Link to="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
};

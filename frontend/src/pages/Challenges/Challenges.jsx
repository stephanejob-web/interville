import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Challenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Récupérer tous les challenges au chargement de la page
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          setErrorMessage('Vous devez être connecté pour voir les challenges');
          setIsLoading(false);
          return;
        }

        // Appel à l'API pour récupérer les challenges
        const response = await axios.get('http://localhost:3000/api/challenges', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Challenges récupérés:', response.data);
        setChallenges(response.data.challenges);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('Erreur de connexion au serveur');
        }
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5E6D3' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-xl" style={{ color: '#8B4513' }}>
            Chargement des challenges...
          </div>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (errorMessage) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5E6D3' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-xl text-red-600 bg-red-100 p-4 rounded">
            {errorMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Titre simple */}
        <h1 className="text-3xl font-light text-gray-800 mb-12">
          Challenges
        </h1>

        {/* Liste des challenges */}
        {challenges.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            Aucun challenge disponible
          </div>
        ) : (
          <div className="space-y-8">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="border-b border-gray-200 pb-8 hover:bg-gray-50 transition-colors p-6 -mx-6"
              >
                {/* Titre */}
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  {challenge.title}
                </h2>

                {/* Catégorie et difficulté - texte simple */}
                <div className="flex gap-3 mb-4 text-sm text-gray-600">
                  <span>{challenge.category_name}</span>
                  <span>•</span>
                  <span className="capitalize">{challenge.difficulty}</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Auteur et stats en ligne */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{challenge.author_pseudo}</span>
                    <span>•</span>
                    <span>{challenge.author_city}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex gap-4">
                      <span>{challenge.likes_count} likes</span>
                      <span>{challenge.comments_count} commentaires</span>
                    </div>
                    <button
                      onClick={() => navigate(`/challenges/${challenge.id}`)}
                      className="text-gray-900 font-medium hover:underline"
                    >
                      Détails →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

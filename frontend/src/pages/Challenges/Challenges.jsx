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
        {/* Titre et bouton créer */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-light text-gray-800">
            Challenges
          </h1>
          <button
            onClick={() => navigate('/challenges/new')}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Créer un challenge
          </button>
        </div>

        {/* Galerie des challenges */}
        {challenges.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            Aucun challenge disponible
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="border border-gray-200 hover:border-gray-900 transition-all duration-200 rounded p-6 flex flex-col h-full cursor-pointer bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1"
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                    <span>{challenge.category_name}</span>
                    <span>•</span>
                    <span className="capitalize">{challenge.difficulty}</span>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 line-clamp-2">
                    {challenge.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-1">
                  {challenge.description}
                </p>

                {/* Footer */}
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{challenge.likes_count} likes</span>
                    <span>{challenge.comments_count} commentaires</span>
                  </div>

                  {/* Auteur */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-medium">
                      {challenge.author_pseudo.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {challenge.author_pseudo}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {challenge.author_city}
                      </p>
                    </div>
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

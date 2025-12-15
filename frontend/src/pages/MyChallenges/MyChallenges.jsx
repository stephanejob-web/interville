import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const MyChallenges = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Récupérer les challenges auxquels l'utilisateur participe
  useEffect(() => {
    const fetchMyChallenges = async () => {
      try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (!token || !userString) {
          setErrorMessage('Vous devez être connecté');
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userString);

        // Récupérer tous les challenges
        const response = await axios.get('http://localhost:3000/api/challenges', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Pour chaque challenge, vérifier si l'utilisateur participe
        // On va récupérer les détails de chaque challenge pour voir les participations
        const allChallenges = response.data.challenges;
        const challengesWithParticipations = [];

        // Récupérer les détails de chaque challenge pour voir les participations
        for (const challenge of allChallenges) {
          try {
            const detailResponse = await axios.get(`http://localhost:3000/api/challenges/${challenge.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            const challengeDetail = detailResponse.data.challenge;

            // Vérifier si l'utilisateur a une participation
            const userParticipation = challengeDetail.participations?.find(
              p => p.user_id === user.id
            );

            if (userParticipation) {
              challengesWithParticipations.push({
                ...challenge,
                my_participation: userParticipation
              });
            }
          } catch (err) {
            console.error(`Erreur pour le challenge ${challenge.id}:`, err);
          }
        }

        console.log('Mes participations:', challengesWithParticipations);
        setChallenges(challengesWithParticipations);
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

    fetchMyChallenges();
  }, []);

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="text-center text-gray-500">Chargement...</div>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="text-center text-red-600 bg-red-100 p-4 rounded">
            {errorMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Titre */}
        <div className="mb-12">
          <h1 className="text-3xl font-light text-gray-800">
            Mes Participations
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Les challenges auxquels vous participez
          </p>
        </div>

        {/* Galerie des challenges */}
        {challenges.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">
              Vous ne participez à aucun challenge pour le moment
            </p>
            <button
              onClick={() => navigate('/challenges')}
              className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Découvrir les challenges
            </button>
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

                  {/* Statut de participation */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Votre participation :
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        challenge.my_participation?.status === 'completed' ? 'bg-green-100 text-green-700' :
                        challenge.my_participation?.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {challenge.my_participation?.status || 'pending'}
                      </span>
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

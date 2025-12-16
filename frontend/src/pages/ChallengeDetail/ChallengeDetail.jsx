import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';


export const ChallengeDetail = () => {
  const { id } = useParams(); // Récupérer l'ID du challenge depuis l'URL
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Récupérer les détails du challenge au chargement
  useEffect(() => {
  	const fetchChallengeDetail = async () => {
  		try {
        // Récupérer le token depuis localStorage
  			const token = localStorage.getItem('token');

  			if (!token) {
  				setErrorMessage('Vous devez être connecté');
  				setIsLoading(false);
  				return;
  			}

        // Appel à l'API pour récupérer les détails complets du challenge
  			const response = await axios.get(API_URL + `/api/challenges/${id}`, {
  				headers: {
  					'Authorization': `Bearer ${token}`
  				}
  			});

  			console.log('Détails du challenge:', response.data);
  			setChallenge(response.data.challenge);
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

  	fetchChallengeDetail();
  }, [id]);

  // Fonction pour liker/unliker le challenge
  const handleLike = async () => {
  	try {
  		setIsLiking(true);

      // Récupérer le token
  		const token = localStorage.getItem('token');

      // Appel à l'API pour liker/unliker
  		const response = await axios.post(
  			API_URL + `/api/challenges/${id}/like`,
  			{},
  			{
  				headers: {
  					'Authorization': `Bearer ${token}`
  				}
  			}
  			);

  		console.log('Like response:', response.data);

      // Mettre à jour l'état du challenge
  		setChallenge(prevChallenge => ({
  			...prevChallenge,
  			user_has_liked: response.data.liked ? 1 : 0,
  			likes_count: response.data.likes_count
  		}));

      // Recharger les détails pour avoir la liste mise à jour des likes
  		const detailResponse = await axios.get(API_URL + `/api/challenges/${id}`, {
  			headers: {
  				'Authorization': `Bearer ${token}`
  			}
  		});
  		setChallenge(detailResponse.data.challenge);

  		setIsLiking(false);
  	} catch (error) {
  		console.error('Erreur lors du like:', error);
  		setIsLiking(false);
  	}
  };

  // Fonction pour supprimer le challenge
  const handleDelete = async () => {
  	if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce challenge ?')) {
  		return;
  	}

  	try {
  		setIsDeleting(true);

      // Récupérer le token
  		const token = localStorage.getItem('token');

      // Appel à l'API pour supprimer
  		await axios.delete(API_URL + `/api/challenges/${id}`, {
  			headers: {
  				'Authorization': `Bearer ${token}`
  			}
  		});

  		console.log('Challenge supprimé');

      // Rediriger vers la liste des challenges
  		navigate('/challenges');
  	} catch (error) {
  		console.error('Erreur lors de la suppression:', error);
  		alert('Erreur lors de la suppression du challenge');
  		setIsDeleting(false);
  	}
  };

  // Fonction pour éditer le challenge
  const handleEdit = () => {
  	navigate(`/challenges/${id}/edit`);
  };

  // Vérifier si l'utilisateur connecté est l'auteur
  const isAuthor = () => {
  	const userString = localStorage.getItem('user');
  	if (!userString || !challenge) return false;

  	const user = JSON.parse(userString);
  	return user.id === challenge.author_id;
  };

  // Affichage pendant le chargement
  if (isLoading) {
  	return (
  		<div className="min-h-screen bg-white">
  			<div className="container mx-auto px-6 py-12 max-w-4xl">
  				<div className="text-center text-gray-500">
  					Chargement...
  				</div>
  			</div>
  		</div>
  		);
  }

  // Affichage en cas d'erreur
  if (errorMessage) {
  	return (
  		<div className="min-h-screen bg-white">
  			<div className="container mx-auto px-6 py-12 max-w-4xl">
  				<div className="text-center text-red-600 bg-red-100 p-4 rounded">
  					{errorMessage}
  				</div>
  			</div>
  		</div>
  		);
  }

  // Si le challenge n'existe pas
  if (!challenge) {
  	return (
  		<div className="min-h-screen bg-white">
  			<div className="container mx-auto px-6 py-12 max-w-4xl">
  				<div className="text-center text-gray-500">
  					Challenge introuvable
  				</div>
  			</div>
  		</div>
  		);
  }

  return (
  	<div className="min-h-screen bg-white">
  		<div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Bouton retour */}
  			<button
  				onClick={() => navigate('/challenges')}
  				className="text-gray-600 hover:text-gray-900 mb-8 flex items-center gap-2"
  			>
  				← Retour aux challenges
  			</button>

        {/* Titre et boutons */}
  			<div className="flex items-start justify-between mb-4">
  				<h1 className="text-3xl font-light text-gray-900">
  					{challenge.title}
  				</h1>
  				<div className="flex gap-2">
            {/* Boutons Éditer et Supprimer (uniquement pour l'auteur) */}
  					{isAuthor() && (
  						<>
  						<button
  							onClick={handleEdit}
  							className="px-4 py-2 rounded bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
  						>
  							Éditer
  						</button>
  						<button
  							onClick={handleDelete}
  							disabled={isDeleting}
  							className="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
  						>
  							{isDeleting ? 'Suppression...' : 'Supprimer'}
  						</button>
  						</>
  						)}
            {/* Bouton Participer (pour les non-auteurs) */}
  					{!isAuthor() && (
  						<button
  							onClick={() => alert('Fonctionnalité de participation à venir')}
  							className="px-6 py-2 rounded bg-gray-900 text-white hover:bg-gray-700 transition-colors"
  						>
  							Participer
  						</button>
  						)}
            {/* Bouton Like (pour tous) */}
  					<button
  						onClick={handleLike}
  						disabled={isLiking}
  						className={`px-4 py-2 rounded transition-colors ${
  							challenge.user_has_liked
  							? 'bg-gray-900 text-white hover:bg-gray-700'
  							: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  						} disabled:opacity-50`}
  					>
  						{challenge.user_has_liked ? '❤️ Liké' : '🤍 Liker'}
  					</button>
  				</div>
  			</div>

        {/* Catégorie et difficulté */}
  			<div className="flex gap-3 mb-8 text-sm text-gray-600">
  				<span>{challenge.category_name}</span>
  				<span>•</span>
  				<span className="capitalize">{challenge.difficulty}</span>
  				<span>•</span>
  				<span>{challenge.likes_count} likes</span>
  			</div>

        {/* Description */}
  			<div className="mb-12">
  				<h2 className="text-lg font-medium text-gray-900 mb-3">Description</h2>
  				<p className="text-gray-700 leading-relaxed">
  					{challenge.description}
  				</p>
  			</div>

        {/* Auteur */}
  			<div className="mb-12 pb-8 border-b border-gray-200">
  				<h2 className="text-lg font-medium text-gray-900 mb-3">Créé par</h2>
  				<div className="flex items-center gap-3">
  					<div className="text-gray-700">
  						<p className="font-medium">{challenge.author_pseudo}</p>
  						<p className="text-sm text-gray-600">{challenge.author_city} • Promo {challenge.author_promo}</p>
  					</div>
  				</div>
  			</div>

        {/* Likes */}
  			<div className="mb-12 pb-8 border-b border-gray-200">
  				<h2 className="text-lg font-medium text-gray-900 mb-3">
  					Likes ({challenge.likes_count})
  				</h2>
  				{challenge.liked_by && challenge.liked_by.length > 0 ? (
  					<div className="space-y-2">
  						{challenge.liked_by.map((like, index) => (
  							<div key={index} className="flex items-center gap-2 text-sm text-gray-700">
  								<span className="font-medium">{like.pseudo}</span>
  								<span className="text-gray-500">• {like.city}</span>
  							</div>
  							))}
  					</div>
  					) : (
  					<p className="text-gray-500 text-sm">Aucun like pour le moment</p>
  					)}
  				</div>

        {/* Commentaires */}
  				<div className="mb-12 pb-8 border-b border-gray-200">
  					<h2 className="text-lg font-medium text-gray-900 mb-3">
  						Commentaires ({challenge.comments_count})
  					</h2>
  					{challenge.comments && challenge.comments.length > 0 ? (
  						<div className="space-y-6">
  							{challenge.comments.map((comment) => (
  								<div key={comment.id} className="bg-gray-50 p-4 rounded">
  									<div className="flex items-center gap-2 mb-2">
  										<span className="font-medium text-gray-900">{comment.pseudo}</span>
  										<span className="text-gray-500 text-sm">• {comment.city}</span>
  										<span className="text-gray-400 text-sm ml-auto">
  											{new Date(comment.created_at).toLocaleDateString('fr-FR')}
  										</span>
  									</div>
  									<p className="text-gray-700">{comment.content}</p>
  								</div>
  								))}
  						</div>
  						) : (
  						<p className="text-gray-500 text-sm">Aucun commentaire pour le moment</p>
  						)}
  					</div>

        {/* Participations */}
  					<div className="mb-12">
  						<h2 className="text-lg font-medium text-gray-900 mb-3">
  							Participations ({challenge.participations_count})
  						</h2>
  						{challenge.participations && challenge.participations.length > 0 ? (
  							<div className="space-y-4">
  								{challenge.participations.map((participation) => (
  									<div key={participation.id} className="bg-gray-50 p-4 rounded">
  										<div className="flex items-center justify-between mb-2">
  											<div className="flex items-center gap-2">
  												<span className="font-medium text-gray-900">{participation.pseudo}</span>
  												<span className="text-gray-500 text-sm">• {participation.city}</span>
  											</div>
  											<span className={`text-sm px-3 py-1 rounded ${
  												participation.status === 'completed' ? 'bg-green-100 text-green-700' :
  												participation.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
  												'bg-gray-200 text-gray-700'
  											}`}>
  											{participation.status}
  										</span>
  									</div>
  									{participation.proof_url && (
  										<p className="text-sm text-gray-600 mt-2">
  											Preuve : <a href={participation.proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{participation.proof_url}</a>
  										</p>
  										)}
  									<p className="text-xs text-gray-400 mt-2">
  										{new Date(participation.created_at).toLocaleDateString('fr-FR')}
  									</p>
  								</div>
  								))}
  							</div>
  							) : (
  							<p className="text-gray-500 text-sm">Aucune participation pour le moment</p>
  							)}
  						</div>
  					</div>
  				</div>
  				);
};

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';


export const EditChallenge = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [categories, setCategories] = useState([]);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category_id: '',
		difficulty: '',
		image_url: '',
		video_url: ''
	});

  // Récupérer le challenge et les catégories au chargement
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem('token');

				if (!token) {
					setErrorMessage('Vous devez être connecté');
					setIsLoading(false);
					return;
				}

        // Récupérer le challenge
				const challengeResponse = await axios.get(API_URL + `/api/challenges/${id}`, {
					headers: { 'Authorization': `Bearer ${token}` }
				});

				const challenge = challengeResponse.data.challenge;

        // Vérifier que l'utilisateur est l'auteur
				const userString = localStorage.getItem('user');
				const user = userString ? JSON.parse(userString) : null;
				if (!user || user.id !== challenge.author_id) {
					setErrorMessage('Vous n\'êtes pas autorisé à modifier ce challenge');
					setIsLoading(false);
					return;
				}

        // Pré-remplir le formulaire
				setFormData({
					title: challenge.title,
					description: challenge.description,
					category_id: challenge.category_id,
					difficulty: challenge.difficulty,
					image_url: challenge.image_url || '',
					video_url: challenge.video_url || ''
				});

        // Récupérer les catégories
				const categoriesResponse = await axios.get(API_URL + '/api/categories', {
					headers: { 'Authorization': `Bearer ${token}` }
				});

				setCategories(categoriesResponse.data.categories);
				setIsLoading(false);
			} catch (error) {
				console.error('Erreur:', error);
				setErrorMessage('Erreur lors du chargement');
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id]);

  // Gérer les changements dans le formulaire
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

  // Enregistrer les modifications
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage('');
		setIsSaving(true);

		try {
			const token = localStorage.getItem('token');

      // Appel à l'API pour mettre à jour
			await axios.put(
				API_URL + `/api/challenges/${id}`,
		formData,
		{
			headers: { 'Authorization': `Bearer ${token}` }
		}
		);

			console.log('Challenge modifié avec succès');

      // Rediriger vers la page de détails
			navigate(`/challenges/${id}`);
		} catch (error) {
			console.error('Erreur:', error);
			if (error.response && error.response.data) {
				setErrorMessage(error.response.data.error);
			} else {
				setErrorMessage('Erreur lors de la modification');
			}
			setIsSaving(false);
		}
	};

  // Affichage pendant le chargement
	if (isLoading) {
		return (
			<div className="min-h-screen bg-white">
				<div className="container mx-auto px-6 py-12 max-w-2xl">
					<div className="text-center text-gray-500">Chargement...</div>
				</div>
			</div>
			);
	}

  // Affichage en cas d'erreur
	if (errorMessage && !formData.title) {
		return (
			<div className="min-h-screen bg-white">
				<div className="container mx-auto px-6 py-12 max-w-2xl">
					<div className="text-center text-red-600 bg-red-100 p-4 rounded">
						{errorMessage}
					</div>
					<div className="text-center mt-4">
						<button
							onClick={() => navigate('/challenges')}
							className="text-gray-600 hover:text-gray-900"
						>
							← Retour aux challenges
						</button>
					</div>
				</div>
			</div>
			);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Bouton retour */}
				<button
					onClick={() => navigate(`/challenges/${id}`)}
					className="text-gray-600 hover:text-gray-900 mb-8 flex items-center gap-2"
				>
					← Retour au challenge
				</button>

        {/* Titre */}
				<h1 className="text-3xl font-light text-gray-900 mb-8">
					Éditer le challenge
				</h1>

        {/* Formulaire */}
				<form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Titre
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
						/>
					</div>

          {/* Description */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							required
							rows="6"
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
						/>
					</div>

          {/* Catégorie */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Catégorie
						</label>
						<select
							name="category_id"
							value={formData.category_id}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
						>
							<option value="">Sélectionner une catégorie</option>
							{categories.map(cat => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
								))}
						</select>
					</div>

          {/* Difficulté */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Difficulté
						</label>
						<select
							name="difficulty"
							value={formData.difficulty}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
						>
							<option value="">Sélectionner une difficulté</option>
							<option value="facile">Facile</option>
							<option value="moyen">Moyen</option>
							<option value="difficile">Difficile</option>
						</select>
					</div>

          {/* URL Image (optionnel) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							URL de l'image (optionnel)
						</label>
						<input
							type="text"
							name="image_url"
							value={formData.image_url}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
							placeholder="https://example.com/image.jpg"
						/>
					</div>

          {/* URL Vidéo (optionnel) */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							URL de la vidéo (optionnel)
						</label>
						<input
							type="text"
							name="video_url"
							value={formData.video_url}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
							placeholder="https://youtube.com/watch?v=..."
						/>
					</div>

          {/* Message d'erreur */}
					{errorMessage && (
						<div className="text-red-600 bg-red-100 p-3 rounded">
							{errorMessage}
						</div>
						)}

          {/* Boutons */}
					<div className="flex gap-3 pt-4">
						<button
							type="submit"
							disabled={isSaving}
							className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
						>
							{isSaving ? 'Enregistrement...' : 'Enregistrer'}
						</button>
						<button
							type="button"
							onClick={() => navigate(`/challenges/${id}`)}
							className="px-6 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors"
						>
							Annuler
						</button>
					</div>
				</form>
			</div>
		</div>
		);
};

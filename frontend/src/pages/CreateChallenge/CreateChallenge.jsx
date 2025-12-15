import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CreateChallenge = () => {
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

  // Récupérer les catégories au chargement
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setErrorMessage('Vous devez être connecté');
          setIsLoading(false);
          return;
        }

        // Récupérer les catégories
        const response = await axios.get('http://localhost:3000/api/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setCategories(response.data.categories);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setErrorMessage('Erreur lors du chargement des catégories');
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Créer le challenge
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');

      // Appel à l'API pour créer le challenge
      const response = await axios.post(
        'http://localhost:3000/api/challenges',
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      console.log('Challenge créé avec succès:', response.data);

      // Rediriger vers la page de détails du nouveau challenge
      navigate(`/challenges/${response.data.challenge.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Erreur lors de la création du challenge');
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/challenges')}
          className="text-gray-600 hover:text-gray-900 mb-8 flex items-center gap-2"
        >
          ← Retour aux challenges
        </button>

        {/* Titre */}
        <h1 className="text-3xl font-light text-gray-900 mb-8">
          Créer un challenge
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
              placeholder="Ex: Faire 50 pompes en une série"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
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
              placeholder="Décrivez votre challenge en détail..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
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
              {isSaving ? 'Création...' : 'Créer le challenge'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/challenges')}
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

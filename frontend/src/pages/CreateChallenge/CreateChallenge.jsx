import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateChallenge = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    difficulty: '',
    category: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const difficulties = ['Facile', 'Moyen', 'Difficile', 'Expert'];
  const categories = ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Design', 'Autre'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Créer aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ici vous intégrerez l'appel à votre API
      console.log('Challenge data:', formData);
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Rediriger après succès
      navigate('/challenges');
    } catch (error) {
      console.error('Erreur lors de la création du challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6D3' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-linear-to-br from-white/20 to-transparent rounded-full backdrop-blur-sm border border-white/30"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-linear-to-br from-white/15 to-transparent rounded-full backdrop-blur-sm border border-white/20"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-linear-to-br from-white/10 to-transparent rounded-full backdrop-blur-sm border border-white/20"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-linear-to-br from-white/15 to-transparent rounded-full backdrop-blur-sm border border-white/25"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          
          <div className="lg:w-64 shrink-0">
            <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 p-6 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4" style={{ backgroundColor: '#D2691E' }}>
                  U
                </div>
                <h3 className="font-semibold" style={{ color: '#8B4513' }}>Utilisateur</h3>
              </div>

              <nav className="space-y-2">
                <button className="w-full px-4 py-3 rounded-xl text-left font-medium hover:bg-white/20 transition-all duration-300" style={{ color: '#8B4513' }}>
                  Accueil
                </button>
                <button className="w-full px-4 py-3 rounded-xl text-left font-medium hover:bg-white/20 transition-all duration-300" style={{ color: '#8B4513' }}>
                  Messages
                </button>
                <button className="w-full px-4 py-3 rounded-xl text-left font-medium hover:bg-white/20 transition-all duration-300" style={{ color: '#8B4513' }}>
                  Vos challenges
                </button>
                <button className="w-full px-4 py-3 rounded-xl text-left font-medium hover:bg-white/20 transition-all duration-300" style={{ color: '#8B4513' }}>
                  Profil
                </button>
                <button className="w-full px-4 py-3 rounded-xl text-left font-medium hover:bg-white/20 transition-all duration-300" style={{ color: '#8B4513' }}>
                  Explorer les challenges
                </button>
              </nav>

              <div className="mt-6">
                <input
                  type="text"
                  placeholder="Rechercher"
                  className="w-full px-4 py-3 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  style={{ color: '#8B4513' }}
                />
              </div>

              <button className="w-full mt-6 px-4 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all duration-300" style={{ backgroundColor: '#D2691E' }}>
                Se déconnecter
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 p-6 md:p-8 shadow-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: '#8B4513' }}>
                Proposer un challenge
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-medium mb-3" style={{ color: '#8B4513' }}>
                    Titre
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300"
                    placeholder="Donnez un titre à votre challenge"
                    style={{ color: '#8B4513' }}
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3" style={{ color: '#8B4513' }}>
                    Difficulté
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300"
                    style={{ color: '#8B4513' }}
                  >
                    <option value="">Sélectionnez la difficulté</option>
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff.toLowerCase()}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3" style={{ color: '#8B4513' }}>
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300"
                    style={{ color: '#8B4513' }}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3" style={{ color: '#8B4513' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300 resize-none"
                    placeholder="Décrivez votre challenge en détail..."
                    style={{ color: '#8B4513' }}
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3" style={{ color: '#8B4513' }}>
                    Image :
                  </label>
                  
c                  <div className="border-2 border-dashed border-white/50 rounded-xl p-8 text-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="max-w-full max-h-48 mx-auto rounded-lg shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                          className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300"
                          style={{ backgroundColor: '#D2691E' }}
                        >
                          Changer l'image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: '#8B4513' }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <p style={{ color: '#8B4513' }}>
                          Cliquez pour ajouter une image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-block px-6 py-3 rounded-lg text-white font-medium cursor-pointer hover:opacity-90 transition-all duration-300"
                          style={{ backgroundColor: '#D2691E' }}
                        >
                          Parcourir
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#D2691E' }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Création en cours...
                      </span>
                    ) : (
                      'Proposer un challenge'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-8">
          <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#8B4513' }}>
              Messages
            </h3>
            <p className="text-center" style={{ color: '#8B4513' }}>
              Aucun nouveau message
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6D3' }}>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: '#8B4513' }}>
              Bienvenue sur <span style={{ color: '#D2691E' }}>Interville</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed max-w-4xl mx-auto px-4" style={{ color: '#8B4513' }}>
              La plateforme qui rassemble la communauté étudiante de La Plateforme_. 
              Un espace bienveillant où apprendre, partager et grandir ensemble.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#D2691E' }}
              >
                Rejoindre la communauté
              </button>
              
              <button
                onClick={handleLearnMore}
                className="px-8 py-4 rounded-xl font-semibold text-lg border-2 hover:bg-white/20 transition-all duration-300"
                style={{ 
                  color: '#8B4513', 
                  borderColor: '#8B4513' 
                }}
              >
                Découvrir Interville
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto px-4">
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:bg-white/50 transition-all duration-300">
                <div className="text-3xl font-bold mb-2" style={{ color: '#D2691E' }}>500+</div>
                <div className="text-sm font-medium" style={{ color: '#8B4513' }}>Étudiants connectés</div>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:bg-white/50 transition-all duration-300">
                <div className="text-3xl font-bold mb-2" style={{ color: '#D2691E' }}>50+</div>
                <div className="text-sm font-medium" style={{ color: '#8B4513' }}>Défis relevés</div>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:bg-white/50 transition-all duration-300">
                <div className="text-3xl font-bold mb-2" style={{ color: '#D2691E' }}>10</div>
                <div className="text-sm font-medium" style={{ color: '#8B4513' }}>Promotions actives</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Interville Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#8B4513' }}>
              Qu'est-ce qu'Interville ?
            </h2>
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#8B4513' }}>
              Interville est née d'une vision simple : créer un espace numérique où les étudiants de La Plateforme_ 
              peuvent se retrouver, collaborer et s'entraider dans leur parcours d'apprentissage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Notre mission
              </h3>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#8B4513' }}>
                Faciliter les échanges entre étudiants, encourager la collaboration 
                et offrir un environnement stimulant pour relever des défis techniques ensemble.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/50" style={{ color: '#8B4513' }}>
                  Collaboration
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/50" style={{ color: '#8B4513' }}>
                  Entraide
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/50" style={{ color: '#8B4513' }}>
                  Innovation
                </span>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Pourquoi Interville ?
              </h3>
              <ul className="space-y-3 text-lg" style={{ color: '#8B4513' }}>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5" style={{ backgroundColor: '#D2691E' }}>
                    ✓
                  </span>
                  Exclusivement réservé aux étudiants de La Plateforme_
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5" style={{ backgroundColor: '#D2691E' }}>
                    ✓
                  </span>
                  Chat en temps réel avec vos camarades de promotion
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5" style={{ backgroundColor: '#D2691E' }}>
                    ✓
                  </span>
                  Défis techniques adaptés à votre niveau
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#8B4513' }}>
              Comment ça fonctionne ?
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: '#8B4513' }}>
              Trois étapes simples pour rejoindre la communauté Interville
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-8 md:space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: '#D2691E' }}>
                    1
                  </div>
                </div>
                <div className="flex-1 bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513' }}>
                    Créez votre compte étudiant
                  </h3>
                  <p className="text-lg" style={{ color: '#8B4513' }}>
                    Inscrivez-vous avec votre adresse email @laplateforme.io. 
                    Seuls les étudiants de l'école ont accès à cette communauté exclusive.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: '#D2691E' }}>
                    2
                  </div>
                </div>
                <div className="flex-1 bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513' }}>
                    Rejoignez votre promotion
                  </h3>
                  <p className="text-lg" style={{ color: '#8B4513' }}>
                    Connectez-vous automatiquement avec les autres étudiants de votre promotion. 
                    Découvrez qui partage votre parcours d'apprentissage.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: '#D2691E' }}>
                    3
                  </div>
                </div>
                <div className="flex-1 bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#8B4513' }}>
                    Participez et progressez
                  </h3>
                  <p className="text-lg" style={{ color: '#8B4513' }}>
                    Relevez des défis, échangez sur le chat, partagez vos solutions et apprenez 
                    les uns des autres dans un environnement bienveillant et stimulant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#8B4513' }}>
              Ce qui vous attend sur Interville
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:bg-white/50 transition-all duration-300 border border-white/50">
            
              <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Défis Techniques
              </h3>
              <p style={{ color: '#8B4513' }}>
                Des challenges adaptés à votre niveau, créés par vos formateurs et la communauté 
                pour développer vos compétences de manière ludique.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:bg-white/50 transition-all duration-300 border border-white/50">
             
              <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Chat Communautaire
              </h3>
              <p style={{ color: '#8B4513' }}>
                Échangez en temps réel avec vos camarades, posez vos questions, 
                partagez vos découvertes et créez des liens durables.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:bg-white/50 transition-all duration-300 border border-white/50">
              
              <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Progression Partagée
              </h3>
              <p style={{ color: '#8B4513' }}>
                Suivez vos progrès, célébrez vos réussites avec la communauté 
                et motivez-vous mutuellement à atteindre vos objectifs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#8B4513' }}>
              Prêt à rejoindre l'aventure ?
            </h2>
            
            <p className="text-lg md:text-xl mb-8 leading-relaxed px-4" style={{ color: '#8B4513' }}>
              Interville vous attend pour vivre une expérience d'apprentissage unique. 
              Rejoignez une communauté bienveillante où chaque étudiant compte et où l'entraide 
              est au cœur de la réussite collective.
            </p>

            <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 p-8 mb-8 shadow-xl max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: '#D2691E' }}>
                @
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#8B4513' }}>
                Accès étudiant exclusif
              </h3>
              <p className="text-base mb-6" style={{ color: '#8B4513' }}>
                Votre adresse @laplateforme.io est votre passeport pour accéder à Interville
              </p>
              
              <button
                onClick={handleGetStarted}
                className="w-full px-8 py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#D2691E' }}
              >
                Créer mon compte maintenant
              </button>
            </div>

            <div className="text-center">
              <p className="text-base mb-3" style={{ color: '#8B4513' }}>
                Vous avez déjà un compte ?
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-lg font-semibold hover:underline transition-all duration-300"
                style={{ color: '#D2691E' }}
              >
                Se connecter →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

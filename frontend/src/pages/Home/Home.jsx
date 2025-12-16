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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        {/* Section principale */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-5xl font-light text-gray-900 mb-6">
            Interville
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Créez et relevez des challenges avec vos collègues
          </p>
          <p className="text-gray-500">
            Une plateforme collaborative pour les étudiants de La Plateforme
          </p>
        </div>

        {/* Application mobile avec iPhone frame */}
        <div className="max-w-5xl mx-auto pt-12 border-t border-gray-200">
          <p className="text-center text-sm font-medium text-gray-900 mb-12">
            Application mobile disponible
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {/* iPhone Frame */}
            <div className="relative">
              <div className="w-[280px] h-[570px] bg-gray-900 rounded-[50px] p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-gray-900 rounded-b-2xl z-10"></div>

                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[40px] overflow-hidden relative">
                  {/* Contenu de l'écran */}
                  <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50">
                    <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-2xl font-bold mb-4">
                      I
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Interville</h2>
                    <p className="text-xs text-gray-600 text-center mb-6">
                      Vos challenges partout avec vous
                    </p>

                    {/* Mockup cards */}
                    <div className="space-y-3 w-full">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="h-2 bg-gray-900 rounded w-3/4 mb-2"></div>
                        <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="h-2 bg-gray-900 rounded w-2/3 mb-2"></div>
                        <div className="h-1.5 bg-gray-300 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons download */}
            <div className="flex flex-col gap-4">
              <div className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer shadow-lg text-center">
                <p className="font-medium">Télécharger sur App Store</p>
                <p className="text-xs text-gray-300 mt-1">iOS</p>
              </div>
              <div className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer shadow-lg text-center">
                <p className="font-medium">Télécharger sur Google Play</p>
                <p className="text-xs text-gray-300 mt-1">Android</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-12 text-center">
            Disponible sur iOS et Android
          </p>
        </div>
      </div>
    </div>
  );
};

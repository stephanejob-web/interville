import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    pseudo: '',
    city: '',
    promo: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmailDomain = (emailAddress) => {
    return emailAddress.endsWith('@laplateforme.io');
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  const validatePasswordLength = (password) => {
    return password.length >= 6;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!validateEmailDomain(userFormData.email)) {
      setErrorMessage('Invalid email. Only @laplateforme.io emails are accepted.');
      setIsLoading(false);
      return;
    }

    if (!validatePasswordMatch(userFormData.password, userFormData.confirmPassword)) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!validatePasswordLength(userFormData.password)) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      // Préparer les données pour l'API (sans confirmPassword)
      const apiData = {
        email: userFormData.email,
        password: userFormData.password,
        pseudo: userFormData.pseudo,
        city: userFormData.city,
        promo: userFormData.promo
      };

      console.log('Registration attempt with:', apiData);
      
      // Ici vous ferez l'appel à votre API
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(apiData)
      // });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Account created successfully! Redirecting to sign in...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6D3' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#8B4513' }}>
            Create Account
          </h1>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={userFormData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black bg-white placeholder-gray-500"
                style={{ focusRingColor: '#D2691E' }}
                placeholder="your.email@laplateforme.io"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Pseudo
              </label>
              <input
                type="text"
                name="pseudo"
                value={userFormData.pseudo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black bg-white"
                style={{ focusRingColor: '#D2691E' }}
                placeholder="darksh3ll"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={userFormData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black bg-white"
                  style={{ focusRingColor: '#D2691E' }}
                  placeholder="toulon"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                  Promo
                </label>
                <input
                  type="text"
                  name="promo"
                  value={userFormData.promo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black bg-white"
                  style={{ focusRingColor: '#D2691E' }}
                  placeholder="2025"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={userFormData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black bg-white"
                style={{ focusRingColor: '#D2691E' }}
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={userFormData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black bg-white"
                style={{ focusRingColor: '#D2691E' }}
                required
                disabled={isLoading}
              />
            </div>

            {errorMessage && (
              <div className="text-red-600 text-sm text-center bg-red-100 p-2 rounded">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="text-green-600 text-sm text-center bg-green-100 p-2 rounded">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#D2691E' }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#8B4513' }}>
              Already have an account?{' '}
              <button
                onClick={navigateToLogin}
                className="font-medium hover:underline"
                style={{ color: '#D2691E' }}
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
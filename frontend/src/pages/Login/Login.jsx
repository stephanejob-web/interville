import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmailDomain = (emailAddress) => {
    return emailAddress.endsWith('@laplateforme.io');
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!validateEmailDomain(email)) {
      setErrorMessage('Invalid email. Only @laplateforme.io emails are accepted.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Login attempt with:', { email, password });
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/');
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6D3' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#8B4513' }}>
            Sign In
          </h1>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-black bg-white placeholder-gray-500"
                style={{ focusRingColor: '#D2691E' }}
                placeholder="your.email@laplateforme.io"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#D2691E' }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#8B4513' }}>
              Don't have an account?{' '}
              <button
                onClick={navigateToRegister}
                className="font-medium hover:underline"
                style={{ color: '#D2691E' }}
                disabled={isLoading}
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
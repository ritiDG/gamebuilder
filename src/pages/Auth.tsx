
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, Gamepad2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        await signup(username, email, password);
      }
      // Redirect happens in auth context
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-game-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Gamepad2 size={32} className="text-game-primary" />
            <h1 className="text-2xl font-bold">Game Builder</h1>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">
              {isLogin ? 'Login to Your Account' : 'Create an Account'}
            </h2>
            <p className="text-gray-400 mt-1">
              {isLogin 
                ? 'Access your created games' 
                : 'Start building awesome games'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="username">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  className="game-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                className="game-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                className="game-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {!isLogin && 'Password must be at least 6 characters'}
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full game-button flex items-center justify-center gap-2"
              disabled={loading}
            >
              {isLogin ? (
                <>
                  <LogIn size={16} />
                  <span>{loading ? 'Logging in...' : 'Log In'}</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>{loading ? 'Creating account...' : 'Sign Up'}</span>
                </>
              )}
            </Button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-game-primary hover:text-game-secondary text-sm"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Log in"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <button
            className="text-gray-500 hover:text-gray-300 text-sm"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

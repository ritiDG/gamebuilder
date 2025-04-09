
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="border-b border-gray-800">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-bold text-game-primary">
          Game Builder
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-400">Welcome, </span>
                <span className="font-medium text-game-primary">{user?.username}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-gray-300 hover:text-white"
                onClick={() => logout()}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="default"
              size="sm"
              className="bg-game-primary hover:bg-game-secondary flex items-center gap-2" 
              onClick={() => navigate('/auth')}
            >
              <UserCircle size={16} />
              <span>Login / Sign Up</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

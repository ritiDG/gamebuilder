
import React, { useState } from 'react';
import { useGames } from '@/contexts/GamesContext';
import { useAuth } from '@/contexts/AuthContext';
import GameCard from '@/components/GameCard';
import Header from '@/components/Header';
import CreateGameForm from '@/components/CreateGameForm';
import { Button } from '@/components/ui/button';
import { Plus, Gamepad2 } from 'lucide-react';

const Index = () => {
  const { games, loading } = useGames();
  const { isAuthenticated } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-game-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-game-primary h-6 w-6" />
            <h1 className="text-2xl font-bold">Game Collection</h1>
          </div>
          
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`game-button flex items-center gap-2 ${showCreateForm ? 'bg-gray-700' : ''}`}
          >
            <Plus size={16} />
            <span>{showCreateForm ? 'Hide Form' : 'Create Game'}</span>
          </Button>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreateGameForm />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-primary"></div>
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                thumbnail={game.thumbnail}
                userId={game.userId}
                createdAt={game.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-lg border border-gray-800 bg-gray-900">
            <Gamepad2 className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No Games Yet</h3>
            <p className="text-gray-500 mb-6">
              {isAuthenticated 
                ? "Let's create your first game!" 
                : "Log in to create your first game!"}
            </p>
            {!isAuthenticated && (
              <Button 
                className="game-button"
                onClick={() => setShowCreateForm(true)}
              >
                Get Started
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGames } from '@/contexts/GamesContext';
import { Minimize2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GameView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { games } = useGames();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No game ID provided');
      setLoading(false);
      return;
    }

    const foundGame = games.find(g => g.id === id);
    if (!foundGame) {
      setError('Game not found');
    } else {
      setGame(foundGame);
    }
    
    setLoading(false);
  }, [id, games]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-game-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-primary"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-game-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Error loading game'}</h1>
          <Button 
            className="game-button flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="p-4 bg-game-background flex items-center justify-between">
        <h1 className="text-xl font-bold truncate">{game.title}</h1>
        <Button 
          className="game-button-secondary flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <Minimize2 size={16} />
          <span>Exit Fullscreen</span>
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="mb-4 text-gray-400">
            This is where your game would be displayed
          </p>
          {game.files.length > 0 ? (
            <p className="text-sm text-gray-600">
              {game.files.length} file(s) uploaded
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              No game files available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameView;

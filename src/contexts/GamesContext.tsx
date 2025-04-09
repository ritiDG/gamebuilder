
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface Game {
  id: string;
  title: string;
  thumbnail: string;
  userId: string;
  createdAt: Date;
  files: File[];
}

interface GamesContextProps {
  games: Game[];
  loading: boolean;
  createGame: (title: string, files: File[]) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  getUserGames: () => Game[];
}

const GamesContext = createContext<GamesContextProps | undefined>(undefined);

export const useGames = () => {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return context;
};

export const GamesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load games from localStorage on mount
  useEffect(() => {
    const storedGames = localStorage.getItem('games');
    if (storedGames) {
      try {
        const parsedGames = JSON.parse(storedGames).map((game: any) => ({
          ...game,
          createdAt: new Date(game.createdAt)
        }));
        setGames(parsedGames);
      } catch (error) {
        console.error('Failed to parse games from localStorage', error);
      }
    }
    setLoading(false);
  }, []);

  // Save games to localStorage when they change
  useEffect(() => {
    if (games.length > 0) {
      localStorage.setItem('games', JSON.stringify(games));
    }
  }, [games]);

  const createGame = async (title: string, files: File[]) => {
    if (!user) {
      toast.error('You must be logged in to create a game');
      return;
    }

    try {
      // Create placeholder thumbnail from first image or default
      let thumbnail = '/placeholder.svg';
      
      // Find the first image file to use as thumbnail
      const imageFile = files.find(file => file.type.startsWith('image/'));
      if (imageFile) {
        thumbnail = URL.createObjectURL(imageFile);
      }

      const newGame: Game = {
        id: 'game-' + Math.random().toString(36).substr(2, 9),
        title,
        thumbnail,
        userId: user.id,
        createdAt: new Date(),
        files
      };

      setGames(prevGames => [newGame, ...prevGames]);
      toast.success('Game created successfully');
      return;
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
    }
  };

  const deleteGame = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete a game');
      return;
    }

    try {
      const gameToDelete = games.find(game => game.id === id);
      
      if (!gameToDelete) {
        toast.error('Game not found');
        return;
      }

      if (gameToDelete.userId !== user.id) {
        toast.error('You can only delete your own games');
        return;
      }

      setGames(prevGames => prevGames.filter(game => game.id !== id));
      toast.success('Game deleted successfully');
      
      // Also update localStorage
      const updatedGames = games.filter(game => game.id !== id);
      localStorage.setItem('games', JSON.stringify(updatedGames));
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error('Failed to delete game');
    }
  };

  const getUserGames = () => {
    if (!user) return [];
    return games.filter(game => game.userId === user.id);
  };

  return (
    <GamesContext.Provider value={{
      games,
      loading,
      createGame,
      deleteGame,
      getUserGames
    }}>
      {children}
    </GamesContext.Provider>
  );
};


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize2, Trash2 } from 'lucide-react';
import { useGames } from '@/contexts/GamesContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GameCardProps {
  id: string;
  title: string;
  thumbnail: string;
  userId: string;
  createdAt: Date;
}

const GameCard = ({ id, title, thumbnail, userId, createdAt }: GameCardProps) => {
  const navigate = useNavigate();
  const { deleteGame } = useGames();
  const { user } = useAuth();
  const isOwner = user?.id === userId;
  const formattedDate = new Date(createdAt).toLocaleDateString();

  const handleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/game/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isOwner) {
      toast.error('You can only delete your own games');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this game?')) {
      await deleteGame(id);
    }
  };

  return (
    <div className="game-card group">
      <div className="relative w-full h-40">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-2">
            <button 
              onClick={handleFullScreen} 
              className="p-2 bg-game-primary rounded-full hover:bg-game-secondary transition-colors"
              title="Fullscreen"
            >
              <Maximize2 size={18} />
            </button>
            
            {isOwner && (
              <button 
                onClick={handleDelete} 
                className="p-2 bg-destructive rounded-full hover:bg-red-700 transition-colors"
                title="Delete game"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-lg truncate">{title}</h3>
        <p className="text-sm text-gray-400">{formattedDate}</p>
      </div>
    </div>
  );
};

export default GameCard;

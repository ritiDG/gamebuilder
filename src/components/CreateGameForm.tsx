
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGames } from '@/contexts/GamesContext';
import { useAuth } from '@/contexts/AuthContext';
import DragDropFiles from './DragDropFiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Code, Upload, Dices } from 'lucide-react';

const CreateGameForm = () => {
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'code'>('upload');
  const { createGame } = useGames();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title for your game');
      return;
    }

    try {
      setIsSubmitting(true);
      await createGame(title, files);
      setTitle('');
      setFiles([]);
      navigate('/');
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Dices className="text-game-primary h-6 w-6" />
        <h2 className="text-xl font-bold">Create New Game</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="title">
            Game Title
          </label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="game-input"
            placeholder="Enter game title"
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 mb-4">
            <Button
              type="button"
              className={`flex-1 ${activeTab === 'upload' ? 'bg-game-primary' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload className="mr-2 h-4 w-4" />
              <span>Upload Files</span>
            </Button>
            
            <Button
              type="button"
              className={`flex-1 ${activeTab === 'code' ? 'bg-game-primary' : 'bg-gray-800 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('code')}
            >
              <Code className="mr-2 h-4 w-4" />
              <span>Write Code</span>
            </Button>
          </div>

          {activeTab === 'upload' ? (
            <DragDropFiles onFilesAdded={handleFilesAdded} />
          ) : (
            <div className="game-input h-64">
              <textarea
                className="w-full h-full bg-transparent resize-none outline-none"
                placeholder="Write your game code here..."
              />
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full game-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Game'}
        </Button>
      </form>
    </div>
  );
};

export default CreateGameForm;

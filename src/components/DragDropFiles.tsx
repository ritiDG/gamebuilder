
import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';

interface DragDropFilesProps {
  onFilesAdded: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  multiple?: boolean;
}

const DragDropFiles = ({ onFilesAdded, maxFiles = 10, accept, multiple = true }: DragDropFilesProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    
    if (!multiple && (files.length > 0 || newFiles.length > 1)) {
      alert('Only one file is allowed');
      return;
    }
    
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    onFilesAdded(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onFilesAdded(updatedFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="w-full">
      <div
        className={`drag-area ${isDragging ? 'border-game-primary bg-gray-900' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept={accept}
          multiple={multiple}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-300">
          Drag and drop your files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {multiple ? `Up to ${maxFiles} files` : 'Only one file'} allowed
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-medium">Uploaded Files</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li 
                key={`${file.name}-${index}`} 
                className="flex items-center justify-between p-2 bg-gray-800 rounded-md"
              >
                <div className="flex items-center space-x-2 truncate flex-grow">
                  {getFileIcon(file) ? (
                    <img 
                      src={getFileIcon(file) || ''} 
                      alt={file.name} 
                      className="w-8 h-8 rounded object-cover" 
                    />
                  ) : (
                    <FileIcon className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1 hover:bg-gray-700 rounded-full"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DragDropFiles;

import React, { useState } from 'react';
import Image from 'next/image';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
};

const ExerciseCard = ({ exercise, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const truncate = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
      onClick={() => onClick(exercise.name)}
    >
      <div className="relative h-48 w-full bg-gray-50 dark:bg-gray-700 overflow-hidden group">
        {!imageError ? (
          <Image 
            src={exercise.image}
            alt={exercise.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-contain object-center transition-all duration-500 transform group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <ExclamationCircleIcon className="h-12 w-12 mb-2 opacity-60" />
            <p className="text-xs">Image not available</p>
          </div>
        )}

        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <div className="absolute bottom-2 right-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-1 cursor-pointer">
          {exercise.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {truncate(exercise.description, 100)}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {exercise.categories.map(category => (
            <span 
              key={category} 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded"
            >
              {category}
            </span>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {exercise.timeToComplete}
          </span>
          <button 
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;

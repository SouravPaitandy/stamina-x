import React, { useState } from 'react';
import Image from 'next/image';
import { ExclamationCircleIcon, ClockIcon, MuscleFillIcon } from '@heroicons/react/24/outline';

const difficultyBadges = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30',
  intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/30'
};

const ExerciseDetailedView = ({ exercise }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!exercise) return null;

  return (
    <div className="space-y-6">
      <div className="relative w-full rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-blue-50 to-gray-100 dark:from-blue-900/20 dark:to-gray-800 mb-6">
        <div className="aspect-[16/9] w-full relative">
          {!imageError ? (
            <Image 
              src={exercise.image} 
              alt={exercise.name}
              fill
              className={`object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <ExclamationCircleIcon className="h-16 w-16 mb-2 opacity-60" />
              <p className="text-sm">Image not available</p>
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className={`text-sm font-medium px-3 py-1 rounded-full border ${difficultyBadges[exercise.difficulty]}`}>
          {exercise.difficulty}
        </span>
        
        <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          {exercise.timeToComplete}
        </span>
        
        {exercise.categories.map(category => (
          <span 
            key={category} 
            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600"
          >
            {category}
          </span>
        ))}
      </div>

      <div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {exercise.description}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Instructions</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {exercise.instructions.map((instruction, index) => (
              <li key={index} className="pl-1">
                <span className="pl-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Expert Tips</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {exercise.tips.map((tip, index) => (
              <li key={index} className="pl-1">
                <span className="pl-1">{tip}</span>
              </li>
            ))}
          </ul>
          
          {exercise.benefits && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Benefits</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {exercise.benefits.map((benefit, index) => (
                  <li key={index} className="pl-1">
                    <span className="pl-1">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {exercise.targetMuscles && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Target Muscles</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles.map((muscle, index) => (
                  <span key={index} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800/30">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailedView;

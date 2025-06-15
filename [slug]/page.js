"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { exerciseData } from '@/utils/exerciseData';
import ExerciseDetailedView from '@/components/ExerciseDetailedView';
import Image from 'next/image';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedExercises, setRelatedExercises] = useState([]);
  
  useEffect(() => {
    if (params.slug) {
      // Decode and clean up the name from URL
      const decodedName = decodeURIComponent(params.slug);
      
      // Find matching exercise
      const exerciseNames = Object.keys(exerciseData);
      const exactMatch = exerciseNames.find(name => 
        name.toLowerCase() === decodedName.toLowerCase()
      );
      
      const fuzzyMatch = exactMatch || exerciseNames.find(name => 
        name.toLowerCase().includes(decodedName.toLowerCase()) || 
        decodedName.toLowerCase().includes(name.toLowerCase())
      );
      
      if (fuzzyMatch) {
        const exerciseDetails = {
          name: fuzzyMatch,
          ...exerciseData[fuzzyMatch]
        };
        setExercise(exerciseDetails);
        
        // Find related exercises (same category)
        if (exerciseDetails.categories && exerciseDetails.categories.length > 0) {
          const category = exerciseDetails.categories[0];
          const related = Object.keys(exerciseData)
            .filter(name => 
              name !== fuzzyMatch && 
              exerciseData[name].categories.includes(category)
            )
            .slice(0, 3)
            .map(name => ({ name, ...exerciseData[name] }));
          
          setRelatedExercises(related);
        }
      }
    }
    
    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Exercise Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find an exercise with that name. Please check the URL or browse our exercise library.
            </p>
            <Link 
              href="/exercises"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse All Exercises
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.push('/exercises')}
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span>Back to exercises</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {exercise.name}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6 order-2 md:order-1">
                <p className="text-gray-700 dark:text-gray-300">
                  {exercise.description}
                </p>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Instructions
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-1">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Tips for Best Results
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-1">
                    {exercise.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4">
                  {exercise.categories && exercise.categories.map(category => (
                    <Link 
                      key={category}
                      href={`/exercises?category=${category}`}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <div 
                  className={`relative w-full rounded-xl overflow-hidden shadow-md
                    bg-gradient-to-br from-blue-50 to-gray-100 dark:from-blue-900/20 dark:to-gray-800 
                    p-2 transition-all duration-300 h-64 sm:h-80 md:h-96
                    ${imageLoaded ? 'border border-blue-200 dark:border-blue-800/50 scale-100' : 'border border-transparent scale-95'}
                    hover:shadow-lg group`}
                >
                  {!imageError ? (
                    <Image 
                      src={exercise.image} 
                      alt={exercise.name}
                      className={`object-contain transition-opacity duration-300 group-hover:opacity-95 rounded-lg
                        ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <ExclamationCircleIcon className="h-16 w-16 mb-2 opacity-60" />
                      <p className="text-sm">Image not available</p>
                      <p className="text-xs mt-1">Please refer to the instructions</p>
                    </div>
                  )}
                  
                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                
                {/* Additional exercise metadata */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {exercise.difficulty && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Difficulty
                      </h4>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {exercise.difficulty}
                      </p>
                    </div>
                  )}
                  
                  {exercise.timeToComplete && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Time to Complete
                      </h4>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {exercise.timeToComplete}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related exercises */}
        {relatedExercises.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Exercises
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedExercises.map((relatedExercise) => (
                <Link 
                  key={relatedExercise.name}
                  href={`/exercises/${getExerciseSlug(relatedExercise.name)}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative h-48 w-full bg-gray-50 dark:bg-gray-700 overflow-hidden group">
                    <img
                      src={relatedExercise.image}
                      alt={relatedExercise.name}
                      className="object-contain w-full h-full transition-all duration-500 transform group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-1">
                      {relatedExercise.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {relatedExercise.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {relatedExercise.categories.map(category => (
                        <span 
                          key={category} 
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

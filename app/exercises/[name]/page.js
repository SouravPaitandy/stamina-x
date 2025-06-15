"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { exerciseData } from '@/utils/exerciseData';
import ExerciseDetailedView from '@/components/ExerciseDetailedView';

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedExercises, setRelatedExercises] = useState([]);
  
  useEffect(() => {
    if (params.name) {
      // Decode and clean up the name from URL
      const decodedName = decodeURIComponent(params.name);
      
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
  }, [params.name]);

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
      <div className="sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="mt-20 flex justify-between items-center">
            <button 
              onClick={() => router.push('/exercises')}
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span>Back to exercises</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <BookmarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <ShareIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {exercise.name}
        </h1>
        
        <ExerciseDetailedView exercise={exercise} />
        
        {relatedExercises.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Related Exercises
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedExercises.map(related => (
                <Link key={related.name} href={`/exercises/${encodeURIComponent(related.name)}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                    {/* <div className="relative h-32 w-full mb-3 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 250px"
                      />
                    </div> */}
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {related.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {related.description.substring(0, 60)}...
                    </p>
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

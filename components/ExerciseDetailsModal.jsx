import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { exerciseData } from '@/utils/exerciseData';
import Link from 'next/link';

const ExerciseDetailsModal = ({ isOpen, closeModal, exerciseName }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Extract exercise name from the routine format
  const extractExerciseName = (fullText) => {
    if (!fullText) return null;


    // Common exercise names to look for
    const exercises = Object.keys(exerciseData);
    
    // Try direct match first
    for (const exercise of exercises) {
      if (fullText.includes(exercise)) {
        return exercise;
      }
    }
    
    // Try to extract the exercise name based on common patterns
    // For example: "🟢 10 Kegels (5-10 sec hold)" → extract "Kegels"
    
    // Pattern 1: Extract words after emoji and numbers
    const patternMatch = fullText.match(/[🟢💪🧠💨🌬️🪑📦🧘‍♂️⚡️🚶🏋️💆🔄]\s*\d*\s*([A-Za-z\s]+)/);
    if (patternMatch && patternMatch[1]) {
      const extractedName = patternMatch[1].trim().replace(/\([^)]*\)/g, '').trim();
      
      // Check if this partial name matches any exercise
      for (const exercise of exercises) {
        if (exercise.toLowerCase().includes(extractedName.toLowerCase()) || 
            extractedName.toLowerCase().includes(exercise.toLowerCase())) {
          return exercise;
        }
      }
    }
    
    // If all else fails, use a generic fallback
    // Look for any capitalized term in the string
    const capitalizedWords = fullText.match(/([A-Z][a-z]+)/g);
    if (capitalizedWords) {
      for (const word of capitalizedWords) {
        for (const exercise of exercises) {
          if (exercise.includes(word)) {
            return exercise;
          }
        }
      }
    }
    
    // If no specific exercise is identified, try to provide general information
    if (fullText.toLowerCase().includes('kegel')) return 'Kegels';
    if (fullText.toLowerCase().includes('breathing')) return 'Box Breathing';
    if (fullText.toLowerCase().includes('core')) return 'Core Activation';
    if (fullText.toLowerCase().includes('glute')) return 'Glute Bridge';
    if (fullText.toLowerCase().includes('relax')) return 'Mindful Relaxation';
    
    return null;
  };
  
  const cleanExerciseName = extractExerciseName(exerciseName);
  const exercise = cleanExerciseName ? exerciseData[cleanExerciseName] : null;
  
  if (!exercise) {
    // Fallback content for when no exercise data is available
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      {exerciseName || 'Exercise Details'}
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={closeModal}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Detailed information for this exercise is not available yet. Please consult your trainer or follow the general guidelines for the exercise name.
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-medium leading-6 text-gray-900 dark:text-white">
                    {cleanExerciseName}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {exercise.description}
                      </p>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {exercise.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Tips:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {exercise.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div 
                        className={`relative w-full rounded-xl overflow-hidden shadow-md
                          bg-gradient-to-br from-blue-50 to-gray-100 dark:from-blue-900/20 dark:to-gray-800 
                          p-2 transition-all duration-300 h-64 sm:h-72 md:h-80
                          ${imageLoaded ? 'border border-blue-200 dark:border-blue-800/50 scale-100' : 'border border-transparent scale-95'}
                          hover:shadow-lg group`}
                      >
                        {!imageError ? (
                          <Image 
                            src={exercise.image} 
                            alt={cleanExerciseName}
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
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 p-2 text-xs text-center text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {cleanExerciseName} illustration
                          <Link href={`/exercises/${cleanExerciseName}`} className='ml-6'>Visit Page</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Got it!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ExerciseDetailsModal;
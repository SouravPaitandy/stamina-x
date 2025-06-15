"use client";

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseDetailsModal from '@/components/ExerciseDetailsModal';
import { getAllExercises, getExercisesByCategory, exerciseCategories } from '@/utils/exerciseData';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load all exercises
    const allExercises = getAllExercises();
    setExercises(allExercises);
    setFilteredExercises(allExercises);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    // Apply filters when category or search query changes
    let result = selectedCategory === 'all' 
      ? exercises 
      : exercises.filter(exercise => exercise.categories.includes(selectedCategory));
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(exercise => 
        exercise.name.toLowerCase().includes(query) || 
        exercise.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredExercises(result);
  }, [selectedCategory, searchQuery, exercises]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const openExerciseDetails = (exerciseName) => {
    setSelectedExercise(exerciseName);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Exercise Library
          </h1>
          <p className="mt-2 text-blue-100 md:text-lg max-w-3xl">
            Explore our comprehensive collection of exercises designed to improve stamina, 
            core strength, and overall wellbeing.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search for exercises..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Filter by:</span>
              <div className="flex flex-wrap gap-2">
                {exerciseCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results summary */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredExercises.length} of {exercises.length} exercises
            {selectedCategory !== 'all' && (
              <span> in {exerciseCategories.find(c => c.id === selectedCategory)?.name}</span>
            )}
            {searchQuery && (
              <span> matching &quot;{searchQuery}&quot;</span>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <ExerciseCard 
                key={exercise.name} 
                exercise={exercise} 
                onClick={openExerciseDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No exercises found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
      
      {/* Exercise Details Modal */}
      <ExerciseDetailsModal 
        isOpen={isModalOpen}
        closeModal={closeModal}
        exerciseName={selectedExercise || ''}
      />
    </div>
  );
}

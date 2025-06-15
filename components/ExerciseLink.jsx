import React from 'react';
import Link from 'next/link';
import { extractExerciseName, exerciseData } from '@/utils/exerciseData';

/**
 * A component that links to an exercise page, handling exercise name extraction
 * 
 * @param {Object} props
 * @param {string} props.exercise - The exercise text which may contain formatting
 * @param {ReactNode} props.children - Optional children to display instead of the exercise name
 * @param {string} props.className - Optional CSS class
 */
const ExerciseLink = ({ exercise, children, className = '', ...props }) => {
  const exerciseName = extractExerciseName(exercise);
  
  if (!exerciseName || !exerciseData[exerciseName]) {
    // If no valid exercise is found, render as plain text
    return <span className={className}>{children || exercise}</span>;
  }
  
  const { slug } = exerciseData[exerciseName];
  
  return (
    <Link 
      href={`/exercises/${slug}`} 
      className={`text-blue-600 hover:underline dark:text-blue-400 ${className}`}
      {...props}
    >
      {children || exercise}
    </Link>
  );
};

export default ExerciseLink;

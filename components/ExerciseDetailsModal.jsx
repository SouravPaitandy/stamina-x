import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const exerciseData = {
  'Kegel Squeezes': {
    description: 'Kegel exercises strengthen the pelvic floor muscles that support the bladder, uterus, and bowels.',
    instructions: [
      'Start by identifying your pelvic floor muscles (the ones you use to stop urination mid-flow)',
      'Tighten these muscles, hold the contraction for 5 seconds, then relax for 5 seconds',
      'Repeat this 10 times, 3 times daily',
      'Gradually work up to holding the contractions for 10 seconds at a time'
    ],
    tips: [
      "Make sure you're not contracting your abdomen, thighs, or buttocks",
      'Breathe normally during the exercises',
      'Can be done sitting, standing, or lying down'
    ],
    image: '/images/exercises/kegel-exercise.svg'
  },
  'Kegel': {
    description: 'Kegel exercises strengthen the pelvic floor muscles that support the bladder, uterus, and bowels.',
    instructions: [
      'Start by identifying your pelvic floor muscles (the ones you use to stop urination mid-flow)',
      'Tighten these muscles, hold the contraction for the specified time, then relax for an equal time',
      'For quick flicks, rapidly contract and release the muscles',
      'For holds, maintain the contraction for the specified duration'
    ],
    tips: [
      "Make sure you're not contracting your abdomen, thighs, or buttocks",
      'Breathe normally during the exercises',
      'Can be done sitting, standing, or lying down'
    ],
    image: '/images/exercises/kegel-exercise.svg'
  },
  'Kegels': {
    description: 'Kegel exercises strengthen the pelvic floor muscles that support the bladder, uterus, and bowels.',
    instructions: [
      'Start by identifying your pelvic floor muscles (the ones you use to stop urination mid-flow)',
      'Tighten these muscles, hold the contraction for the specified time, then relax for an equal time',
      'For quick flicks, rapidly contract and release the muscles',
      'For holds, maintain the contraction for the specified duration'
    ],
    tips: [
      "Make sure you're not contracting your abdomen, thighs, or buttocks",
      'Breathe normally during the exercises',
      'Can be done sitting, standing, or lying down'
    ],
    image: '/images/exercises/kegel-exercise.svg'
  },
  'Box Breathing': {
    description: 'Box breathing (also called square breathing) is a powerful stress-relieving technique that helps regulate the autonomic nervous system.',
    instructions: [
      'Sit upright in a comfortable position',
      'Inhale slowly through your nose for 4 seconds',
      'Hold your breath for 4 seconds',
      'Exhale slowly through your mouth for 4 seconds',
      'Hold your breath for 4 seconds before inhaling again',
      'Repeat for several minutes'
    ],
    tips: [
      'Focus on keeping each phase equal in duration',
      'Visualize drawing the four sides of a square as you breathe',
      'Start with shorter durations if 4 seconds is too challenging'
    ],
    image: '/images/exercises/box-breathing.svg'
  },
  'Glute Bridge': {
    description: 'The glute bridge strengthens your gluteal muscles and activates the pelvic floor, enhancing core stability.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart',
      'Contract your abdominal muscles and glutes',
      'Press through your heels to lift your hips off the floor until your body forms a straight line from shoulders to knees',
      'Hold this position for the recommended time (30-90 seconds)',
      'Lower your hips back to the starting position in a controlled manner'
    ],
    tips: [
      'Keep your core engaged throughout the exercise',
      'Avoid arching your lower back',
      'Focus on using your glutes to power the movement'
    ],
    image: '/images/exercises/glute-bridge.svg'
  },
  'Glute Bridges': {
    description: 'The glute bridge strengthens your gluteal muscles and activates the pelvic floor, enhancing core stability.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart',
      'Contract your abdominal muscles and glutes',
      'Press through your heels to lift your hips off the floor until your body forms a straight line from shoulders to knees',
      'Hold at the top position briefly',
      'Lower your hips back to the starting position in a controlled manner',
      'Repeat for the recommended number of repetitions'
    ],
    tips: [
      'Keep your core engaged throughout the exercise',
      'Avoid arching your lower back',
      'Focus on using your glutes to power the movement'
    ],
    image: '/images/exercises/glute-bridge.svg'
  },
  'Glute Bridge Hold': {
    description: 'The glute bridge strengthens your gluteal muscles and activates the pelvic floor, enhancing core stability.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart',
      'Contract your abdominal muscles and glutes',
      'Press through your heels to lift your hips off the floor until your body forms a straight line from shoulders to knees',
      'Hold this position for the recommended time (30-90 seconds)',
      'Lower your hips back to the starting position in a controlled manner'
    ],
    tips: [
      'Keep your core engaged throughout the exercise',
      'Avoid arching your lower back',
      'Focus on using your glutes to power the movement'
    ],
    image: '/images/exercises/glute-bridge.svg'
  },
  'Pelvic Tilts': {
    description: 'Pelvic tilts help strengthen the abdominal muscles while increasing flexibility in the lower back.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor',
      'Flatten your lower back against the floor by tightening your abdominal muscles and tilting your pelvis upward',
      'Hold for 5 seconds, then release',
      'Perform 10-15 repetitions per set'
    ],
    tips: [
      'Focus on the subtle movement of the pelvis rather than trying to force a large movement',
      'Keep your breathing steady throughout the exercise',
      'Make sure your feet stay flat on the floor'
    ],
    image: '/images/exercises/pelvic-tilt.svg'
  },
  'Mindful Relaxation': {
    description: 'Mindful relaxation promotes awareness of tension in the body and encourages conscious relaxation of muscle groups.',
    instructions: [
      'Find a comfortable position, either sitting or lying down',
      'Close your eyes and focus on your breathing',
      'Scan your body from head to toe, noticing any areas of tension',
      'Consciously release tension in each area as you exhale',
      'Spend 2-3 minutes in this relaxed state'
    ],
    tips: [
      'Try to practice in a quiet environment with minimal distractions',
      'If your mind wanders, gently bring your focus back to your breath',
      'Regular practice improves your ability to relax quickly'
    ],
    image: '/images/exercises/mindful-relaxation.svg'
  },
  'Core Tucks': {
    description: 'Core tucks engage the deep abdominal muscles and help improve control of the pelvic floor.',
    instructions: [
      'Start on all fours with hands under shoulders and knees under hips',
      'Keeping your spine neutral, draw your belly button up toward your spine',
      'Hold this "tucked" position for 2-3 seconds',
      'Release and return to the starting position',
      'Repeat for the recommended number of repetitions'
    ],
    tips: [
      'Focus on the drawing-in movement rather than holding your breath',
      'Maintain a consistent breathing pattern throughout',
      'Keep your back flat – avoid arching or rounding'
    ],
    image: '/images/exercises/core-tuck.svg'
  },
  'Hip Thrusts': {
    description: 'Hip thrusts target the glutes and hamstrings while also engaging the core and pelvic floor muscles.',
    instructions: [
      'Stand with your feet shoulder-width apart',
      'Bend your knees slightly and hinge forward at the hips',
      'Push your hips backward, then thrust forward powerfully while squeezing your glutes',
      'Return to the starting position in a controlled manner',
      'Repeat for the recommended number of repetitions'
    ],
    tips: [
      'Focus on the hip movement rather than bending your knees too much',
      'Engage your core throughout the exercise',
      'Keep your chest up and shoulders back'
    ],
    image: '/images/exercises/hip-thrust.svg'
  },
  'Alternate Nostril Breathing': {
    description: 'This yogic breathing technique helps balance the nervous system and improve respiratory control.',
    instructions: [
      'Sit comfortably with your spine straight',
      'Place your left hand on your left knee',
      'Using your right hand, fold your index and middle fingers toward your palm',
      'Close your right nostril with your thumb and inhale slowly through your left nostril',
      'Close your left nostril with your ring finger, release your thumb, and exhale through your right nostril',
      'Inhale through your right nostril, then close it',
      'Exhale through your left nostril',
      'Continue alternating for 5-10 minutes'
    ],
    tips: [
      'Keep your breathing slow, steady, and controlled',
      'Try to make your inhales and exhales equal in duration',
      "Practice in a quiet place where you won't be disturbed"
    ],
    image: '/images/exercises/alternate-nostril.svg'
  },
  'Deep Diaphragmatic Breathing': {
    description: 'Diaphragmatic breathing engages the diaphragm fully, maximizing oxygen intake and promoting relaxation.',
    instructions: [
      'Lie on your back or sit comfortably with good posture',
      'Place one hand on your chest and the other on your abdomen',
      'Inhale slowly and deeply through your nose, allowing your abdomen to rise while keeping your chest relatively still',
      'Exhale slowly through your mouth or nose, feeling your abdomen fall',
      'Continue for 5-10 minutes, focusing on the movement of your diaphragm'
    ],
    tips: [
      'Focus on breathing with your diaphragm, not your chest',
      'Practice in a quiet, comfortable environment initially',
      'Gradually increase the duration as you become more comfortable with the technique'
    ],
    image: '/images/exercises/diaphragmatic-breathing.svg'
  },
  'Core Engagement': {
    description: 'Core engagement exercises activate the deep stabilizing muscles of the abdomen, improving posture and reducing injury risk.',
    instructions: [
      'Stand, sit, or lie in a comfortable position',
      'Draw your navel toward your spine without holding your breath',
      'Engage your pelvic floor muscles simultaneously',
      'Maintain this contraction for the specified time',
      'Release and repeat as directed'
    ],
    tips: [
      'Focus on keeping your breathing normal throughout',
      'Avoid tensing your shoulders, neck, or face',
      'Think of gently lifting up through your core rather than forcefully contracting'
    ],
    image: '/images/exercises/core-engagement.svg'
  },
  'Core Activation': {
    description: 'Core activation exercises target the deep stabilizing muscles of the abdomen, improving posture and reducing injury risk.',
    instructions: [
      'Stand, sit, or lie in a comfortable position',
      'Draw your navel toward your spine without holding your breath',
      'Engage your pelvic floor muscles simultaneously',
      'Maintain this contraction for the specified time',
      'Release and repeat as directed'
    ],
    tips: [
      'Focus on keeping your breathing normal throughout',
      'Avoid tensing your shoulders, neck, or face',
      'Think of gently lifting up through your core rather than forcefully contracting'
    ],
    image: '/images/exercises/core-engagement.svg'
  },
  'Simple Stretching': {
    description: 'Simple stretching improves flexibility, increases blood flow, and helps reduce muscle tension.',
    instructions: [
      'Begin in a comfortable position',
      'Gently stretch the target muscle or area to a point of mild tension, not pain',
      'Hold each stretch for 15-30 seconds',
      'Breathe deeply and evenly throughout',
      'Release and move to the next stretch'
    ],
    tips: [
      'Never bounce during a stretch',
      'Warm up your muscles before stretching (light movement for 5 minutes)',
      'Focus on relaxation and breathing into the stretch'
    ],
    image: '/images/exercises/simple-stretching.svg'
  },
  'Self-massage': {
    description: 'Self-massage techniques help release muscle tension, improve circulation, and promote relaxation.',
    instructions: [
      'Identify the area of tension or tightness',
      'Apply gentle to moderate pressure using fingers, knuckles, or massage tools',
      'Use circular motions or strokes in the direction of the heart',
      'Spend 1-2 minutes on each area of tension',
      'Follow with gentle stretching of the massaged area'
    ],
    tips: [
      'Use massage oil or lotion to reduce friction',
      'Start with light pressure and gradually increase as needed',
      'If you feel pain (not just good discomfort), reduce pressure or stop'
    ],
    image: '/images/exercises/self-massage.svg'
  },
  'Progressive Muscle Relaxation': {
    description: 'Progressive muscle relaxation involves tensing and then relaxing different muscle groups to reduce physical tension and mental stress.',
    instructions: [
      'Lie down or sit in a comfortable position',
      'Begin with your toes, tighten the muscles for 5 seconds',
      'Release and notice the sensation of relaxation for 10 seconds',
      'Move progressively up through your body (calves, thighs, abdomen, etc.)',
      'Finish with your face and head muscles'
    ],
    tips: [
      'Focus on the contrast between tension and relaxation',
      'Keep your breathing slow and steady throughout',
      'Practice in a quiet environment free from distractions'
    ],
    image: '/images/exercises/progressive-relaxation.svg'
  },
  'Yoga Flow': {
    description: 'Yoga flow combines movement and breath to improve strength, flexibility, and mental focus.',
    instructions: [
      'Begin in a comfortable standing position',
      'Connect your movement with your breath',
      'Flow through a series of poses, maintaining awareness',
      'Move at a pace appropriate for your level',
      'End with a brief relaxation'
    ],
    tips: [
      'Focus on proper alignment rather than pushing into difficult positions',
      'Use modifications as needed for your body',
      'Keep your breathing consistent throughout the practice'
    ],
    image: '/images/exercises/yoga-flow.svg'
  },
  'Bodyweight Squats': {
    description: 'Bodyweight squats strengthen the legs, glutes, and core while improving mobility.',
    instructions: [
      'Stand with feet slightly wider than hip-width apart',
      'Keep your chest up and core engaged',
      'Bend your knees and push your hips back as if sitting in a chair',
      'Lower until your thighs are parallel to the ground (or as low as comfortable)',
      'Push through your heels to return to standing',
      'Repeat for the recommended repetitions'
    ],
    tips: [
      'Keep your weight in your heels',
      'Ensure your knees track over your toes but don\'t extend beyond them',
      'Maintain a neutral spine throughout the movement'
    ],
    image: '/images/exercises/bodyweight-squats.svg'
  },
  'Wall Push-ups': {
    description: 'Wall push-ups are a modified push-up that work the chest, shoulders, and arms with less intensity.',
    instructions: [
      'Stand facing a wall at arm\'s length distance',
      'Place your hands on the wall at shoulder height and width',
      'Keep your body in a straight line from head to heels',
      'Bend your elbows to bring your chest toward the wall',
      'Push back to the starting position',
      'Repeat for the recommended repetitions'
    ],
    tips: [
      'Keep your core engaged throughout the movement',
      'The further your feet are from the wall, the more challenging it will be',
      'Focus on quality over quantity'
    ],
    image: '/images/exercises/wall-pushup.svg'
  },
  'Hip Hinges': {
    description: 'Hip hinges teach proper hip movement pattern while strengthening the posterior chain muscles.',
    instructions: [
      'Stand with feet hip-width apart',
      'Maintain a slight bend in the knees',
      'Hinge at the hips by sending your butt backward',
      'Keep your back flat and core engaged',
      'Lower until you feel a stretch in your hamstrings',
      'Return to standing by squeezing your glutes',
      'Repeat for the recommended repetitions'
    ],
    tips: [
      'Think of pushing your hips back rather than bending forward',
      'Keep your weight centered over the middle of your foot',
      'Maintain a neutral spine throughout the movement'
    ],
    image: '/images/exercises/hip-hinge.svg'
  },
  // Add more exercises as needed
};

const ExerciseDetailsModal = ({ isOpen, closeModal, exerciseName }) => {
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

                    <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="relative h-48 w-full">
                        <Image 
                          src={exercise.image} 
                          alt={cleanExerciseName}
                          className="object-contain"
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Got it, thanks!
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

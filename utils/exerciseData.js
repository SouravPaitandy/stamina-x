/**
 * Central repository for all exercise data
 */

export const exerciseCategories = [
  { id: 'all', name: 'All Exercises' },
  { id: 'pelvic', name: 'Pelvic Floor' },
  { id: 'breathing', name: 'Breathing' },
  { id: 'core', name: 'Core' },
  { id: 'strength', name: 'Strength' },
  { id: 'mobility', name: 'Mobility & Stretching' },
  { id: 'relaxation', name: 'Relaxation' },
];

export const exerciseData = {
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
    image: '/images/exercises/kegel-exercise.svg',
    categories: ['pelvic'],
    difficulty: 'beginner',
    timeToComplete: '5-10 minutes',
    targetMuscles: ['Pelvic floor'],
    benefits: [
      'Stronger pelvic floor muscles',
      'Better bladder control',
      'Improved sexual function'
    ]
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
    image: '/images/exercises/kegel-exercise.svg',
    categories: ['pelvic'],
    difficulty: 'beginner',
    timeToComplete: '5-10 minutes',
    targetMuscles: ['Pelvic floor'],
    benefits: [
      'Stronger pelvic floor muscles',
      'Better bladder control',
      'Improved sexual function'
    ]
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
    image: '/images/exercises/kegel-exercise.svg',
    categories: ['pelvic'],
    difficulty: 'beginner',
    timeToComplete: '5-10 minutes',
    targetMuscles: ['Pelvic floor'],
    benefits: [
      'Stronger pelvic floor muscles',
      'Better bladder control',
      'Improved sexual function'
    ]
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
    image: '/images/exercises/box-breathing.svg',
    categories: ['breathing', 'relaxation'],
    difficulty: 'beginner',
    timeToComplete: '3-10 minutes',
    targetMuscles: ['Diaphragm', 'Respiratory muscles'],
    benefits: [
      'Reduced stress and anxiety',
      'Improved focus and concentration',
      'Regulated nervous system',
      'Better sleep quality'
    ]
  },
  // Continued with more exercises...
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
    image: '/images/exercises/glute-bridge.svg',
    categories: ['strength', 'core', 'pelvic'],
    difficulty: 'beginner',
    timeToComplete: '3-5 minutes',
    targetMuscles: ['Gluteus maximus', 'Hamstrings', 'Lower back', 'Core', 'Pelvic floor'],
    benefits: [
      'Increased hip stability',
      'Improved posture',
      'Stronger glutes and core',
      'Enhanced pelvic floor engagement'
    ]
  },
  // Continue adding all exercises in the same format...
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
    image: '/images/exercises/hip-hinge.svg',
    categories: ['mobility', 'strength'],
    difficulty: 'intermediate',
    timeToComplete: '5 minutes',
    targetMuscles: ['Gluteus maximus', 'Hamstrings', 'Lower back'],
    benefits: [
      'Improved hip mobility',
      'Proper movement patterns for daily activities',
      'Reduced risk of lower back injury',
      'Stronger posterior chain'
    ]
  },
    'Pelvic Tilt': {
    description: 'Pelvic tilts strengthen abdominal and pelvic floor muscles while improving spinal mobility.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor',
      'Engage your abdominal muscles and flatten your lower back against the floor',
      'Tilt your pelvis upward gently, hold for a few seconds, then release',
      'Repeat the movement in a controlled, rhythmic manner'
    ],
    tips: [
      'Keep your shoulders and upper body relaxed',
      'Avoid pressing with your feet; the motion should come from your pelvis',
      'Breathe deeply throughout the movement'
    ],
    image: '/images/exercises/pelvic-tilt.svg',
    categories: ['core', 'pelvic'],
    difficulty: 'beginner',
    timeToComplete: '3-5 minutes',
    targetMuscles: ['Abdominals', 'Pelvic floor', 'Lower back'],
    benefits: [
      'Improved pelvic mobility',
      'Strengthened lower abdominal and pelvic muscles',
      'Relieved lower back tension'
    ]
  },
  'Mindful Relaxation': {
    description: 'Mindful relaxation helps release physical and mental tension through focused awareness and body scanning.',
    instructions: [
      'Lie down or sit comfortably in a quiet place',
      'Close your eyes and take slow, deep breaths',
      'Mentally scan your body from head to toe, noticing areas of tension',
      'As you exhale, imagine releasing the tension from each area',
      'Continue for 5 to 10 minutes, maintaining your focus on bodily sensations'
    ],
    tips: [
      'If your mind wanders, gently bring your focus back to your breath or body',
      'Try doing this before bed or during breaks for added calm',
      'You can combine this with soft background music or guided audio'
    ],
    image: '/images/exercises/mindful-relaxation.svg',
    categories: ['relaxation', 'mindfulness'],
    difficulty: 'beginner',
    timeToComplete: '5-10 minutes',
    targetMuscles: ['Nervous system', 'Mind-body connection'],
    benefits: [
      'Reduced stress and anxiety',
      'Enhanced body awareness',
      'Improved mental clarity and calm'
    ]
  },
  'Core Tuck': {
    description: 'The core tuck activates the deep abdominal muscles and supports overall core strength.',
    instructions: [
      'Lie on your back with your arms by your sides and legs extended',
      'Lift your legs, bend your knees toward your chest, and curl your upper body slightly',
      'Hold briefly at the top, then extend your legs and return to the starting position',
      'Repeat for the recommended repetitions'
    ],
    tips: [
      'Keep your lower back pressed into the floor throughout the movement',
      'Move slowly to engage your core muscles more effectively',
      'Avoid using momentum or pulling on your neck'
    ],
    image: '/images/exercises/core-tuck.svg',
    categories: ['core', 'strength'],
    difficulty: 'intermediate',
    timeToComplete: '5 minutes',
    targetMuscles: ['Rectus abdominis', 'Obliques', 'Hip flexors'],
    benefits: [
      'Stronger and more defined abdominal muscles',
      'Improved core stability',
      'Better posture and spinal support'
    ]
  },
  'Hip Thrust': {
    description: 'Hip thrusts strengthen the glutes and core, improve pelvic control, and support proper posture.',
    instructions: [
      'Sit on the floor with your upper back against a bench and a cushion under your shoulders',
      'Bend your knees and plant your feet firmly on the floor, hip-width apart',
      'Press through your heels and thrust your hips upward until your torso is parallel to the floor',
      'Hold for a moment, then lower your hips back down with control'
    ],
    tips: [
      'Engage your glutes at the top of the movement',
      'Keep your chin tucked to maintain a neutral spine',
      'Avoid arching your back or overextending your hips'
    ],
    image: '/images/exercises/hip-thrust.svg',
    categories: ['strength', 'pelvic', 'core'],
    difficulty: 'intermediate',
    timeToComplete: '5-7 minutes',
    targetMuscles: ['Gluteus maximus', 'Hamstrings', 'Core'],
    benefits: [
      'Increased glute strength and power',
      'Enhanced pelvic and hip control',
      'Improved athletic performance and posture'
    ]
  },
    'Alternate Nostril Breathing': {
    description: 'Alternate nostril breathing (Nadi Shodhana) is a yogic practice that balances the nervous system and calms the mind.',
    instructions: [
      'Sit comfortably with your spine straight and shoulders relaxed',
      'Use your right thumb to close your right nostril and inhale slowly through your left nostril',
      'Close your left nostril with your ring finger and release your thumb to exhale through your right nostril',
      'Inhale through the right nostril, then switch and exhale through the left',
      'Continue alternating for 2–5 minutes'
    ],
    tips: [
      'Breathe gently and naturally without forcing the airflow',
      'Keep your eyes closed and focus on the sensation of the breath',
      'If feeling dizzy, stop and resume normal breathing'
    ],
    image: '/images/exercises/alternate-nostril.svg',
    categories: ['breathing', 'relaxation'],
    difficulty: 'beginner',
    timeToComplete: '2-5 minutes',
    targetMuscles: ['Diaphragm', 'Respiratory system'],
    benefits: [
      'Balanced energy flow',
      'Reduced stress and anxiety',
      'Improved focus and mental clarity'
    ]
  },
  'Diaphragmatic Breathing': {
    description: 'Diaphragmatic (or belly) breathing strengthens the diaphragm and promotes deep, efficient respiration.',
    instructions: [
      'Lie on your back with one hand on your chest and the other on your belly',
      'Inhale deeply through your nose, allowing your belly to rise as you fill your lungs',
      'Exhale slowly through pursed lips, letting your belly fall',
      'Repeat slowly and rhythmically for several minutes'
    ],
    tips: [
      'Focus on moving your belly more than your chest',
      'Practice daily to make it a natural habit',
      'Great to do before bed for relaxation'
    ],
    image: '/images/exercises/diaphragmatic-breathing.svg',
    categories: ['breathing', 'relaxation'],
    difficulty: 'beginner',
    timeToComplete: '3-5 minutes',
    targetMuscles: ['Diaphragm', 'Respiratory muscles'],
    benefits: [
      'Improved breathing efficiency',
      'Reduced anxiety and stress',
      'Enhanced oxygen flow and relaxation'
    ]
  },
  'Core Engagement': {
    description: 'Core engagement activates deep abdominal muscles to support posture, stability, and strength during movement.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor',
      'Draw your belly button gently toward your spine without moving your pelvis',
      'Hold the contraction for a few seconds while breathing normally',
      'Release and repeat for several cycles'
    ],
    tips: [
      'Avoid holding your breath during the contraction',
      'Focus on a subtle, controlled engagement—not a forceful squeeze',
      'Can also be done seated or standing once mastered'
    ],
    image: '/images/exercises/core-engagement.svg',
    categories: ['core', 'posture'],
    difficulty: 'beginner',
    timeToComplete: '3-5 minutes',
    targetMuscles: ['Transverse abdominis', 'Pelvic floor', 'Core'],
    benefits: [
      'Better core stability and posture',
      'Improved body awareness',
      'Foundation for safe movement in other exercises'
    ]
  },
  'Simple Stretching': {
    description: 'A basic full-body stretching routine that improves flexibility, circulation, and overall relaxation.',
    instructions: [
      'Begin with neck rolls, shoulder rolls, and gentle spinal twists',
      'Stretch arms overhead, then reach side to side',
      'Perform hamstring, quadriceps, and calf stretches',
      'Hold each stretch for 15-30 seconds, breathing deeply throughout'
    ],
    tips: [
      'Never stretch to the point of pain—mild tension is enough',
      'Breathe steadily and avoid bouncing',
      'Make it a daily habit to stay limber and energized'
    ],
    image: '/images/exercises/simple-stretching.svg',
    categories: ['mobility', 'relaxation'],
    difficulty: 'beginner',
    timeToComplete: '5-10 minutes',
    targetMuscles: ['Full body'],
    benefits: [
      'Improved flexibility and joint range of motion',
      'Reduced muscle stiffness',
      'Calmer mind and better circulation'
    ]
  },
  'Self Massage': {
    description: 'Self-massage techniques release muscle tension, promote relaxation, and enhance body awareness.',
    instructions: [
      'Use your hands, foam roller, or massage ball on tight or sore areas',
      'Apply gentle pressure in slow circular or back-and-forth motions',
      'Focus on areas like the neck, shoulders, lower back, thighs, and feet',
      'Spend 30 seconds to 1 minute on each area as needed'
    ],
    tips: [
      'Use lotion or oil for smoother gliding',
      'Breathe deeply to enhance relaxation',
      'If an area feels too tender, reduce pressure or skip it'
    ],
    image: '/images/exercises/self-massage.svg',
    categories: ['relaxation', 'recovery'],
    difficulty: 'beginner',
    timeToComplete: '5-10 minutes',
    targetMuscles: ['Various muscle groups'],
    benefits: [
      'Reduced muscle soreness and tension',
      'Improved circulation and lymphatic flow',
      'Enhanced recovery and relaxation'
    ]
  },
    'Progressive Relaxation': {
    description: 'Progressive muscle relaxation involves tensing and relaxing muscle groups to reduce stress and promote awareness of physical tension.',
    instructions: [
      'Find a quiet space and sit or lie down comfortably',
      'Start by tensing the muscles in your feet for 5 seconds, then slowly release',
      'Move upward through the body: legs, abdomen, arms, shoulders, neck, and face',
      'Tense each muscle group for a few seconds, then relax completely',
      'Finish with several deep breaths and notice the overall sense of calm'
    ],
    tips: [
      'Breathe deeply between each muscle group',
      'Avoid holding tension if it causes discomfort or pain',
      'Practice regularly for cumulative benefits'
    ],
    image: '/images/exercises/progressive-relaxation.svg',
    categories: ['relaxation', 'mindfulness'],
    difficulty: 'beginner',
    timeToComplete: '10-15 minutes',
    targetMuscles: ['Full body'],
    benefits: [
      'Reduced physical and mental stress',
      'Increased body awareness',
      'Improved relaxation response and sleep quality'
    ]
  },
  'Yoga Flow': {
    description: 'A gentle yoga flow improves flexibility, balance, and relaxation through a series of mindful postures and breathing.',
    instructions: [
      'Begin with a few deep breaths in mountain pose',
      'Move through poses such as cat-cow, downward dog, cobra, and child’s pose',
      'Hold each posture for several breaths, flowing smoothly from one to the next',
      'End in a seated meditation or savasana to absorb the benefits'
    ],
    tips: [
      'Move with your breath and listen to your body',
      'Modify poses as needed for comfort or accessibility',
      'Use a yoga mat or soft surface for support'
    ],
    image: '/images/exercises/yoga-flow.svg',
    categories: ['mobility', 'relaxation', 'mindfulness'],
    difficulty: 'beginner',
    timeToComplete: '10-15 minutes',
    targetMuscles: ['Full body', 'Core', 'Spine'],
    benefits: [
      'Enhanced flexibility and mobility',
      'Calmer nervous system and improved breath control',
      'Better balance, posture, and stress management'
    ]
  },
  'Bodyweight Squats': {
    description: 'Bodyweight squats build lower body strength, improve posture, and support daily movement patterns.',
    instructions: [
      'Stand with feet shoulder-width apart and toes slightly turned out',
      'Lower your body by bending at the hips and knees as if sitting back into a chair',
      'Keep your chest upright and knees in line with your toes',
      'Lower until thighs are parallel to the floor, then push through your heels to return to standing'
    ],
    tips: [
      'Engage your core and avoid rounding your back',
      'Don’t let your knees cave inward',
      'Use a chair behind you for guidance if needed'
    ],
    image: '/images/exercises/bodyweight-squats.svg',
    categories: ['strength', 'mobility'],
    difficulty: 'beginner',
    timeToComplete: '3-5 minutes',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    benefits: [
      'Improved lower body strength and power',
      'Better mobility and joint health',
      'Supports balance and functional movement'
    ]
  },
  'Wall Pushup': {
    description: 'Wall pushups are a modified version of the traditional pushup that builds upper body strength with less strain.',
    instructions: [
      'Stand facing a wall, arms extended so your palms rest on the wall at shoulder height',
      'Step back slightly to create a diagonal body line',
      'Bend your elbows and lean in toward the wall until your nose almost touches it',
      'Push through your palms to return to the starting position',
      'Repeat for the desired number of reps'
    ],
    tips: [
      'Keep your core tight and body in a straight line',
      'Avoid shrugging your shoulders during the movement',
      'As you get stronger, increase the distance from the wall for more challenge'
    ],
    image: '/images/exercises/wall-pushups.svg',
    categories: ['strength', 'upper body'],
    difficulty: 'beginner',
    timeToComplete: '3-5 minutes',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    benefits: [
      'Upper body strength without floor pressure',
      'Improved shoulder stability and control',
      'Gentle intro to pushup form for all levels'
    ]
  },
};

/**
 * Get all exercises sorted in a human-readable format
 */
export function getAllExercises() {
  return Object.keys(exerciseData).map(name => ({
    name,
    ...exerciseData[name]
  })).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Filter exercises by category
 */
export function getExercisesByCategory(category) {
  if (category === 'all') {
    return getAllExercises();
  }
  
  return getAllExercises().filter(exercise => 
    exercise.categories.includes(category)
  );
}

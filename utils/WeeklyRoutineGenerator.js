/**
 * Weekly Routine Generator
 * Generates different routines based on the day of the week
 */

// Weekly routine structure categorized by day
const WEEKLY_PLAN = {
  0: { // Sunday
    name: 'Sunday',
    focus: 'Rest or Light Yoga',
    description: 'Let body recover fully',
    routines: {
      beginner: [
        "🧘‍♂️ 5 min Simple Stretching",
        "💆 Self-massage for Tension Release",
        "🌬️ 2 min Deep Breathing"
      ],
      intermediate: [
        "🧘‍♂️ 10 min Gentle Yoga Flow",
        "💆 Progressive Muscle Relaxation",
        "🌬️ 5 min Mindfulness Breathing",
        "🔄 Light Joint Mobility Work"
      ],
      advanced: [
        "🧘‍♂️ 15 min Restorative Yoga",
        "💆 Full Body Self-massage Routine",
        "🌬️ 10 min Meditation Practice",
        "🔄 Dynamic Stretching Sequence",
        "🧠 Body Scan Meditation"
      ]
    }
  },
  1: { // Monday
    name: 'Monday',
    focus: 'Full Routine',
    description: 'Core + Kegels heavy',
    routines: {
      beginner: [
        "🟢 10 Kegel Squeezes (5 sec hold)",
        "💪 10 Glute Bridges",
        "🧠 Core Engagement Practice (30 sec)",
        "💨 3 Rounds Box Breathing (4-4-4-4)"
      ],
      intermediate: [
        "🟢 20 Kegels (mix of quick and 5-10 sec holds)",
        "💪 15 Glute Bridges with 5 sec hold",
        "🧠 Core Activation Sequence (60 sec)",
        "💨 5 Rounds of Deep Diaphragmatic Breathing",
        "🪑 3 sets of Pelvic Tilts (10 reps)"
      ],
      advanced: [
        "🟢 3 sets of 15 Kegels (10 sec hold)",
        "💪 20 Glute Bridges with leg extensions",
        "🧠 Comprehensive Core Circuit (90 sec)",
        "💨 10 min Alternate Nostril Breathing",
        "🪑 4 sets of Pelvic Floor Elevations",
        "⚡️ Advanced Tension/Release Practice"
      ]
    }
  },
  2: { // Tuesday
    name: 'Tuesday',
    focus: 'Cardio + Light Core',
    description: '20 min brisk walk + Kegels',
    routines: {
      beginner: [
        "🚶 15 min Walk (moderately paced)",
        "🟢 5 Kegel Squeezes during walk",
        "💨 3 min Deep Breathing post-walk",
        "🧠 Light Core Activation (5 reps)"
      ],
      intermediate: [
        "🚶 20 min Brisk Walk with Interval Speed-ups",
        "🟢 10 Kegel Sets during walk (5 sec each)",
        "💨 5 min Controlled Breathing Recovery",
        "🧠 Standing Core Exercises (2 sets of 10 reps)",
        "🔄 5 min Cool Down Stretches"
      ],
      advanced: [
        "🚶 25 min Power Walk or Light Jog with Intervals",
        "🟢 15 Kegel Sequences during cardio (varying intensity)",
        "💨 7 min Respiratory Control Practice",
        "🧠 Dynamic Core Series (3 sets of 12 reps)",
        "🔄 10 min Comprehensive Cooldown",
        "⚡️ Tension Recognition & Release Exercise"
      ]
    }
  },
  3: { // Wednesday
    name: 'Wednesday',
    focus: 'Strength Focus',
    description: 'Glutes + Upper Body',
    routines: {
      beginner: [
        "💪 10 Bodyweight Squats",
        "🏋️ 5 Wall Push-ups",
        "🟢 5 Kegels with Glute Engagement",
        "🪑 Hip Hinges (5 reps)"
      ],
      intermediate: [
        "💪 15 Bodyweight Squats with Pause",
        "🏋️ 10 Incline Push-ups",
        "🟢 10 Kegels with Glute Squeeze Combination",
        "🪑 Hip Bridges with Single Leg Extension (8 each side)",
        "🧠 Core Bracing Practice (30 sec)"
      ],
      advanced: [
        "💪 20 Squat Variations (standard, pulsing, wide stance)",
        "🏋️ 15 Standard Push-ups or Variations",
        "🟢 Advanced Kegel Circuit with Movement Integration",
        "🪑 Single-leg Deadlift Movements (12 each side)",
        "🧠 Full Core Engagement with Extremity Movement",
        "⚡️ Standing Hip Stability Work"
      ]
    }
  },
  4: { // Thursday
    name: 'Thursday',
    focus: 'Yoga + Stretch + Kegels',
    description: 'Full body release',
    routines: {
      beginner: [
        "🧘‍♂️ Simple Standing Flow (5 min)",
        "🟢 5 Kegels in Yogic Postures",
        "🌬️ Mindful Breathing with Movement",
        "💆 Gentle Hip Openers"
      ],
      intermediate: [
        "🧘‍♂️ 15 min Yoga Flow with Focus on Hips",
        "🟢 10 Kegels Integrated into Various Poses",
        "🌬️ Breath-synchronized Movement Practice",
        "💆 Deep Hip and Lower Back Release Sequence",
        "🧠 Body Awareness Meditation (3 min)"
      ],
      advanced: [
        "🧘‍♂️ 25 min Comprehensive Yoga Sequence",
        "🟢 Advanced Pelvic Floor Work in Multiple Positions",
        "🌬️ Full Pranayama Practice",
        "💆 Targeted Fascia Release for Hips and Pelvic Region",
        "🧠 Moving Meditation with Pelvic Awareness",
        "⚡️ Advanced Balance Poses with Pelvic Floor Engagement"
      ]
    }
  },
  5: { // Friday
    name: 'Friday',
    focus: 'Full Routine',
    description: 'Repeat Monday',
    routines: {
      beginner: [
        "🟢 10 Kegel Squeezes (5 sec hold)",
        "💪 10 Glute Bridges",
        "🧠 Core Engagement Practice (30 sec)",
        "💨 3 Rounds Box Breathing (4-4-4-4)"
      ],
      intermediate: [
        "🟢 20 Kegels (mix of quick and 5-10 sec holds)",
        "💪 15 Glute Bridges with 5 sec hold",
        "🧠 Core Activation Sequence (60 sec)",
        "💨 5 Rounds of Deep Diaphragmatic Breathing",
        "🪑 3 sets of Pelvic Tilts (10 reps)"
      ],
      advanced: [
        "🟢 3 sets of 15 Kegels (10 sec hold)",
        "💪 20 Glute Bridges with leg extensions",
        "🧠 Comprehensive Core Circuit (90 sec)",
        "💨 10 min Alternate Nostril Breathing",
        "🪑 4 sets of Pelvic Floor Elevations",
        "⚡️ Advanced Tension/Release Practice"
      ]
    }
  },
  6: { // Saturday
    name: 'Saturday',
    focus: 'Core + Mind',
    description: 'Add breathwork, go slow',
    routines: {
      beginner: [
        "🧠 Core Activation (3 sets of 5)",
        "🟢 Slow Kegels with Breath (5 reps)",
        "🌬️ 5 min Mindful Breathing",
        "💆 Progressive Relaxation"
      ],
      intermediate: [
        "🧠 Complete Core Series (3 sets of 10)",
        "🟢 Kegel Variations with Visualization (10 reps)",
        "🌬️ 8 min Breath Control Practice",
        "💆 Body Scanning Meditation",
        "💪 Slow-motion Movement with Awareness"
      ],
      advanced: [
        "🧠 Advanced Core Integration (4 sets of 12)",
        "🟢 Full Pelvic Floor Control Sequence",
        "🌬️ 12 min Advanced Breathwork",
        "💆 Deep Somatic Awareness Practice",
        "💪 Mind-Muscle Connection Enhancement Drills",
        "⚡️ Integrated Movement with Breath Synchronization"
      ]
    }
  }
};

/**
 * Returns the routine for the current day of the week and user's level
 * @param {string} level - User's current level (beginner, intermediate, advanced)
 * @param {Date} date - Optional date object (defaults to today)
 * @returns {Object} The routine data for the specified day
 */
export function getDailyRoutine(level = 'beginner', date = new Date()) {
  const dayOfWeek = date.getDay(); // 0-6, where 0 is Sunday
  const dayData = WEEKLY_PLAN[dayOfWeek];
  
  return {
    dayName: dayData.name,
    focus: dayData.focus,
    description: dayData.description,
    exercises: dayData.routines[level] || dayData.routines.beginner // Fallback to beginner if level not found
  };
}

/**
 * Returns the complete weekly plan
 * @returns {Object} The complete weekly plan structure
 */
export function getWeeklyPlan() {
  return WEEKLY_PLAN;
}

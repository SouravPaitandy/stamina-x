import React from 'react';
import { getWeeklyPlan } from '@/utils/WeeklyRoutineGenerator';

export default function WeeklySchedule() {
  const weeklyPlan = getWeeklyPlan();
  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 0, name: 'Sunday' },
  ];

  const today = new Date().getDay();
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Weekly Training Plan
        </h2>
        
        <div className="space-y-4">
          {days.map((day) => {
            const dayPlan = weeklyPlan[day.id];
            const isToday = today === day.id;
            
            return (
              <div 
                key={day.id} 
                className={`p-4 rounded-lg border ${
                  isToday 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-medium ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {day.name}
                      {isToday && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">Today</span>}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium">{dayPlan.focus}</span> - {dayPlan.description}
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                    {dayPlan.routines.intermediate.length} exercises
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

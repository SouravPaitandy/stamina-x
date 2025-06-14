"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarIcon, TrophyIcon, ClockIcon, ChartBarIcon, FireIcon, ArrowUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import ExerciseDetailsModal from '@/components/ExerciseDetailsModal';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { getDailyRoutine } from '@/utils/WeeklyRoutineGenerator';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [level, setLevel] = useState("beginner");
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [progressData, setProgressData] = useState([]);
  const [showingRoutine, setShowingRoutine] = useState(true);
  const [activeTab, setActiveTab] = useState('routine');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Calendar visualization variables (from progress page)
  const [calendarView, setCalendarView] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  
  const [selectedDay, setSelectedDay] = useState(new Date()); // Default to today
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const dailyRoutineData = getDailyRoutine(level, selectedDay);
  const routine = dailyRoutineData.exercises; // Replace the old ROUTINES[level] with dynamic daily exercises

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userRef = doc(db, "progress", u.uid);
        const userProfileRef = doc(db, "users", u.uid);
        
        // Check if document exists, if not create it
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, { 
            days: [], 
            level: "beginner",
            streak: 0,
            totalCompleted: 0
          });
        } else {
          // Load user preferences and progress
          const userData = docSnap.data();
          if (userData.level) setLevel(userData.level);
          if (userData.streak) setStreak(userData.streak);
          if (userData.totalCompleted) setTotalCompleted(userData.totalCompleted);
          
          // Check if today's routine is already completed
          if (userData.days && userData.days.includes(today)) {
            const routineLength = routine.length;
            const newCompleted = {};
            for (let i = 0; i < routineLength; i++) {
              newCompleted[i] = true;
            }
            setCompleted(newCompleted);
          }
          
          // Generate progress chart data
          if (userData.days) {
            const last30Days = generateLast30DaysData(userData.days);
            setProgressData(last30Days);
          }
        }
        
        // Get user profile data
        const profileSnap = await getDoc(userProfileRef);
        if (!profileSnap.exists()) {
          // Create profile document if it doesn't exist
          await setDoc(userProfileRef, {
            displayName: u.displayName || u.email.split('@')[0],
            email: u.email,
            photoURL: u.photoURL || null,
            createdAt: new Date()
          });
          setUserProfile({
            displayName: u.displayName || u.email.split('@')[0],
            email: u.email,
            photoURL: u.photoURL || null
          });
        } else {
          setUserProfile(profileSnap.data());
        }
        
        // Set up real-time listener
        onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            if (userData.streak) setStreak(userData.streak);
            if (userData.totalCompleted) setTotalCompleted(userData.totalCompleted);
          }
        });
        
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    
    return () => unsub();
  }, [router]);

  // Generate the last 30 days of data for the chart
  const generateLast30DaysData = (completedDays) => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      data.push({
        date: dateString,
        completed: completedDays.includes(dateString) ? 1 : 0
      });
    }
    
    return data;
  };

  const toggleComplete = async (i) => {
    const newCompleted = { ...completed, [i]: !completed[i] };
    setCompleted(newCompleted);

    // Check if all are completed
    const allDone = routine.every((_, idx) => newCompleted[idx]);
    if (allDone) {
      const userRef = doc(db, "progress", user.uid);
      const docSnap = await getDoc(userRef);
      const userData = docSnap.data();
      
      // Only update if not already completed today
      if (!userData.days.includes(today)) {
        // Calculate streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        let newStreak = 1;
        if (userData.days.includes(yesterdayString)) {
          newStreak = userData.streak + 1;
        }
        
        // Update database
        await updateDoc(userRef, { 
          days: arrayUnion(today),
          streak: newStreak,
          level,
          totalCompleted: (userData.totalCompleted || 0) + 1
        });
        
        // Update local state
        setStreak(newStreak);
        setTotalCompleted((prev) => prev + 1);
        
        // Update progress chart
        const newProgressData = [...progressData];
        const todayIndex = newProgressData.findIndex(item => item.date === today);
        if (todayIndex !== -1) {
          newProgressData[todayIndex].completed = 1;
          setProgressData(newProgressData);
        }
      }
    }
  };
  
  const handleLevelChange = async (newLevel) => {
    setLevel(newLevel);
    setCompleted({});
    
    // Save user preference to database
    if (user) {
      const userRef = doc(db, "progress", user.uid);
      await updateDoc(userRef, { level: newLevel });
    }
  };
  
  // Generate calendar days for the month/year view
  useEffect(() => {
    if (progressData.length === 0) return;
    
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    
    const days = [];
    // Add empty slots for days before the first of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, completed: false });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day).toISOString().split('T')[0];
      const dayData = progressData.find(d => d.date === date);
      days.push({
        day,
        date,
        completed: dayData ? dayData.completed === 1 : false
      });
    }
    
    setCalendarDays(days);
  }, [selectedMonth, selectedYear, progressData]);
  
  // Generate previous months for dropdown
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Show up to 12 months in the past
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date();
      monthDate.setMonth(currentDate.getMonth() - i);
      
      options.push({
        month: monthDate.getMonth(),
        year: monthDate.getFullYear(),
        label: monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
      });
    }
    
    return options;
  };
  
  // Handle month selection change
  const handleMonthChange = (e) => {
    const [month, year] = e.target.value.split('-');
    setSelectedMonth(parseInt(month, 10));
    setSelectedYear(parseInt(year, 10));
  };
  
  // Mark a specific day as complete (for calendar view)
  const markDayComplete = async (date) => {
    if (!user) return;
    
    const userRef = doc(db, "progress", user.uid);
    const docSnap = await getDoc(userRef);
    const userData = docSnap.data();
    
    // Only update if not already completed
    if (!userData.days.includes(date)) {
      const yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      let newStreak = 1;
      if (userData.days.includes(yesterdayString)) {
        newStreak = userData.streak + 1;
      }
      
      // Update database
      await updateDoc(userRef, { 
        days: arrayUnion(date),
        streak: newStreak,
        level,
        totalCompleted: (userData.totalCompleted || 0) + 1
      });
      
      // Update local state
      setStreak(newStreak);
      setTotalCompleted((prev) => prev + 1);
      
      // Update progress chart data
      const newProgressData = [...progressData];
      const dateIndex = newProgressData.findIndex(item => item.date === date);
      if (dateIndex !== -1) {
        newProgressData[dateIndex].completed = 1;
        setProgressData(newProgressData);
      }
    }
  };

  // Open exercise details modal
  const openExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  // New function to handle day selection
  const handleDayChange = (date) => {
    setSelectedDay(date);
    setCompleted({}); // Reset completed status when changing days
  };

  // Function to format date as "Day, Month Date"
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mt-10 mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back {user.displayName.split(" ")[0] || user.email.split('@')[0]}!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and complete today's exercises.
          </p>
        </div>

        {/* Profile Overview */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                {userProfile?.displayName ? userProfile.displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {userProfile?.displayName || 'User'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link 
                href="/profile" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Profile
              </Link>
              
            </div>
          </div>
          {user?.emailVerified === false && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    Your email is not verified. Please check your inbox and verify your email.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FireIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{streak} days</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <TrophyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Workouts Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCompleted}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <ArrowUpIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{level}</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('routine')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'routine'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Today's Routine
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'progress'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Progress
            </button>
          </nav>
        </div>
        
        {/* Routine Content */}
        {activeTab === 'routine' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {dailyRoutineData.focus}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dailyRoutineData.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center mt-2 sm:mt-0">
                      <button
                        onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
                        className="flex items-center px-3 py-1 mr-2 text-xs font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        <InformationCircleIcon className="h-4 w-4 mr-1" />
                        Weekly Plan
                      </button>
                      
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="h-4 w-4" />
                        <select 
                          value={selectedDay.toISOString().split('T')[0]} 
                          onChange={(e) => handleDayChange(new Date(e.target.value))}
                          className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer pr-6"
                        >
                          {[...Array(7)].map((_, idx) => {
                            const date = new Date();
                            date.setDate(date.getDate() - date.getDay() + idx);
                            return (
                              <option 
                                key={idx} 
                                value={date.toISOString().split('T')[0]}
                              >
                                {formatDisplayDate(date)}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {showWeeklyPlan && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Weekly Training Plan</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <thead>
                            <tr className="text-left text-gray-600 dark:text-gray-400">
                              <th className="py-2 pr-4">Day</th>
                              <th className="py-2 px-4">Focus</th>
                              <th className="py-2 pl-4">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="py-2 pr-4 font-medium">Monday</td>
                              <td className="py-2 px-4">Full Routine</td>
                              <td className="py-2 pl-4">Core + Kegels heavy</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="py-2 pr-4 font-medium">Tuesday</td>
                              <td className="py-2 px-4">Cardio + Light Core</td>
                              <td className="py-2 pl-4">20 min brisk walk + Kegels</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="py-2 pr-4 font-medium">Wednesday</td>
                              <td className="py-2 px-4">Strength Focus</td>
                              <td className="py-2 pl-4">Glutes + Upper Body</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="py-2 pr-4 font-medium">Thursday</td>
                              <td className="py-2 px-4">Yoga + Stretch + Kegels</td>
                              <td className="py-2 pl-4">Full body release</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="py-2 pr-4 font-medium">Friday</td>
                              <td className="py-2 px-4">Full Routine</td>
                              <td className="py-2 pl-4">Repeat Monday</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="py-2 pr-4 font-medium">Saturday</td>
                              <td className="py-2 px-4">Core + Mind</td>
                              <td className="py-2 pl-4">Add breathwork, go slow</td>
                            </tr>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td className="py-2 pr-4 font-medium">Sunday</td>
                              <td className="py-2 px-4">Rest or light yoga</td>
                              <td className="py-2 pl-4">Let body recover fully</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {routine.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg transition-colors ${
                          completed[idx]
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30'
                            : 'bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            <input
                              type="checkbox"
                              checked={!!completed[idx]}
                              onChange={() => toggleComplete(idx)}
                              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-md font-medium ${
                                completed[idx]
                                  ? 'line-through text-green-600 dark:text-green-400'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {step}
                            </p>
                          </div>
                          <button 
                            onClick={() => openExerciseDetails(step)}
                            className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="View exercise details"
                          >
                            <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {Object.keys(completed).length === routine.length &&
                    routine.every((_, idx) => completed[idx]) && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            Great job! You've completed today's routine!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right sidebar */}
            <div>
              {/* Day overview card - New */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Today's Focus: {dailyRoutineData.focus}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {dailyRoutineData.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Day</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {dailyRoutineData.dayName}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Exercises</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {routine.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Level selector and other sidebar content */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Training Level
                </h3>
                {/* ...existing sidebar content... */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select your level:
                    </label>
                    <div className="mt-2">
                      <select
                        value={level}
                        onChange={(e) => handleLevelChange(e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Rest of level information */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Level Information
                    </h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Exercises</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {routine.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Est. Time</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {level === 'beginner' ? '10-15 min' : level === 'intermediate' ? '15-20 min' : '25-30 min'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {level === 'beginner' ? 'Easy' : level === 'intermediate' ? 'Moderate' : 'Challenging'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Benefits
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Improved muscular endurance
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Enhanced control & awareness
                      </li>
                      <li className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Increased confidence
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Watch our tutorial videos or read detailed guides to perfect your technique.
                </p>
                <Link href="/tutorials" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  View Tutorials
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress Content */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* View toggle */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Progress
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCalendarView(false)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                          !calendarView
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        Chart
                      </button>
                      <button
                        onClick={() => setCalendarView(true)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                          calendarView
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        Calendar
                      </button>
                    </div>
                  </div>
                </div>
                
                {!calendarView ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData} margin={{ top: 5, right: 20, bottom: 20, left: -20 }}>
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          interval={6}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          domain={[0, 1]}
                          tickCount={2}
                          tickFormatter={(value) => value === 0 ? 'No' : 'Yes'}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                            borderColor: '#E5E7EB',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }} 
                          formatter={(value, name) => [value ? 'Completed' : 'Not completed', 'Status']}
                          labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="completed" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div>
                    {/* Calendar month selector */}
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {new Date(selectedYear, selectedMonth).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                      </h3>
                      <select
                        value={`${selectedMonth}-${selectedYear}`}
                        onChange={handleMonthChange}
                        className="block rounded-md border-gray-300 dark:border-gray-700 shadow-sm py-1.5 px-3 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {getMonthOptions().map((option) => (
                          <option key={`${option.month}-${option.year}`} value={`${option.month}-${option.year}`}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Calendar grid */}
                    <div className="mb-6">
                      <div className="grid grid-cols-7 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1.5">
                        {calendarDays.map((day, i) => (
                          <div
                            key={i}
                            className={`aspect-square flex items-center justify-center rounded-md ${
                              day.day === null
                                ? 'opacity-0'
                                : day.completed
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer'
                            }`}
                            onClick={() => day.day !== null && !day.completed ? markDayComplete(day.date) : null}
                          >
                            {day.day !== null && (
                              <>
                                {day.day}
                                {day.completed && (
                                  <svg className="h-3 w-3 ml-0.5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click on a day to mark it as completed.
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Green dates indicate completed workouts.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Best Streak</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{Math.max(streak, 5)} days</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                    <FireIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {progressData.filter(d => {
                        const date = new Date(d.date);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && d.completed === 1;
                      }).length} days
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                    <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consistency</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {Math.round((progressData.filter(d => d.completed === 1).length / progressData.length) * 100)}%
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md">
                    <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Workouts</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {totalCompleted}
                    </p>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-md">
                    <TrophyIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Workout Pattern
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                    // Calculate how many workouts completed on this day of week
                    const completedOnDay = progressData.filter(d => {
                      const date = new Date(d.date);
                      return date.getDay() === i && d.completed === 1;
                    }).length;
                    
                    // Calculate intensity (0-4)
                    const max = Math.max(...[0, 1, 2, 3, 4, 5, 6].map(day => 
                      progressData.filter(d => {
                        const date = new Date(d.date);
                        return date.getDay() === day && d.completed === 1;
                      }).length
                    ));
                    
                    const intensity = max === 0 ? 0 : Math.ceil((completedOnDay / max) * 4);
                    
                    return (
                      <div key={day} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day}</span>
                        <div 
                          className={`w-full aspect-square rounded-sm ${
                            intensity === 0 ? 'bg-gray-100 dark:bg-gray-700' :
                            intensity === 1 ? 'bg-blue-100 dark:bg-blue-900/30' :
                            intensity === 2 ? 'bg-blue-200 dark:bg-blue-800/50' :
                            intensity === 3 ? 'bg-blue-300 dark:bg-blue-700/70' :
                            'bg-blue-400 dark:bg-blue-600/90'
                          }`}
                          title={`${completedOnDay} workouts on ${day}`}
                        ></div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Darker colors indicate days with more activity.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Level Progress
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current: {level}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {totalCompleted}/
                      {level === 'beginner' ? '20' : level === 'intermediate' ? '40' : '60'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                      style={{
                        width: `${Math.min(100, level === 'beginner' 
                          ? (totalCompleted / 20) * 100 
                          : level === 'intermediate' 
                          ? (totalCompleted / 40) * 100 
                          : (totalCompleted / 60) * 100
                        )}%`
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={`flex items-center ${level === 'beginner' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full mr-3 ${level === 'beginner' ? 'bg-blue-600 dark:bg-blue-400' : 'border border-gray-300 dark:border-gray-600'}`}></div>
                    <span>Beginner</span>
                  </div>
                  <div className={`flex items-center ${level === 'intermediate' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full mr-3 ${level === 'intermediate' ? 'bg-blue-600 dark:bg-blue-400' : 'border border-gray-300 dark:border-gray-600'}`}></div>
                    <span>Intermediate</span>
                  </div>
                  <div className={`flex items-center ${level === 'advanced' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    <div className={`w-4 h-4 rounded-full mr-3 ${level === 'advanced' ? 'bg-blue-600 dark:bg-blue-400' : 'border border-gray-300 dark:border-gray-600'}`}></div>
                    <span>Advanced</span>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Complete more workouts to progress to the next level. Each level unlocks more advanced exercises.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Motivation Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-white text-2xl font-bold mb-2">Stay Consistent!</h2>
              <p className="text-blue-100 text-sm md:text-base max-w-lg">
                Regular practice is key to improvement. Just 10-15 minutes a day can lead to significant gains in stamina and control.
              </p>
            </div>
            <div>
              <Link 
                href="/tips" 
                className="inline-block px-5 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-150 ease-in-out"
              >
                View Tips & Advice
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exercise Details Modal */}
      <ExerciseDetailsModal 
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        exerciseName={selectedExercise || ''}
      />
    </div>
  );
}

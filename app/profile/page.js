"use client";

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword, signOut, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  CameraIcon, 
  KeyIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  BellIcon,
  SunIcon,
  LanguageIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [activeSection, setActiveSection] = useState('profile'); // profile, password, danger
  const router = useRouter();

  // Add new state variables for settings
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationVolume, setNotificationVolume] = useState(50);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Fetch user profile data
          const userProfileRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userProfileRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserProfile(userData);
            setFormData({
              displayName: userData.displayName || '',
              email: currentUser.email,
              newPassword: '',
              confirmPassword: ''
            });
            
            // Set settings values from user data if they exist
            if (userData.settings) {
              // setDarkMode(userData.settings.darkMode ?? false);
              setLanguage(userData.settings.language || "en");
              setEmailNotifications(userData.settings.emailNotifications ?? true);
              setPushNotifications(userData.settings.pushNotifications ?? false);
              setNotificationVolume(userData.settings.notificationVolume ?? 50);
            }
          }
          
          // Fetch progress data
          const progressRef = doc(db, "progress", currentUser.uid);
          const progressSnap = await getDoc(progressRef);
          
          if (progressSnap.exists()) {
            setProgressData(progressSnap.data());
          } else {
            console.log("No progress data found");
            // Initialize with default values if progress data doesn't exist
            setProgressData({
              streak: 0,
              totalCompleted: 0,
              level: 'beginner'
            });
          }
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (activeSection === 'profile') {
      if (!formData.displayName.trim()) {
        errors.displayName = 'Display name is required';
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
      }
    }
    
    if (activeSection === 'password') {
      if (formData.newPassword && formData.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setUpdating(true);
    
    try {
      let photoURL = userProfile?.photoURL || null;
      
      // Upload new photo if selected
      if (photoFile) {
        const storageRef = ref(storage, `user_avatars/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      
      // Update auth profile
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: photoURL
      });
      
      // Update Firestore profile
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        photoURL: photoURL,
        updatedAt: new Date().toISOString()
      });
      
      // Update email if changed
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
        await updateDoc(userRef, { email: formData.email });
      }
      
      setUserProfile(prev => ({
        ...prev,
        displayName: formData.displayName,
        photoURL: photoURL,
        email: formData.email
      }));
      
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setUpdating(true);
    
    try {
      await updatePassword(user, formData.newPassword);
      
      setFormData({
        ...formData,
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      alert(`Error updating password: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert(`Error signing out: ${error.message}`);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Delete user data from Firestore
        await updateDoc(doc(db, "users", user.uid), {
          deleted: true,
          deletedAt: new Date().toISOString()
        });
        
        // Delete user authentication account
        await deleteUser(user);
        
        router.push('/login');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert(`Error deleting account: ${error.message}`);
      }
    }
  };

  const handleUpdateSettings = async (settingType) => {
    setUpdating(true);
    
    try {
      // Create settings object based on setting type
      let settingsUpdate = {};
      
      if(settingType === 'notifications') {
        settingsUpdate = {
          'settings.emailNotifications': emailNotifications,
          'settings.pushNotifications': pushNotifications,
          'settings.notificationVolume': notificationVolume
        };
      }
      
      // Update Firestore profile
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, settingsUpdate);
      
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert(`Error updating settings: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile information and account preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
              <div className="p-6 flex flex-col items-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
                  {userProfile?.photoURL ? (
                    <img 
                      src={photoPreview || userProfile.photoURL} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl text-gray-400">
                      {userProfile?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {user?.displayName || user?.email?.split('@')[0]}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full text-left px-6 py-3 flex items-center space-x-3 ${
                    activeSection === 'profile' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                      : ''
                  }`}
                >
                  <UserCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Profile Information</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('password')}
                  className={`w-full text-left px-6 py-3 flex items-center space-x-3 ${
                    activeSection === 'password' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                      : ''
                  }`}
                >
                  <KeyIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Change Password</span>
                </button>
                
                {/* New Notifications Button */}
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full text-left px-6 py-3 flex items-center space-x-3 ${
                    activeSection === 'notifications' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                      : ''
                  }`}
                >
                  <BellIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                </button>
                
                {/* New Language Button */}
                <button
                  onClick={() => setActiveSection('language')}
                  className={`w-full text-left px-6 py-3 flex items-center space-x-3 ${
                    activeSection === 'language' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                      : ''
                  }`}
                >
                  <LanguageIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">App Language</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('danger')}
                  className={`w-full text-left px-6 py-3 flex items-center space-x-3 ${
                    activeSection === 'danger' 
                      ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' 
                      : ''
                  }`}
                >
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Danger Zone</span>
                </button>
                
                <div className="px-6 py-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
            
            {/* Account stats */}
            <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Account Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Member since</span>
                    <span className="text-gray-900 dark:text-white">
                      {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : (userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current streak</span>
                    <span className="text-gray-900 dark:text-white">
                      {progressData?.streak || 0} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total workouts</span>
                    <span className="text-gray-900 dark:text-white">
                      {progressData?.totalCompleted || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current level</span>
                    <span className="text-gray-900 dark:text-white capitalize">
                      {progressData?.level || 'beginner'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:flex-1">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Profile Information
                  </h2>
                  
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-6">
                      <div>
                        <label 
                          htmlFor="photoUpload" 
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Profile Photo
                        </label>
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            {photoPreview || userProfile?.photoURL ? (
                              <img 
                                src={photoPreview || userProfile?.photoURL} 
                                alt="Profile Preview" 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-2xl text-gray-400">
                                {userProfile?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <label 
                              htmlFor="photoUpload" 
                              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <CameraIcon className="h-5 w-5 mr-2 -ml-1" />
                              Change Photo
                            </label>
                            <input
                              id="photoUpload"
                              name="photoUpload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handlePhotoChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="displayName" 
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Display Name
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={formData.displayName}
                          placeholder={`${user.displayName || user.email.split('@')[0]}`}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 dark:border-gray-600 shadow-sm rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formErrors.displayName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.displayName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="email" 
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          placeholder={`${user.email}`}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 dark:border-gray-600 shadow-sm rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                       />
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                      </div>
                      
                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={updating}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                        >
                          {updating ? 'Updating...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Password Section */}
            {activeSection === 'password' && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Change Password
                  </h2>
                  
                  <form onSubmit={handleUpdatePassword}>
                    <div className="space-y-6">
                      <div>
                        <label 
                          htmlFor="newPassword" 
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={formData.newPassword}
                          placeholder='Enter new password'
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 dark:border-gray-600 shadow-sm rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                        {formErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
                        )}
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="confirmPassword" 
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          placeholder='Confirm new password'
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 dark:border-gray-600 shadow-sm rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                        {formErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                        )}
                      </div>
                      
                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={updating}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                        >
                          {updating ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Notifications Section - New */}
            {activeSection === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Notification Preferences
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive workout reminders and updates via email</p>
                      </div>
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={emailNotifications}
                            onChange={() => setEmailNotifications(!emailNotifications)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive real-time notifications on your device</p>
                      </div>
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={pushNotifications}
                            onChange={() => setPushNotifications(!pushNotifications)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notification Volume</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Low</span>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={notificationVolume}
                          onChange={(e) => setNotificationVolume(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">High</span>
                      </div>
                      <div className="text-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{notificationVolume}%</span>
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => handleUpdateSettings('notifications')}
                        disabled={updating}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                      >
                        {updating ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Appearance Section - New */}
            {activeSection === 'language' && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Language Settings
                  </h2>
                  
                  <div className="space-y-6">  
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</h3>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="block w-full px-3 py-2 text-gray-700 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish (Español)</option>
                        <option value="fr">French (Français)</option>
                        <option value="de">German (Deutsch)</option>
                        <option value="zh">Chinese (中文)</option>
                      </select>
                    </div>
                    
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => handleUpdateSettings('appearance')}
                        disabled={updating}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                      >
                        {updating ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Danger Zone */}
            {activeSection === 'danger' && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-red-600 dark:text-red-400 mb-6">
                    Danger Zone
                  </h2>
                  
                  <div className="border border-red-200 dark:border-red-900 rounded-md p-4 bg-red-50 dark:bg-red-900/10">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Delete Account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Once you delete your account, there is no going back. All of your data will be permanently removed.
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-white dark:bg-red-800 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

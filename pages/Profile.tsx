import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Shield, Moon, Sun, ShoppingBag, Edit2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FRAMES } from '../constants';

interface ProfileProps {
  user: UserProfile;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const Profile: React.FC<ProfileProps> = ({ user, toggleDarkMode, isDarkMode }) => {
  const [bio, setBio] = useState(user.bio);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const userFrame = FRAMES.find(f => f.id === user.frame);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
       <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
      
      {/* Top Profile Card with Persona Layout */}
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 p-10 relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pastel-purple/20 dark:bg-purple-900/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
          
          {/* Left Side: Avatar & Persona */}
          <div className="flex flex-col items-center space-y-8">
             <div className="flex flex-col items-center gap-4">
                {/* Overlapping Avatar and Persona Concept */}
                <div className="flex -space-x-6 relative">
                    <div className={`relative z-10 ${userFrame ? `p-1` : ''}`}>
                       <img 
                          src={user.avatar} 
                          alt="Real Photo" 
                          className={`w-32 h-32 rounded-full object-cover border-4 ${userFrame ? userFrame.borderColor : 'border-white dark:border-dark-card'} shadow-lg`}
                          onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=JS&background=fbbf24&color=fff' }}
                       />
                       {userFrame && (
                          <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-0.5 rounded-full shadow-md border ${userFrame.borderColor} z-20`}>
                             <span className={`text-[10px] font-bold whitespace-nowrap ${userFrame.color}`}>{userFrame.label}</span>
                          </div>
                       )}
                    </div>
                    
                    <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border-4 border-white dark:border-dark-card shadow-lg z-0">
                       <span className="text-4xl">{user.emoji || '😎'}</span>
                    </div>
                </div>
                <Link to="/shop" className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-gray-800 transition-colors flex items-center mt-2">
                   <ShoppingBag size={14} className="mr-1.5" /> Customize
                </Link>
             </div>

             {/* Dark Mode Slider under Persona */}
             <div className="flex flex-col items-center mt-4">
                <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Theme</span>
                <button 
                  onClick={toggleDarkMode}
                  className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex items-center transition-colors relative cursor-pointer"
                >
                   <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}`}>
                      {isDarkMode ? <Moon size={12} className="text-indigo-500" /> : <Sun size={12} className="text-orange-500" />}
                   </div>
                </button>
             </div>

             {/* Level Progress */}
             <div className="w-full px-2">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-bold text-gray-900 dark:text-white">Level 5</span>
                   <span className="text-xs font-medium text-gray-500">60%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative"
                     style={{ width: '60%' }}
                   >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                   </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center font-medium">1,200 / 2,000 XP to Level 6</p>
             </div>
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 w-full text-center md:text-left">
             <div className="mb-8">
               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-gray-500 dark:text-gray-400">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium">ID: {user.id}</span>
                  <span className="hidden md:inline">•</span>
                  <span>{user.school}</span>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                   <label className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 block">Course</label>
                   <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.course}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                   <div className="flex items-center justify-between mb-2">
                      <label className="text-xs uppercase font-bold text-gray-400 tracking-wider">Bio</label>
                      <button 
                        onClick={() => setIsEditingBio(!isEditingBio)}
                        className="text-primary hover:text-indigo-600 transition-colors"
                      >
                        {isEditingBio ? <Check size={16} /> : <Edit2 size={16} />}
                      </button>
                   </div>
                   {isEditingBio ? (
                     <textarea 
                       className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                       rows={3}
                       value={bio}
                       onChange={(e) => setBio(e.target.value)}
                     />
                   ) : (
                     <p className="text-gray-700 dark:text-gray-300 italic">"{bio}"</p>
                   )}
                </div>
             </div>

             {/* Restrictions Note */}
             <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 p-4 rounded-xl flex items-start space-x-3">
               <Shield className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
               <div>
                 <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-500">Restricted Information</h4>
                 <p className="text-xs text-yellow-700 dark:text-yellow-600 mt-1 leading-relaxed">
                   To update your Name, Date of Birth, or Course details, please contact the student office directly at <a href="mailto:studentinfo@leeds.ac.uk" className="underline font-bold hover:text-yellow-900">studentinfo@leeds.ac.uk</a>.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

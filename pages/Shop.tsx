import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronLeft, Smile, Frame, ShoppingBag, CheckCircle2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EMOJIS, FRAMES } from '../constants';

interface ShopProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const Shop = ({ user, onUpdateUser }: ShopProps) => {
  const [activeTab, setActiveTab] = useState<'emojis' | 'frames'>('emojis');
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(user.emoji);
  const [selectedFrameId, setSelectedFrameId] = useState<string | undefined>(user.frame);
  const [showToast, setShowToast] = useState(false);

  const selectedFrame = FRAMES.find(f => f.id === selectedFrameId);

  const handleSave = () => {
    onUpdateUser({
      ...user,
      emoji: selectedEmoji,
      frame: selectedFrameId
    });
    
    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-8 animate-fade-in relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-top">
          <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
            <CheckCircle2 size={20} className="text-white" />
            <span className="font-medium">Your choices are saved!</span>
          </div>
        </div>
      )}

      <div className="w-1/3 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center relative p-8">
         <Link to="/profile" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">
           <ChevronLeft size={24} />
         </Link>
         <h2 className="absolute top-4 right-4 font-bold text-primary flex items-center">
           <ShoppingBag className="mr-2" size={20}/> Shop
         </h2>

         {/* Character Preview */}
         <div className="relative">
           <div className={`relative w-64 h-64 rounded-full flex items-center justify-center mb-6 
             ${selectedFrame ? `border-4 ${selectedFrame.borderColor} border-solid` : 'border-4 border-dashed border-gray-300 dark:border-gray-600'}
             bg-gray-100 dark:bg-gray-800 transition-all duration-300`}>
             
             <img src={user.avatar} alt="Character" className="w-56 h-56 rounded-full object-cover" />
             
             {/* Frame Label */}
             {selectedFrame && (
               <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-1 rounded-full shadow-md border ${selectedFrame.borderColor}`}>
                 <span className={`text-sm font-bold whitespace-nowrap ${selectedFrame.color}`}>{selectedFrame.label}</span>
               </div>
             )}

             {/* Emoji Badge */}
             {selectedEmoji && (
               <div className="absolute top-0 right-4 bg-white dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-700 text-2xl animate-bounce-slow">
                 {selectedEmoji}
               </div>
             )}
           </div>
           
           <div className="text-center mt-8">
             <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Preview</h3>
             <p className="text-gray-500">
               {selectedFrame ? `${selectedFrame.theme} Frame` : 'Customize your look'}
             </p>
           </div>
         </div>
      </div>

      <div className="flex-1 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
           <button 
             onClick={() => setActiveTab('emojis')}
             className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'emojis' ? 'text-primary border-b-2 border-primary bg-gray-50 dark:bg-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Smile size={18} /> Emojis
           </button>
           <button 
             onClick={() => setActiveTab('frames')}
             className={`flex-1 py-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'frames' ? 'text-primary border-b-2 border-primary bg-gray-50 dark:bg-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Frame size={18} /> Frames
           </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
           {activeTab === 'emojis' ? (
             <div className="grid grid-cols-5 gap-4">
               {EMOJIS.map((emoji, index) => {
                 const isLocked = index >= 5;
                 return (
                 <button
                   key={emoji}
                   onClick={() => !isLocked && setSelectedEmoji(emoji === selectedEmoji ? undefined : emoji)}
                   disabled={isLocked}
                   className={`relative aspect-square text-3xl flex items-center justify-center rounded-xl border-2 transition-all
                     ${isLocked 
                       ? 'opacity-50 grayscale cursor-not-allowed border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900' 
                       : selectedEmoji === emoji 
                         ? 'border-primary bg-primary/10 scale-110' 
                         : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800'}`}
                 >
                   {isLocked ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                         <Lock size={20} className="text-gray-400 mb-1" />
                      </div>
                   ) : emoji}
                   
                   {index === 5 && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 text-center pointer-events-none z-10">
                        <span className="text-[10px] font-bold text-gray-400 bg-white/90 dark:bg-black/80 px-2 py-1 rounded-full shadow-sm whitespace-nowrap">Unlocks at level 6</span>
                      </div>
                   )}
                 </button>
               )})}
             </div>
           ) : (
             <div className="grid grid-cols-2 gap-4">
               {FRAMES.map((frame, index) => {
                 const isLocked = index >= 3;
                 return (
                 <button
                   key={frame.id}
                   onClick={() => !isLocked && setSelectedFrameId(frame.id === selectedFrameId ? undefined : frame.id)}
                   disabled={isLocked}
                   className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group
                     ${isLocked 
                       ? 'opacity-50 grayscale cursor-not-allowed border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900' 
                       : selectedFrameId === frame.id 
                         ? `border-${frame.borderColor.split('-')[1]}-500 bg-gray-50 dark:bg-gray-800 ring-2 ring-${frame.borderColor.split('-')[1]}-200` 
                         : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                 >
                   {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 z-20">
                         <Lock size={32} className="text-gray-500" />
                      </div>
                   )}

                   <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 uppercase tracking-wider">
                       {frame.theme}
                     </span>
                     {!isLocked && selectedFrameId === frame.id && (
                       <div className={`w-3 h-3 rounded-full bg-${frame.borderColor.split('-')[1]}-500`} />
                     )}
                   </div>
                   <h4 className="font-bold text-gray-800 dark:text-white mb-1">{frame.name}</h4>
                   <p className={`text-sm font-medium ${frame.color}`}>"{frame.label}"</p>
                   
                   {index === 3 && (
                      <div className="absolute bottom-2 right-2 pointer-events-none z-30">
                        <span className="text-[10px] font-bold text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm border border-gray-200 dark:border-gray-700">Unlocks at level 10</span>
                      </div>
                   )}
                 </button>
               )})}
             </div>
           )}
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

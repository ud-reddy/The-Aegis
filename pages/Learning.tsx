
import React, { useState, useEffect, useRef } from 'react';
import { startChat, sendMessage } from '../services/geminiService';
import { MOCK_MODULES, MOCK_LEVELS } from '../constants';
import { LearningLevelStatus, LearningLevel } from '../types';
import { Send, Bot, CheckCircle, Lock, PlayCircle, ChevronRight, ChevronLeft, Star, AlertCircle, BookOpen, Atom, Trophy } from 'lucide-react';

export const Learning = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [viewState, setViewState] = useState<'selection' | 'map' | 'content' | 'quiz'>('selection');
  const [levels, setLevels] = useState(MOCK_LEVELS);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat with Greeting
  useEffect(() => {
    startChat("You are Athena, a helpful university AI tutor. Guide the student through topics. When they fail a quiz, explain WHY they were wrong but do NOT give the answer key directly. Be encouraging.");
    setMessages([{ role: 'model', text: "Hello! I'm Athena. What are we learning today?" }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    const response = await sendMessage(userMsg);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setViewState('map');
    const moduleName = MOCK_MODULES.find(m => m.id === moduleId)?.name;
    setMessages(prev => [...prev, { role: 'model', text: `Excellent choice! Let's master ${moduleName}. Select a level to begin.` }]);
  };

  const handleLevelSelect = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    if (level?.status === LearningLevelStatus.LOCKED) return;
    setCurrentLevelId(levelId);
    setViewState('content');
    sendMessage(`I am starting level ${levelId}: ${level?.title}. Give me a brief intro.`);
  };

  const handleQuizSubmit = (optionIndex: number) => {
    const currentLevel = levels.find(l => l.id === currentLevelId);
    if (!currentLevel) return;

    // Determine correctness (Simple 1 question logic for now, extendable)
    const isCorrect = optionIndex === currentLevel.quiz[0].correctIndex;
    const score = isCorrect ? 100 : 0;
    setQuizScore(score);

    if (score >= 50) {
      // Pass
      const nextLevelId = (currentLevelId || 0) + 1;
      setLevels(prev => prev.map(l => {
        if (l.id === currentLevelId) return { ...l, status: LearningLevelStatus.COMPLETED };
        if (l.id === nextLevelId && l.status === LearningLevelStatus.LOCKED) return { ...l, status: LearningLevelStatus.UNLOCKED };
        return l;
      }));
      setMessages(prev => [...prev, { role: 'model', text: "Congratulations! That answer is correct. You've unlocked the next level." }]);
    } else {
      // Fail
      sendMessage(`I answered "${currentLevel.quiz[0].options[optionIndex]}" for the question "${currentLevel.quiz[0].question}" and it was wrong. Help me understand why.`);
    }
  };

  // Function to determine node position based on winding path logic
  const getNodePosition = (index: number) => {
    // Zig-zag pattern: Center, Right, Center, Left, Center...
    // Or sin wave: 50% + 30% * sin(...)
    // Let's use hardcoded nice positions for the first few levels, then repeat pattern
    const positions = [
      { left: '50%', top: '10%' },
      { left: '75%', top: '28%' },
      { left: '50%', top: '46%' },
      { left: '25%', top: '64%' },
      { left: '50%', top: '82%' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-fade-in">
      
      {/* Main Learning Interface */}
      <div className="flex-1 bg-white dark:bg-dark-card rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col relative overflow-hidden">
        
        {/* Header (Overlay) */}
        <div className="absolute top-0 left-0 w-full z-20 p-6 flex justify-between items-center bg-gradient-to-b from-white dark:from-dark-card to-transparent">
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-sm">Learning Map</h1>
           {viewState !== 'selection' && (
             <button 
               onClick={() => {
                 if (viewState === 'map') {
                   setViewState('selection');
                   setSelectedModuleId('');
                 } else {
                   setViewState('map');
                 }
               }} 
               className="text-sm font-bold text-white bg-primary px-4 py-2 rounded-full hover:bg-indigo-600 shadow-lg transition-transform hover:scale-105 flex items-center"
             >
               <ChevronLeft size={16} className="mr-1" /> {viewState === 'map' ? 'Back' : 'Map'}
             </button>
           )}
        </div>

        {/* --- VIEW STATES --- */}
        
        {/* 1. SELECTION */}
        {viewState === 'selection' && (
           <div className="flex flex-col items-center justify-center h-full space-y-8 p-8 relative z-10">
             {/* Decorative Background */}
             <div className="absolute inset-0 bg-soft-bg dark:bg-dark opacity-50 z-0"></div>
             
             <div className="relative z-10 text-center">
               <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-full text-primary mb-6 shadow-xl animate-bounce-slow border-4 border-indigo-50 dark:border-indigo-900">
                 <Bot size={64} />
               </div>
               <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Ready to Learn?</h2>
               <p className="text-gray-500 text-lg mb-8">Select a module to begin your adventure</p>
               
               <div className="w-full max-w-md mx-auto relative">
                  <select 
                    className="w-full p-5 pl-6 rounded-2xl border-2 border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg font-bold text-gray-700 dark:text-white focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:border-primary focus:outline-none cursor-pointer appearance-none shadow-lg transition-all"
                    onChange={(e) => handleModuleSelect(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Choose a Module...</option>
                    {MOCK_MODULES.map(m => <option key={m.id} value={m.id}>{m.name} ({m.code})</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-primary">
                    <ChevronRight size={24} className="rotate-90"/>
                  </div>
               </div>
             </div>
           </div>
        )}

        {/* 2. MAP (MODERN GAME STYLE) */}
        {viewState === 'map' && (
          <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#f0f4ff] dark:bg-[#0f172a]">
             
             {/* Dynamic Background Pattern */}
             <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             
             {/* Map Container - Fixed Height to contain the winding path */}
             <div className="relative w-full h-[900px] max-w-3xl mx-auto my-10">
                
                {/* SVG Winding Path */}
                <svg className="absolute top-0 left-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Glowing Effect Layer */}
                  <path 
                    d="M 50 10 Q 90 20, 75 28 T 50 46 T 25 64 T 50 82" 
                    stroke="rgba(99, 102, 241, 0.3)" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  {/* Main Path Line */}
                  <path 
                    d="M 50 10 Q 90 20, 75 28 T 50 46 T 25 64 T 50 82" 
                    stroke="#6366f1" 
                    strokeWidth="1.5" 
                    fill="none" 
                    strokeDasharray="2 1"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Decorative Elements (Floating Icons) */}
                <div className="absolute top-[15%] left-[15%] text-yellow-400 animate-bounce-slow opacity-80"><Star size={24} /></div>
                <div className="absolute top-[35%] right-[10%] text-blue-400 animate-pulse opacity-60"><Atom size={32} /></div>
                <div className="absolute bottom-[20%] left-[10%] text-purple-400 animate-float opacity-70"><BookOpen size={28} /></div>
                <div className="absolute top-[5%] right-[20%] text-green-400 opacity-50"><Trophy size={20} /></div>

                {/* Level Nodes */}
                {levels.map((level, idx) => {
                  const pos = getNodePosition(idx);
                  const isLocked = level.status === LearningLevelStatus.LOCKED;
                  const isCompleted = level.status === LearningLevelStatus.COMPLETED;
                  const isCurrent = level.status === LearningLevelStatus.UNLOCKED;

                  return (
                    <div 
                      key={level.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
                      style={{ left: pos.left, top: pos.top }}
                    >
                       <button
                         onClick={() => handleLevelSelect(level.id)}
                         disabled={isLocked}
                         className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-300 relative ${
                           isCompleted ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white hover:scale-110' :
                           isCurrent ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900 animate-pulse-slow hover:scale-110' :
                           'bg-gray-200 dark:bg-gray-800 text-gray-400 border-2 border-gray-300 dark:border-gray-700 cursor-not-allowed'
                         }`}
                       >
                         {/* Inner Icon */}
                         <div className="z-10">
                           {isCompleted ? <CheckCircle size={32} strokeWidth={3} /> : 
                            isLocked ? <Lock size={28} /> : 
                            <span className="text-2xl font-bold">{level.id}</span>}
                         </div>
                         
                         {/* Current Level Indicator Ring */}
                         {isCurrent && (
                           <span className="absolute inset-0 rounded-[2rem] bg-indigo-500 opacity-20 animate-ping"></span>
                         )}
                       </button>

                       {/* Level Label */}
                       <div className={`mt-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 transform ${isCurrent ? 'scale-100 opacity-100' : 'scale-90 opacity-80 group-hover:scale-100 group-hover:opacity-100'}`}>
                         <span className={`font-bold text-sm whitespace-nowrap ${isLocked ? 'text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                           {level.title}
                         </span>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {/* 3. CONTENT (Detailed View) */}
        {viewState === 'content' && currentLevelId && (
          <div className="flex-1 overflow-y-auto p-8 pt-24">
            <div className="max-w-3xl mx-auto w-full animate-slide-up">
              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-dark-card p-8 rounded-3xl mb-8 border border-indigo-100 dark:border-indigo-800 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen size={120} className="text-primary"/>
                 </div>
                 <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">Level {currentLevelId}</span>
                 <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">{levels.find(l => l.id === currentLevelId)?.title}</h2>
                 <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                   {levels.find(l => l.id === currentLevelId)?.content}
                 </p>
              </div>

              <div className="mb-10">
                 <h3 className="flex items-center text-xl font-bold text-gray-900 dark:text-white mb-6">
                   <Atom className="mr-2 text-purple-500" /> Examples
                 </h3>
                 <div className="grid gap-4">
                   {levels.find(l => l.id === currentLevelId)?.examples.map((ex, i) => (
                     <div key={i} className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-l-4 border-purple-500 font-mono text-sm text-gray-700 dark:text-gray-300 hover:shadow-md transition-shadow">
                       {ex}
                     </div>
                   ))}
                 </div>
              </div>

              <div className="flex justify-between mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                 <button onClick={() => setViewState('map')} className="px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                   Back to Map
                 </button>
                 <button onClick={() => { setViewState('quiz'); setQuizScore(null); }} className="px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-indigo-600 shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center transform hover:-translate-y-1">
                   Start Challenge <ChevronRight size={20} className="ml-2"/>
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. QUIZ */}
        {viewState === 'quiz' && currentLevelId && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 pt-24 relative">
             {/* Background Decoration */}
             <div className="absolute inset-0 bg-soft-bg dark:bg-dark-card z-0"></div>
             
            {quizScore === null ? (
              <div className="w-full max-w-2xl relative z-10 animate-fade-in">
                 <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700">
                   <div className="mb-8 text-center">
                      <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-black uppercase tracking-widest mb-6">Quiz Challenge</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{levels.find(l => l.id === currentLevelId)?.quiz[0].question}</h2>
                   </div>
                   <div className="space-y-4">
                     {levels.find(l => l.id === currentLevelId)?.quiz[0].options.map((opt, idx) => (
                       <button
                         key={idx}
                         onClick={() => handleQuizSubmit(idx)}
                         className="w-full text-left p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all font-bold text-gray-700 dark:text-gray-200 text-lg group"
                       >
                         <span className="inline-block w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 text-sm flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">{String.fromCharCode(65 + idx)}</span>
                         {opt}
                       </button>
                     ))}
                   </div>
                 </div>
              </div>
            ) : (
              <div className="text-center relative z-10 animate-scale-in">
                 <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl ${quizScore >= 50 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 'bg-gradient-to-br from-red-400 to-red-600 text-white'}`}>
                    {quizScore >= 50 ? <Trophy size={64} className="animate-bounce-slow"/> : <AlertCircle size={64}/>}
                 </div>
                 <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                   {quizScore >= 50 ? 'Level Complete!' : 'Nice Try!'}
                 </h2>
                 <p className="text-xl text-gray-500 mb-10 max-w-md mx-auto">
                   {quizScore >= 50 ? 'You mastered this topic. Your journey continues!' : 'Review the material or ask Athena for a hint.'}
                 </p>
                 <div className="flex justify-center space-x-6">
                    {quizScore >= 50 ? (
                      <button onClick={() => { setViewState('map'); setCurrentLevelId(null); }} className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-1 transition-all">
                        Continue Journey
                      </button>
                    ) : (
                      <button onClick={() => setViewState('content')} className="px-10 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold text-lg hover:bg-gray-300 transition-all">
                        Review Topic
                      </button>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* AI Chatbot Sidebar */}
      <div className="w-96 bg-white dark:bg-dark-card rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center space-x-3 bg-gradient-to-r from-white to-indigo-50 dark:from-dark-card dark:to-indigo-900/10 rounded-t-3xl">
          <div className="p-3 bg-white dark:bg-gray-700 shadow-md text-primary rounded-2xl">
             <Bot size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Athena AI</h3>
            <p className="text-xs text-gray-500 font-medium">Learning Assistant</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card rounded-b-3xl">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="w-full bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:ring-0 focus:outline-none dark:text-white transition-all"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 p-2 bg-primary text-white rounded-xl hover:bg-indigo-600 transition-transform hover:scale-105 shadow-md"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

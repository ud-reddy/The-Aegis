
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_MODULES, MOCK_ASSIGNMENTS } from '../constants';
import { Module, Assignment } from '../types';
import { ChevronRight, FileText, Download, Code, Upload, ChevronDown, LayoutGrid, List as ListIcon, Search, Users, Lock, X, File, BookOpen } from 'lucide-react';

const InstructorDisplay = ({ instructors }: { instructors: string[] }) => {
  const [showAll, setShowAll] = useState(false);

  if (instructors.length === 0) return <span className="text-gray-400 italic">TBA</span>;
  if (instructors.length === 1) return <span>{instructors[0]}</span>;

  return (
    <div className="relative inline-block">
      {!showAll ? (
        <button 
          onClick={(e) => { e.stopPropagation(); setShowAll(true); }}
          className="text-primary hover:underline font-medium flex items-center"
        >
          Multiple Instructors <Users size={14} className="ml-1" />
        </button>
      ) : (
        <div className="flex flex-col animate-fade-in" onClick={(e) => e.stopPropagation()}>
           {instructors.map((inst, i) => (
             <span key={i} className="block text-sm text-gray-700 dark:text-gray-300">• {inst}</span>
           ))}
           <button 
             onClick={(e) => { e.stopPropagation(); setShowAll(false); }}
             className="text-xs text-gray-400 hover:text-gray-600 mt-1"
           >
             Show less
           </button>
        </div>
      )}
    </div>
  );
};

// Added optional key to prop type to fix TS error when used in JSX maps
const ModuleCardTile = ({ module, onClick }: { module: Module; onClick: () => void; key?: React.Key }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-dark-card rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 transition-all duration-300 group relative overflow-hidden h-full flex flex-col ${module.status === 'Closed' ? 'opacity-75 grayscale-[0.8] cursor-not-allowed' : 'hover:border-primary hover:shadow-lg cursor-pointer hover:-translate-y-1'}`}
  >
    {/* Image Section */}
    <div className="h-40 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
        <img src={module.image} alt={module.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
        {/* Term Badge overlay */}
         <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 shadow-sm">
                {module.term}
            </span>
         </div>
    </div>

    {/* Content Section */}
    <div className="p-6 flex-1 flex flex-col relative">
       {/* Color Strip Indicator */}
       <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: module.color }}></div>

      <div className="flex justify-between items-start mb-2 mt-2">
         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${module.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {module.status}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-1 line-clamp-2">{module.name}</h3>
      <p className="text-gray-500 dark:text-gray-400 font-medium mb-4 text-sm">{module.code}</p>
      
      <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-end justify-between">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
           <InstructorDisplay instructors={module.instructors} />
        </div>
        <div className={`w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-2 ${module.status === 'Open' ? 'group-hover:bg-primary group-hover:text-white group-hover:scale-110' : ''}`}>
           {module.status === 'Open' ? <ChevronRight size={16} /> : <Lock size={16} className="text-gray-400"/>}
        </div>
      </div>
    </div>
  </div>
);

// Added optional key to prop type to fix TS error when used in JSX maps
const ModuleCardList = ({ module, onClick }: { module: Module; onClick: () => void; key?: React.Key }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 group flex flex-col md:flex-row items-start md:items-center gap-4 mb-4 ${module.status === 'Closed' ? 'opacity-75 grayscale-[0.8] cursor-not-allowed' : 'hover:border-primary hover:shadow-md cursor-pointer'}`}
  >
    <div className="w-2 h-12 rounded-full self-start md:self-center hidden md:block" style={{ backgroundColor: module.color }}></div>
    
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 w-full items-center">
      {/* Term */}
      <div className="col-span-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block md:hidden mb-1">Term</span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{module.term}</span>
      </div>

      {/* Module Info */}
      <div className="col-span-4">
         <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{module.name}</h3>
         <p className="text-sm text-gray-500">{module.code}</p>
      </div>

      {/* Status */}
      <div className="col-span-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-block ${module.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {module.status}
        </span>
      </div>

      {/* Instructors */}
      <div className="col-span-3">
         <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block md:hidden mb-1">Instructors</span>
         <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            <InstructorDisplay instructors={module.instructors} />
         </div>
      </div>
    </div>

    <div className={`hidden md:flex w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 items-center justify-center transition-all duration-300 ml-2 ${module.status === 'Open' ? 'group-hover:bg-primary group-hover:text-white' : ''}`}>
        {module.status === 'Open' ? <ChevronRight size={16} /> : <Lock size={16} className="text-gray-400"/>}
    </div>
  </div>
);

const DetailAccordion = ({ title, icon: Icon, children }: { title: string; icon: any; children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden mb-4 bg-white dark:bg-dark-card transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-primary rounded-lg">
            <Icon size={20} />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">{title}</span>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          {children || <p className="text-gray-500 italic">No content available.</p>}
        </div>
      </div>
    </div>
  );
};

// Added optional key to prop type to fix TS error when used in JSX maps
const SubAccordion = ({ title, children }: { title: string; children: React.ReactNode; key?: React.Key }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-white dark:hover:bg-gray-800 transition-colors text-left rounded-lg my-1"
      >
        <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{title}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 py-2 bg-white dark:bg-dark-card/50 text-sm space-y-2 rounded-lg mb-2 mx-2">
          {children}
        </div>
      )}
    </div>
  );
};

export const Modules = () => {
  const { state } = useLocation();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [viewMode, setViewMode] = useState<'tile' | 'list'>('tile');
  const [searchQuery, setSearchQuery] = useState('');
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [viewAssignment, setViewAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (state?.moduleId) {
      const target = MOCK_MODULES.find(m => m.id === state.moduleId);
      if (target) {
        setSelectedModule(target);
        window.history.replaceState({}, document.title);
      }
    }
  }, [state]);

  const filteredModules = useMemo(() => {
    return MOCK_MODULES.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.instructors.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const handleModuleClick = (module: Module) => {
    if (module.status === 'Closed') {
      setLockedModalOpen(true);
    } else {
      setSelectedModule(module);
    }
  };

  // --- DETAIL VIEW ---
  if (selectedModule) {
    const assignments = MOCK_ASSIGNMENTS.filter(a => a.moduleId === selectedModule.id);
    const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const chapters = [1, 2, 3, 4, 5];

    return (
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
           <button 
            onClick={() => setSelectedModule(null)}
            className="w-10 h-10 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-110 transition-all duration-300"
           >
            <ChevronRight className="rotate-180" size={20} /> 
           </button>
           <div>
             <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedModule.name}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${selectedModule.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {selectedModule.status}
                </span>
             </div>
             <p className="text-gray-500 dark:text-gray-400 mt-1">{selectedModule.code} • {selectedModule.term}</p>
             <p className="text-sm text-gray-500 mt-1">Instructors: {selectedModule.instructors.join(', ')}</p>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Course Content (Lecture Notes, Materials, Lab, Assignments list) */}
          <div className="lg:w-2/3">
             <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 h-full">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Course Content</h3>
               
               <DetailAccordion title="Lecture Notes / Slides" icon={FileText}>
                  <div className="space-y-1">
                    {weeks.map(week => (
                      <SubAccordion key={week} title={`Week ${week} Resources`}>
                        <ul className="space-y-3 pl-2">
                           <li className="flex items-center text-sm text-blue-600 hover:underline cursor-pointer">
                             <FileText size={14} className="mr-2 text-gray-400"/> {selectedModule.code}_Lecture_Slides_Week{week}.pdf
                           </li>
                           <li className="flex items-center text-sm text-blue-600 hover:underline cursor-pointer">
                             <File size={14} className="mr-2 text-gray-400"/> {selectedModule.code}_Handout_Week{week}.pdf
                           </li>
                        </ul>
                      </SubAccordion>
                    ))}
                  </div>
               </DetailAccordion>
               
               <DetailAccordion title="Learning Materials" icon={BookOpen}>
                  <div className="space-y-1">
                     {chapters.map(chap => (
                       <SubAccordion key={chap} title={`Chapter ${chap}: Topic Name`}>
                          <ul className="space-y-3 pl-2">
                             <li className="flex items-center text-sm text-blue-600 hover:underline cursor-pointer">
                               <BookOpen size={14} className="mr-2 text-gray-400"/> Textbook_Chapter_{chap}.pdf
                             </li>
                             <li className="flex items-center text-sm text-blue-600 hover:underline cursor-pointer">
                               <File size={14} className="mr-2 text-gray-400"/> Supplementary_Reading_{chap}.pdf
                             </li>
                          </ul>
                       </SubAccordion>
                     ))}
                  </div>
               </DetailAccordion>
               
               <DetailAccordion title="Lab Materials" icon={Code}>
                  <div className="space-y-1">
                    {weeks.map(week => (
                      <SubAccordion key={week} title={`Week ${week} Lab`}>
                        <ul className="space-y-3 pl-2">
                           <li className="flex items-center text-sm text-blue-600 hover:underline cursor-pointer">
                             <Code size={14} className="mr-2 text-gray-400"/> Lab_Instructions_Week{week}.pdf
                           </li>
                           <li className="flex items-center text-sm text-blue-600 hover:underline cursor-pointer">
                             <Download size={14} className="mr-2 text-gray-400"/> Starter_Code_Week{week}.zip
                           </li>
                        </ul>
                      </SubAccordion>
                    ))}
                  </div>
               </DetailAccordion>
               
               <DetailAccordion title="Assignments & Submission" icon={Upload}>
                  {assignments.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer" onClick={() => setViewAssignment(a)}>
                      <div className="flex items-center">
                        <FileText size={16} className="text-primary mr-3" />
                        <span className="text-sm font-medium dark:text-white hover:text-primary transition-colors hover:underline">{a.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${a.status === 'graded' ? 'bg-green-100 text-green-700' : a.status === 'submitted' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                           {a.status}
                         </span>
                         <ChevronRight size={14} className="text-gray-300" />
                      </div>
                    </div>
                  ))}
                  {assignments.length === 0 && <p className="text-sm text-gray-500 italic">No assignments available.</p>}
               </DetailAccordion>
             </div>
          </div>

          {/* Right Column: Assignment Details Box */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 sticky top-24 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Details at a Glance</h3>
              <div className="space-y-4">
                {assignments.length > 0 ? assignments.map(a => (
                  <div key={a.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-gray-900 dark:text-white text-sm">{a.title}</h4>
                       {a.grade && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{a.grade}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Due: {a.dueDate}</p>
                    <div className="flex items-center justify-between">
                       <span className={`text-xs px-2 py-1 rounded-md font-medium ${a.status === 'submitted' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                         {a.status}
                       </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No assignments available yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Assignment Detail Modal */}
        {viewAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-dark-card rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700 relative animate-scale-in">
                <button 
                  onClick={() => setViewAssignment(null)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                   <X size={20} />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 pr-8">{viewAssignment.title}</h2>
                <div className="flex items-center gap-3 mb-6">
                   <span className="text-sm text-gray-500 flex items-center"><span className="font-bold mr-1">Due:</span> {viewAssignment.dueDate}</span>
                   <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${viewAssignment.status === 'graded' ? 'bg-green-100 text-green-700' : viewAssignment.status === 'submitted' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {viewAssignment.status}
                   </span>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl mb-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700">
                   <p className="font-bold mb-2">Instructions:</p>
                   <p>Please upload your submission for {viewAssignment.title}. Ensure your file is in PDF format and does not exceed 10MB. Refer to the module handbook for grading criteria.</p>
                </div>

                {viewAssignment.status !== 'graded' && (
                  <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/20">
                     Submit Assignment to Turnitin <Upload size={18} className="ml-2" />
                  </button>
                )}
                
                {viewAssignment.grade && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl flex justify-between items-center">
                     <span className="font-bold text-green-800 dark:text-green-400">Grade Received:</span>
                     <span className="text-2xl font-black text-green-700 dark:text-green-300">{viewAssignment.grade}</span>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    );
  }

  // --- MAIN MODULES LIST VIEW ---
  return (
    <div className="animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
         <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Modules</h1>
            <p className="text-gray-500 mt-2">Access your enrolled courses, terms, and materials</p>
         </div>

         {/* Search and Toggle Controls */}
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <input 
                 type="text" 
                 placeholder="Search modules..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-sm focus:ring-2 focus:ring-primary focus:outline-none"
               />
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            <div className="flex bg-white dark:bg-dark-card p-1 rounded-xl border border-gray-200 dark:border-gray-700">
               <button 
                 onClick={() => setViewMode('tile')}
                 className={`p-2 rounded-lg transition-colors ${viewMode === 'tile' ? 'bg-gray-100 dark:bg-gray-700 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <LayoutGrid size={20} />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <ListIcon size={20} />
               </button>
            </div>
         </div>
      </div>

      {filteredModules.length > 0 ? (
        viewMode === 'tile' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredModules.map(module => (
              <ModuleCardTile key={module.id} module={module} onClick={() => handleModuleClick(module)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredModules.map(module => (
              <ModuleCardList key={module.id} module={module} onClick={() => handleModuleClick(module)} />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
           <p className="text-gray-500 font-medium">No modules found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Locked Module Popup */}
      {lockedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-card rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-700 transform transition-all scale-100">
             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400">
                   <Lock size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Module Locked</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                   This module is currently closed. content is not accessible at this time.
                </p>
                <button 
                  onClick={() => setLockedModalOpen(false)}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Understood
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ACTIVITIES } from '../constants';
import { ActivityItem, ActivityType } from '../types';
import { 
  Megaphone, GraduationCap, Book, FileText, Calendar, 
  Filter, ChevronRight, X, Clock, Info, CheckCircle2, ChevronDown
} from 'lucide-react';

const ActivityIcon = ({ type }: { type: ActivityType }) => {
  switch (type) {
    case 'announcement': return <Megaphone size={20} className="text-blue-500" />;
    case 'grade': return <GraduationCap size={20} className="text-green-500" />;
    case 'assignment': return <Book size={20} className="text-orange-500" />;
    case 'resource': return <FileText size={20} className="text-purple-500" />;
    case 'class': return <Calendar size={20} className="text-indigo-500" />;
    default: return <Info size={20} className="text-gray-500" />;
  }
};

// Added optional key to prop type to fix TS error when used in JSX maps
const ActivityCard = ({ item, onClick }: { item: ActivityItem; onClick: () => void; key?: React.Key }) => {
  const isAnnouncement = item.type === 'announcement';

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-md hover:border-primary/50 cursor-pointer overflow-hidden ${!item.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
    >
      {/* Unread Indicator */}
      {!item.isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
      )}

      {/* Type Border Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5 ${
        item.type === 'announcement' ? 'bg-blue-500' :
        item.type === 'grade' ? 'bg-green-500' :
        item.type === 'assignment' ? 'bg-orange-500' :
        'bg-gray-300'
      }`}></div>

      <div className="flex items-start gap-4 pl-3">
        {/* Icon */}
        <div className="flex-shrink-0 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <ActivityIcon type={item.type} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
             <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
               {item.moduleName || 'System'}
             </span>
             <span className="text-xs font-medium text-gray-400 flex items-center whitespace-nowrap ml-2">
               <Clock size={12} className="mr-1" /> {item.timestamp}
             </span>
          </div>
          
          <h3 className={`text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors ${!item.isRead ? 'font-extrabold' : ''}`}>
            {item.title}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {item.actionLabel && (
            <div className="mt-3 inline-flex items-center text-xs font-bold text-primary bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
               {item.actionLabel} <ChevronRight size={12} className="ml-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Activity = () => {
  const [filter, setFilter] = useState<'all' | ActivityType>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const navigate = useNavigate();

  const filterOptions = [
    { value: 'all', label: 'Show All' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'grade', label: 'Grades & Feedback' },
    { value: 'assignment', label: 'Assignments' },
    { value: 'resource', label: 'Resources' }
  ];

  // Group activities by date - Added explicit type to fix Object.entries inference
  const groupedActivities = useMemo<Record<string, ActivityItem[]>>(() => {
    const filtered = MOCK_ACTIVITIES.filter(item => filter === 'all' || item.type === filter);
    
    // Simple grouping logic based on the 'date' string in mock data
    // In a real app, you'd parse ISO dates
    const groups: Record<string, ActivityItem[]> = {};
    
    filtered.forEach(item => {
      if (!groups[item.date]) {
        groups[item.date] = [];
      }
      groups[item.date].push(item);
    });

    // Custom sort order for keys if needed, for now 'Today' usually comes first if mock data is ordered
    return groups;
  }, [filter]);

  const handleCardClick = (item: ActivityItem) => {
    if (item.type === 'announcement') {
      setSelectedActivity(item);
    } else if (item.moduleId) {
      // Redirect logic
      navigate('/modules', { state: { moduleId: item.moduleId } });
    } else {
      // Fallback for generic items
      setSelectedActivity(item);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 sticky top-0 bg-[#FDFDFD] dark:bg-dark z-10 py-4 border-b border-gray-100 dark:border-gray-800/50 backdrop-blur-sm bg-opacity-90">
         <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Stream</h1>
            <p className="text-gray-500 mt-2">Latest updates, results, and announcements</p>
         </div>

         <div className="relative z-20">
            {isFilterOpen && (
              <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsFilterOpen(false)} />
            )}
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`relative z-20 flex items-center gap-3 bg-white dark:bg-dark-card border rounded-xl pl-4 pr-3 py-2.5 shadow-sm transition-all duration-300 min-w-[200px] justify-between group ${
                isFilterOpen 
                  ? 'border-primary ring-2 ring-primary/10' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg transition-colors ${isFilterOpen ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:text-primary group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20'}`}>
                  <Filter size={14} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {filterOptions.find(o => o.value === filter)?.label}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-primary' : 'group-hover:text-gray-600'}`}
              />
            </button>

            <div className={`absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 origin-top-right z-30 ${
              isFilterOpen 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}>
              <div className="p-2 space-y-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value as any);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filter === option.value 
                        ? 'bg-primary/5 text-primary pl-4' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:pl-4'
                    }`}
                  >
                    <span className={filter === option.value ? 'font-bold' : ''}>{option.label}</span>
                    {filter === option.value && (
                      <CheckCircle2 size={16} className="text-primary animate-scale-in" />
                    )}
                  </button>
                ))}
              </div>
            </div>
         </div>
      </div>

      {/* Activity Feed */}
      <div className="max-w-4xl mx-auto space-y-8">
        {Object.keys(groupedActivities).length > 0 ? (
          (Object.entries(groupedActivities) as [string, ActivityItem[]][]).map(([dateLabel, items]) => (
            <div key={dateLabel} className="animate-slide-up">
              <div className="flex items-center mb-4">
                 <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{dateLabel}</h2>
                 <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800 ml-4"></div>
              </div>
              <div className="space-y-4">
                 {items.map(item => (
                   <ActivityCard 
                     key={item.id} 
                     item={item} 
                     onClick={() => handleCardClick(item)} 
                   />
                 ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
             <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Filter size={32} />
             </div>
             <p className="text-gray-500 font-medium">No activity found for this filter.</p>
             <button onClick={() => setFilter('all')} className="mt-4 text-primary font-bold hover:underline">Clear Filter</button>
          </div>
        )}
      </div>

      {/* Announcement Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-dark-card rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700 relative animate-scale-in flex flex-col max-h-[80vh]">
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                 <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-primary rounded-lg">
                    <ActivityIcon type={selectedActivity.type} />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{selectedActivity.type}</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 pr-8">{selectedActivity.title}</h2>
              <div className="flex items-center text-sm text-gray-400 mb-6">
                 <span>{selectedActivity.moduleName || 'System Announcement'}</span>
                 <span className="mx-2">•</span>
                 <span>{selectedActivity.date} at {selectedActivity.timestamp}</span>
              </div>

              <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                   <p>{selectedActivity.content || selectedActivity.description}</p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                 <button 
                   onClick={() => setSelectedActivity(null)}
                   className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                 >
                   Close
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

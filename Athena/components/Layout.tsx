
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, Activity, MessageSquare, Settings, 
  Search, Bell, Menu, X, ChevronRight, ExternalLink,
  FileText, AlertCircle, Info, Check, Calendar, Clock
} from 'lucide-react';
import { UserProfile, Notification } from '../types';
import { MOCK_MODULES, MOCK_ASSIGNMENTS, SERVICE_GROUPS, MOCK_NOTIFICATIONS, FRAMES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
}

const Sidebar = ({ isOpen, setIsOpen, user }: { isOpen: boolean; setIsOpen: (v: boolean) => void; user: UserProfile }) => {
  const location = useLocation();
  const userFrame = FRAMES.find(f => f.id === user.frame);
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Modules', path: '/modules' },
    { icon: Activity, label: 'Activity', path: '/activity' }, 
    { icon: MessageSquare, label: 'Chat Box', path: '/community' },
    { icon: Settings, label: 'Settings', path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
       {/* Backdrop for mobile */}
       {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed inset-y-4 left-4 z-30 w-20 lg:w-64 bg-white dark:bg-dark-card rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'} lg:translate-x-0 flex flex-col`}>
        <div className="flex items-center justify-center lg:justify-start lg:px-8 h-24">
          <div className="bg-black text-white p-2 rounded-xl mr-0 lg:mr-3 shadow-lg shadow-gray-300/50 dark:shadow-none">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h1 className="hidden lg:block text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Athena</h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden absolute top-4 right-[-40px] text-gray-500 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-4 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start px-3 py-4 lg:py-3 lg:px-4 rounded-2xl transition-all duration-300 ease-in-out group hover:scale-[1.02] ${
                isActive(item.path)
                  ? 'bg-black text-white shadow-lg shadow-gray-300 dark:shadow-none dark:bg-primary'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <item.icon className={`h-6 w-6 lg:mr-3 transition-colors duration-300 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200'}`} />
              <span className="hidden lg:block font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <Link to="/profile" className="flex flex-col lg:flex-row items-center justify-center lg:justify-start space-x-0 lg:space-x-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-md">
            <div className={`relative p-0.5 rounded-full ${userFrame ? '' : ''}`}>
               <img 
                 src={user.avatar} 
                 alt="Profile" 
                 className={`w-10 h-10 rounded-full object-cover shadow-sm ${userFrame ? `border-2 ${userFrame.borderColor}` : 'border-2 border-white'}`} 
               />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">View Profile</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [expandedNotification, setExpandedNotification] = useState<Notification | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;
  const userFrame = FRAMES.find(f => f.id === user.frame);

  // Search logic
  const searchOptions = [
    // Main Pages
    { label: 'Dashboard', path: '/', sub: 'Home' },
    { label: 'Modules', path: '/modules', sub: 'Courses' },
    { label: 'Learning', path: '/learning', sub: 'AI Tutor' },
    { label: 'Timetable', path: '/timetable', sub: 'Schedule' },
    { label: 'Services & Tools', path: '/services', sub: 'Resources' },
    { label: 'Profile', path: '/profile', sub: 'Account' },
    { label: 'Shop', path: '/shop', sub: 'Customization' },
    
    // Modules
    ...MOCK_MODULES.map(m => ({ label: m.name, path: '/modules', state: { moduleId: m.id }, sub: m.code })),
    
    // Assignments
    ...MOCK_ASSIGNMENTS.map(a => ({ label: a.title, path: '/modules', state: { moduleId: a.moduleId }, sub: 'Assignment' })),
    
    // Service Links
    ...SERVICE_GROUPS.flatMap(group => group.links.map(link => ({
        label: link.label,
        path: link.url,
        sub: group.title,
        external: true
    })))
  ];

  const filteredOptions = searchOptions.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    opt.sub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (option: any) => {
    setSearchQuery('');
    setShowSuggestions(false);
    
    if (option.external) {
      window.open(option.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(option.path, { state: option.state });
    }
  };

  const handleNotificationClick = (n: Notification) => {
    // Mark as read
    const updatedNotifications = notifications.map(notif => 
      notif.id === n.id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);

    if (n.type === 'file' || n.type === 'assignment') {
      setShowNotifications(false);
      if (n.moduleId) {
        navigate('/modules', { state: { moduleId: n.moduleId } });
      } else if (n.link) {
         window.open(n.link, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Expand announcement/alert
      setExpandedNotification(n);
      setShowNotifications(false);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'file': return <FileText size={16} className="text-blue-500"/>;
      case 'alert': return <AlertCircle size={16} className="text-red-500"/>;
      case 'assignment': return <BookOpen size={16} className="text-orange-500"/>;
      default: return <Info size={16} className="text-gray-500"/>;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-dark text-slate-800 font-sans selection:bg-primary/20">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} />
      
      <div className="lg:ml-[calc(16rem+2rem)] lg:mr-8 transition-all duration-300 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-4 lg:px-0 pt-4 relative z-20">
          <div className="flex items-center">
             <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 mr-4 rounded-xl bg-white shadow-sm text-gray-500 hover:scale-105 transition-transform"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative w-80" ref={searchRef}>
              <div className="flex items-center bg-white dark:bg-dark-card px-4 py-2.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm focus-within:shadow-md focus-within:ring-2 ring-primary/20 transition-all duration-300">
                 <Search size={18} className="text-gray-400 mr-2" />
                 <input 
                   type="text" 
                   placeholder="Search pages, modules, services..." 
                   className="bg-transparent border-none focus:outline-none text-sm w-full dark:text-white placeholder-gray-400" 
                   value={searchQuery}
                   onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setShowSuggestions(true);
                   }}
                   onFocus={() => setShowSuggestions(true)}
                 />
              </div>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchQuery && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-fade-in z-50 max-h-96 overflow-y-auto custom-scrollbar">
                   {filteredOptions.length > 0 ? (
                     <ul>
                       {filteredOptions.slice(0, 10).map((opt, idx) => (
                         <li key={idx}>
                           <button 
                             onClick={() => handleSearchSelect(opt)}
                             className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center group transition-colors border-b border-gray-50 dark:border-gray-800 last:border-none"
                           >
                             <div className="flex-1 min-w-0 pr-3">
                               <span className="block text-sm font-semibold text-gray-800 dark:text-white truncate">{opt.label}</span>
                               <span className="block text-xs text-gray-400 truncate">{opt.sub}</span>
                             </div>
                             {(opt as any).external ? (
                               <ExternalLink size={14} className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                             ) : (
                               <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                             )}
                           </button>
                         </li>
                       ))}
                     </ul>
                   ) : (
                     <div className="p-4 text-center text-gray-400 text-sm">No results found</div>
                   )}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 bg-white dark:bg-dark-card rounded-full shadow-soft border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-gray-700 hover:scale-105 transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-dark-card"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                 <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                       <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                       {unreadCount > 0 && (
                         <button onClick={handleMarkAllRead} className="text-xs font-semibold text-primary hover:text-indigo-600 flex items-center">
                           Mark all read <Check size={12} className="ml-1"/>
                         </button>
                       )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-start gap-3 relative ${!n.read ? 'bg-indigo-50/40 dark:bg-indigo-900/10' : ''}`}
                          >
                             <div className={`p-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800'}`}>
                               {getNotificationIcon(n.type)}
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className={`text-sm mb-1 truncate ${!n.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-300'}`}>{n.title}</p>
                               <p className="text-xs text-gray-500 line-clamp-2 mb-1">{n.message}</p>
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-gray-400 font-medium">{n.sender}</span>
                                  <span className="text-[10px] text-gray-400">{n.date}</span>
                               </div>
                             </div>
                             {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></span>}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                           <p>No notifications.</p>
                        </div>
                      )}
                    </div>
                 </div>
              )}
            </div>

            <Link to="/profile" className="hidden md:block">
              <div className={`w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-sm hover:scale-105 transition-transform ${userFrame ? `border-2 ${userFrame.borderColor}` : 'border-2 border-white'}`}>
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-8 px-4 lg:px-0 relative">
          {children}
        </main>
      </div>

      {/* Expanded Notification Modal */}
      {expandedNotification && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-dark-card rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700 relative animate-scale-in">
              <button 
                onClick={() => setExpandedNotification(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                 <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    {getNotificationIcon(expandedNotification.type)}
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{expandedNotification.title}</h2>
                    <p className="text-sm text-gray-500">{expandedNotification.date}</p>
                 </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                 {expandedNotification.message}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-primary flex items-center justify-center font-bold text-xs">
                       {expandedNotification.sender.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{expandedNotification.sender}</span>
                 </div>
                 {expandedNotification.link && (
                    <a 
                      href={expandedNotification.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-bold flex items-center"
                    >
                      Open Link <ExternalLink size={14} className="ml-1"/>
                    </a>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

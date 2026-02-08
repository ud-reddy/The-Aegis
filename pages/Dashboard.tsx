import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../services/db';
import { MOCK_ASSIGNMENTS, MOCK_MODULES } from '../constants';
import { DisplayClassSession } from '../types';
import { Book, Clock, MapPin, ChevronDown, Calendar, ArrowRight, TrendingUp, CheckCircle, XCircle, Circle, AlertCircle, FileText } from 'lucide-react';

const TopMenuBar = () => (
  <div className="flex justify-center space-x-6 mb-8">
    <Link to="/services" className="px-8 py-4 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-200 font-bold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300">
      Services & Tools
    </Link>
    <Link to="/timetable" className="px-8 py-4 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-200 font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">
      Timetable
    </Link>
    <Link to="/learning" className="px-8 py-4 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-200 font-bold shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
      Learning
    </Link>
  </div>
);

const AttendanceChart = ({ data, type }: { data: any[], type: 'area' | 'bar' }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
             <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
             <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
             <Bar dataKey="attendance" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
            <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export const Dashboard = () => {
  const [classes, setClasses] = useState<DisplayClassSession[]>([]);
  const [stats, setStats] = useState({ percentage: 0, totalAttended: 0, totalHeld: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const weekDates = useMemo(() => {
    const dates = [];
    const curr = new Date();
    // Start from Monday
    const first = curr.getDate() - curr.getDay() + 1;
    const monday = new Date(curr.setDate(first));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedClasses = await db.getClasses();
      setClasses(fetchedClasses);
      setStats(db.calculateStats(fetchedClasses));
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    // Group attendance by module code
    const grouped: Record<string, { total: number, attended: number }> = {};
    classes.forEach(c => {
      if (c.attendance === null) return;
      if (!grouped[c.module_code]) grouped[c.module_code] = { total: 0, attended: 0 };
      grouped[c.module_code].total++;
      if (c.attendance === 1) grouped[c.module_code].attended++;
    });

    return Object.keys(grouped).map(code => ({
      name: code,
      attendance: Math.round((grouped[code].attended / grouped[code].total) * 100) || 0
    }));
  }, [classes]);

  const displayedClasses = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return classes.filter(c => c.class_date === dateStr);
  }, [classes, selectedDate]);

  const upcomingAssignments = useMemo(() => {
    return MOCK_ASSIGNMENTS
      .filter(a => a.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Here's your academic overview for today.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-dark-card px-5 py-3 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800">
          <Calendar className="text-primary" size={20} />
          <span className="text-gray-700 dark:text-gray-200 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </div>

      <TopMenuBar />

      {/* Stats Cards */}
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <div className="flex-1 max-w-md bg-white dark:bg-dark-card p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-green-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Overall Attendance</p>
            <div className="flex items-end gap-3">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stats.percentage}%</h3>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.percentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md bg-white dark:bg-dark-card p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle size={80} className="text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Classes Attended</p>
            <div className="flex items-end gap-3">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{stats.totalAttended}</h3>
              <span className="text-gray-400 mb-1 font-medium">/ {stats.totalHeld} held</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-dark-card p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Analytics</h2>
          </div>
          <div className="h-80">
            <AttendanceChart data={chartData} type="bar" />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedDate.toDateString() === new Date().toDateString() ? "Today's Schedule" : `${selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}'s Schedule`}
            </h2>
          </div>
          
          {/* Day Selector */}
          <div className="flex justify-between items-center mb-6 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl overflow-x-auto">
            {weekDates.map((date) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <button
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center min-w-[3rem] h-14 rounded-xl transition-all duration-200 ${
                    isSelected 
                      ? 'bg-white dark:bg-dark-card shadow-md text-indigo-600 dark:text-indigo-400 transform scale-105 font-bold' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider mb-0.5">{date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</span>
                  <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'} ${isToday && !isSelected ? 'text-indigo-500' : ''}`}>
                    {date.getDate()}
                  </span>
                  {isToday && <div className="w-1 h-1 rounded-full bg-indigo-500 mt-0.5" />}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            {displayedClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No classes scheduled for this day!</p>
              </div>
            ) : (
              displayedClasses.map(cls => (
                <div key={cls.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{cls.module_code}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-sm">
                      {cls.formattedTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin size={14} className="mr-1.5" />
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cls.class_location + ' University of Leeds')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cls.class_location}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 border ${
                      cls.attendance === 1 ? 'bg-green-50 text-green-700 border-green-200' :
                      cls.attendance === 0 ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      {cls.attendance === 1 && <CheckCircle size={12} />}
                      {cls.attendance === 0 && <XCircle size={12} />}
                      {cls.attendance === null && <Circle size={12} />}
                      {cls.attendance === 1 ? 'Yes' : cls.attendance === 0 ? 'No' : 'Null'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link to="/timetable" className="mt-6 flex items-center justify-center w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
            View Full Timetable
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <AlertCircle className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Assignments</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Prioritized by due date</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingAssignments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <p className="text-lg font-medium">All caught up! No pending assignments.</p>
            </div>
          ) : (
            upcomingAssignments.map((assignment, index) => {
              const module = MOCK_MODULES.find(m => m.id === assignment.moduleId);
              const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isUrgent = daysLeft <= 3;
              
              return (
                <div 
                  key={assignment.id}
                  onClick={() => navigate('/modules', { state: { moduleId: assignment.moduleId } })}
                  className="cursor-pointer bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Priority Indicator */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    index === 0 ? 'bg-red-500' : 
                    index === 1 ? 'bg-orange-500' : 
                    'bg-blue-500'
                  }`} />
                  
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div className="px-3 py-1 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
                      {module?.code || 'Unknown Module'}
                    </div>
                    {isUrgent && (
                      <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full animate-pulse">
                        <Clock size={12} className="mr-1" /> Due Soon
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pl-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {assignment.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 pl-2 mb-4">
                    <Calendar size={14} className="mr-2" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  <div className="pl-2 mt-auto">
                    <div className="flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      Go to Module <ArrowRight size={14} className="ml-1" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../services/db';
import { DisplayClassSession } from '../types';
import { MapPin, CheckCircle, XCircle, Clock, ChevronDown, Circle } from 'lucide-react';

export const Timetable = () => {
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [classes, setClasses] = useState<DisplayClassSession[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const schedule = await db.getClasses();
      setClasses(schedule);
    };
    fetchSchedule();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredClasses = useMemo(() => {
    if (view === 'day') {
      return classes.filter(c => c.dayName === selectedDay);
    }
    return classes; // In week view, we show everything, usually grouped by day or just list
  }, [view, selectedDay, classes]);

  const handleAttendance = async (classId: string, status: 0 | 1 | null) => {
    // Optimistic Update
    const oldClasses = [...classes];
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        let newStatus: 'Present' | 'Absent' | 'Pending' = 'Pending';
        if (status === 1) newStatus = 'Present';
        if (status === 0) newStatus = 'Absent';
        return { ...c, attendance: status, status: newStatus };
      }
      return c;
    }));

    const success = await db.updateAttendance(classId, status);
    if (!success) {
      // Revert on failure
      setClasses(oldClasses);
    }
  };

  const isEditable = (classDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clsDate = new Date(classDate);
    clsDate.setHours(0, 0, 0, 0);
    
    // Requirement: > today allows updating
    return clsDate > today;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Time Table</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-dark-card p-4 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 gap-4">
        <div className="flex space-x-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-2xl">
          <button 
            onClick={() => setView('day')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'day' ? 'bg-white dark:bg-gray-600 text-primary shadow-md' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Day View
          </button>
          <button 
            onClick={() => setView('week')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'week' ? 'bg-white dark:bg-gray-600 text-primary shadow-md' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Week View
          </button>
        </div>

        {view === 'day' && (
           <div className="relative">
             <select 
               value={selectedDay} 
               onChange={(e) => setSelectedDay(e.target.value)}
               className="appearance-none p-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
             >
               {days.map(d => <option key={d} value={d}>{d}</option>)}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
           </div>
        )}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                {view === 'week' && <th className="p-6 font-bold">Day</th>}
                <th className="p-6 font-bold">Time</th>
                <th className="p-6 font-bold">Module</th>
                <th className="p-6 font-bold">Location</th>
                <th className="p-6 font-bold text-center">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredClasses.length > 0 ? filteredClasses.map(cls => {
                const editable = isEditable(cls.class_date);
                return (
                  <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    {view === 'week' && <td className="p-6 text-gray-900 dark:text-white font-bold">{cls.dayName}</td>}
                    <td className="p-6">
                      <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                        <Clock size={16} className="mr-2 text-primary" />
                        {cls.formattedTime}
                      </div>
                    </td>
                    <td className="p-6 text-gray-900 dark:text-white font-medium">{cls.module_code}</td>
                    <td className="p-6">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <MapPin size={16} className="mr-2" />
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cls.class_location + ' University of Leeds')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline transition-colors"
                        >
                          {cls.class_location}
                        </a>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center items-center gap-2">
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border ${
                          cls.attendance === 1 ? 'bg-green-50 text-green-700 border-green-200' :
                          cls.attendance === 0 ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {cls.attendance === 1 && <CheckCircle size={14} />}
                          {cls.attendance === 0 && <XCircle size={14} />}
                          {cls.attendance === null && <Circle size={14} />}
                          {cls.attendance === 1 ? 'Yes' : cls.attendance === 0 ? 'No' : 'Null'}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No classes found for this selection.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

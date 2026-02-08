import { supabase } from './supabaseClient';
import { DisplayClassSession, ClassSession } from '../types';

export const db = {
  // Fetch all classes (filtered by date range if needed, but for now we fetch all relevant ones)
  async getClasses(): Promise<DisplayClassSession[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('class_date', { ascending: true })
      .order('class_start_time', { ascending: true });

    if (error) {
      console.error('Error fetching classes:', error);
      return [];
    }

    return (data || []).map((c: ClassSession) => transformToDisplay(c));
  },

  // Update attendance for a specific class
  async updateAttendance(id: string, status: 0 | 1 | null): Promise<boolean> {
    const { error } = await supabase
      .from('classes')
      .update({ attendance: status })
      .eq('id', id);

    if (error) {
      console.error('Error updating attendance:', error);
      return false;
    }
    return true;
  },

  // Calculate stats from the fetched classes (can be done on frontend, but good to have a helper)
  calculateStats(classes: DisplayClassSession[]) {
    const validClasses = classes.filter(c => c.attendance !== null);
    const totalHeld = classes.filter(c => new Date(c.class_date) <= new Date()).length;
    const totalAttended = validClasses.filter(c => c.attendance === 1).length;
    const totalMarked = validClasses.length;
    
    const percentage = totalMarked > 0 ? Math.round((totalAttended / totalMarked) * 100) : 0;

    return {
      percentage,
      totalAttended,
      totalHeld
    };
  }
};

// Helper to transform DB shape to UI shape
function transformToDisplay(c: ClassSession): DisplayClassSession {
  const date = new Date(c.class_date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  
  // Simple duration calc
  // Assuming times are HH:MM:SS
  const start = new Date(`1970-01-01T${c.class_start_time}Z`);
  const end = new Date(`1970-01-01T${c.class_end_time}Z`);
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const durationStr = `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;

  const formattedTime = `${c.class_start_time.slice(0, 5)} - ${c.class_end_time.slice(0, 5)}`;
  
  let status: 'Present' | 'Absent' | 'Pending' = 'Pending';
  if (c.attendance === 1) status = 'Present';
  if (c.attendance === 0) status = 'Absent';

  return {
    ...c,
    dayName,
    formattedTime,
    durationStr,
    status
  };
}

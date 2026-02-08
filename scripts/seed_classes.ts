import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('🌱 Starting seed for `classes` table...');

  // 1. Clean up existing data
  const { error: delError } = await supabase.from('classes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) console.warn('Warning clearing classes:', delError.message);

  const modules = ['CS101', 'MATH202', 'PHY101', 'HIST105'];
  const locations = [
    'Room 8.20 Roger Stevens Building', 
    'Room 9.01 EC Stoner Building', 
    'Room 7.02 Worsley Building', 
    'Room 1.05 Maurice Keyworth Building',
    'Room B.02 Parkinson Building',
    'Room 2.10 Clothworkers Building'
  ];
  
  const sessions = [];
  const today = new Date();
  
  // Helper to add days
  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  // Generate sessions: 5 days past, today, 5 days future
  for (let i = -5; i <= 5; i++) {
    const currentDate = addDays(today, i);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay(); // 0=Sun

    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

    // Add 2 classes per day
    sessions.push({
      module_code: modules[Math.abs(i) % modules.length],
      class_date: dateStr,
      class_start_time: '09:00:00',
      class_end_time: '10:30:00',
      class_location: locations[0],
      attendance: i < 0 ? (Math.random() > 0.2 ? 1 : 0) : null // Past classes have random attendance, future/today are null
    });

    sessions.push({
      module_code: modules[(Math.abs(i) + 1) % modules.length],
      class_date: dateStr,
      class_start_time: '11:00:00',
      class_end_time: '12:30:00',
      class_location: locations[1],
      attendance: i < 0 ? (Math.random() > 0.2 ? 1 : 0) : null
    });
  }

  // Insert data
  const { error } = await supabase.from('classes').insert(sessions);
  
  if (error) {
    console.error('Error seeding classes:', error);
  } else {
    console.log(`✅ Seeded ${sessions.length} class sessions.`);
  }
}

seed();

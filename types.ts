
export interface Module {
  id: string;
  code: string;
  name: string;
  instructors: string[];
  color: string;
  term: string; // e.g., "Year 1 - Semester 1"
  status: 'Open' | 'Closed';
  image: string;
}

export interface Assignment {
  id: string;
  moduleId: string;
  title: string;
  dueDate: string;
  grade?: string; // e.g., "78%" or undefined if not graded
  status: 'pending' | 'submitted' | 'graded';
}

export interface ClassSession {
  id: string;
  module_code: string;
  class_date: string; // YYYY-MM-DD
  class_start_time: string; // HH:MM:SS
  class_end_time: string; // HH:MM:SS
  class_location: string;
  attendance: 0 | 1 | null; // 0 = absent, 1 = present, null = pending
}

// Helper interface for Frontend display if needed, but we should align with DB as much as possible
export interface DisplayClassSession extends ClassSession {
  dayName: string; // e.g. "Monday"
  formattedTime: string; // "09:00 - 10:30"
  durationStr: string;
  status: 'Present' | 'Absent' | 'Pending';
}

export interface UserProfile {
  name: string;
  id: string;
  school: string;
  course: string;
  bio: string;
  avatar: string;
  persona: string; // e.g., "Scholar", "Athlete"
  emoji?: string;
  frame?: string;
}

export interface FrameItem {
  id: string;
  name: string;
  theme: 'Marvel' | 'DC' | 'TV' | 'Anime' | 'K-Drama';
  label: string;
  color: string;
  borderColor: string;
}

export enum LearningLevelStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  COMPLETED = 'completed'
}

export interface LearningLevel {
  id: number;
  title: string;
  content: string;
  examples: string[];
  status: LearningLevelStatus;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  sender: string;
  date: string;
  type: 'announcement' | 'file' | 'alert' | 'assignment';
  moduleId?: string; // Optional: ID of the module to navigate to
  link?: string; // Optional: External link
  read: boolean;
}

export type ActivityType = 'announcement' | 'grade' | 'assignment' | 'resource' | 'class';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  content?: string; // Detailed content for modal
  date: string; // For grouping (e.g. "Today")
  timestamp: string; // Specific time (e.g. "14:00")
  moduleId?: string;
  moduleName?: string;
  isRead: boolean;
  actionLabel?: string;
}

export type PostCategory = 'Academic' | 'Non-Academic' | 'Event' | 'Announcement' | 'Social';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string; // e.g. "Student", "Class Rep"
  };
  category: PostCategory;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean; // Track if current user liked it
  comments: number;
  commentsList?: Comment[];
  isArchived?: boolean;
  image?: string;
  file?: {
    name: string;
    type: string;
  };
}

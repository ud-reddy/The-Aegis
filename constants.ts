
import { Module, Assignment, ClassSession, UserProfile, LearningLevel, LearningLevelStatus, Notification, ActivityItem, Post, FrameItem } from './types';

// Helper to generate a consistent color based on index
const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

export const EMOJIS = [
  '😀', '😎', '🤓', '🤠', '🥳', 
  '🚀', '⭐', '🔥', '💡', '💻', 
  '🎨', '⚽', '🎮', '📚', '🎵',
  '🍕', '🐱', '🐶', '🐉', '🦄'
];

export const FRAMES: FrameItem[] = [
  // Marvel
  { id: 'm1', name: 'Iron Legacy', theme: 'Marvel', label: 'I Love You 3000', color: 'text-red-500', borderColor: 'border-red-500' },
  { id: 'm2', name: 'Wakanda Forever', theme: 'Marvel', label: 'Wakanda Forever', color: 'text-purple-600', borderColor: 'border-purple-600' },
  
  // DC
  { id: 'd1', name: 'Dark Knight', theme: 'DC', label: 'Why So Serious?', color: 'text-green-600', borderColor: 'border-green-600' },
  { id: 'd2', name: 'Man of Steel', theme: 'DC', label: 'Hope', color: 'text-blue-600', borderColor: 'border-blue-600' },
  
  // TV Series
  { id: 't1', name: 'Throne', theme: 'TV', label: 'Winter is Coming', color: 'text-gray-400', borderColor: 'border-gray-400' },
  { id: 't2', name: 'Friends', theme: 'TV', label: 'How you doin?', color: 'text-orange-500', borderColor: 'border-orange-500' },
  
  // Anime
  { id: 'a1', name: 'Ninja Way', theme: 'Anime', label: 'Dattebayo!', color: 'text-orange-400', borderColor: 'border-orange-400' },
  { id: 'a2', name: 'Pirate King', theme: 'Anime', label: 'I\'m gonna be King', color: 'text-red-400', borderColor: 'border-red-400' },
  
  // K-Drama
  { id: 'k1', name: 'Fighting', theme: 'K-Drama', label: 'Fighting!', color: 'text-pink-400', borderColor: 'border-pink-400' },
  { id: 'k2', name: 'Finger Heart', theme: 'K-Drama', label: 'Saranghae', color: 'text-pink-500', borderColor: 'border-pink-500' }
];

export const MOCK_MODULES: Module[] = [
  // Year 1 - Semester 1
  { 
    id: 'm1', 
    code: 'CS101', 
    name: 'Intro to Computer Science', 
    instructors: ['Dr. Alan Turing'], 
    color: colors[0], 
    term: 'Year 1 - Semester 1', 
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm2', 
    code: 'MATH101', 
    name: 'Calculus I', 
    instructors: ['Dr. Ada Lovelace', 'Prof. Newton'], 
    color: colors[1], 
    term: 'Year 1 - Semester 1', 
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm3', 
    code: 'PHYS101', 
    name: 'Mechanics', 
    instructors: ['Dr. Richard Feynman'], 
    color: colors[2], 
    term: 'Year 1 - Semester 1', 
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm4', 
    code: 'CS102', 
    name: 'Discrete Mathematics', 
    instructors: ['Prof. George Boole'], 
    color: colors[3], 
    term: 'Year 1 - Semester 1', 
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600'
  },
  
  // Year 1 - Semester 2
  { 
    id: 'm5', 
    code: 'CS103', 
    name: 'Data Structures', 
    instructors: ['Dr. Grace Hopper'], 
    color: colors[4], 
    term: 'Year 1 - Semester 2', 
    status: 'Closed',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm6', 
    code: 'MATH102', 
    name: 'Linear Algebra', 
    instructors: ['Prof. Gauss', 'Dr. Noether'], 
    color: colors[5], 
    term: 'Year 1 - Semester 2', 
    status: 'Closed',
    image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm7', 
    code: 'CS104', 
    name: 'Web Development', 
    instructors: ['Tim Berners-Lee'], 
    color: colors[6], 
    term: 'Year 1 - Semester 2', 
    status: 'Closed',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm8', 
    code: 'ETHICS101', 
    name: 'Ethics in Computing', 
    instructors: ['Prof. Socrates'], 
    color: colors[7], 
    term: 'Year 1 - Semester 2', 
    status: 'Closed',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600'
  },

  // Year 2 - Semester 1
  { 
    id: 'm9', 
    code: 'CS201', 
    name: 'Algorithms', 
    instructors: ['Dr. Dijkstra'], 
    color: colors[0], 
    term: 'Year 2 - Semester 1', 
    status: 'Closed',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm10', 
    code: 'CS202', 
    name: 'Operating Systems', 
    instructors: ['Ken Thompson', 'Dennis Ritchie'], 
    color: colors[1], 
    term: 'Year 2 - Semester 1', 
    status: 'Closed',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm11', 
    code: 'CS203', 
    name: 'Databases', 
    instructors: ['Dr. Codd'], 
    color: colors[2], 
    term: 'Year 2 - Semester 1', 
    status: 'Closed',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600'
  },
  { 
    id: 'm12', 
    code: 'AI201', 
    name: 'Intro to AI', 
    instructors: ['John McCarthy', 'Marvin Minsky'], 
    color: colors[3], 
    term: 'Year 2 - Semester 1', 
    status: 'Closed',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600'
  },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', moduleId: 'm1', title: 'Algorithm Analysis Essay', dueDate: '2023-11-15', status: 'pending' },
  { id: 'a2', moduleId: 'm1', title: 'Python Basics Lab', dueDate: '2023-10-20', grade: '92%', status: 'graded' },
  { id: 'a3', moduleId: 'm2', title: 'Differential Equations Set', dueDate: '2023-11-18', status: 'pending' },
  { id: 'a4', moduleId: 'm3', title: 'Wave Function Report', dueDate: '2023-11-01', status: 'submitted' },
  { id: 'a5', moduleId: 'm4', title: 'Logic Gates Project', dueDate: '2023-12-01', status: 'pending' },
];

export const MOCK_CLASSES: ClassSession[] = [
  { id: 'c1', moduleId: 'm1', moduleName: 'Intro to CS', time: '09:00', duration: '1h', room: 'Roger Stevens LT 20', attended: true, day: 'Monday' },
  { id: 'c2', moduleId: 'm2', moduleName: 'Calculus I', time: '11:00', duration: '1h', room: 'Maths Building 1.05', attended: false, day: 'Monday' },
  { id: 'c3', moduleId: 'm3', moduleName: 'Mechanics', time: '14:00', duration: '2h', room: 'Physics Lab 3', attended: true, day: 'Tuesday' },
  { id: 'c4', moduleId: 'm4', moduleName: 'Discrete Math', time: '10:00', duration: '1h', room: 'Michael Sadler LG.10', attended: true, day: 'Wednesday' },
  { id: 'c5', moduleId: 'm1', moduleName: 'Intro to CS', time: '09:00', duration: '1h', room: 'Roger Stevens LT 20', attended: true, day: 'Thursday' },
  { id: 'c6', moduleId: 'm2', moduleName: 'Calculus I', time: '13:00', duration: '1h', room: 'Maths Building 1.05', attended: true, day: 'Friday' },
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'John Snow',
  id: '201567890',
  school: 'School of Math',
  course: 'MSc Data Science and Analytics',
  bio: 'I know nothing',
  avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Kit_Harington_(9344991227).jpg',
  persona: 'Scholar'
};

export const MOCK_LEVELS: LearningLevel[] = [
  {
    id: 1,
    title: 'Basic Concepts',
    status: LearningLevelStatus.COMPLETED,
    content: 'Introduction to the core principles. We start by defining the variable types and memory allocation.',
    examples: ['Integer: 5', 'String: "Hello"', 'Boolean: True'],
    quiz: [{ question: 'What is an Integer?', options: ['A whole number', 'text', 'A decimal'], correctIndex: 0 }]
  },
  {
    id: 2,
    title: 'Control Structures',
    status: LearningLevelStatus.UNLOCKED,
    content: 'Loops and conditionals allow your program to make decisions and repeat tasks.',
    examples: ['If (x > 5)', 'For (i = 0; i < 10; i++)'],
    quiz: [{ question: 'Which loop runs at least once?', options: ['For', 'While', 'Do-While'], correctIndex: 2 }]
  },
  {
    id: 3,
    title: 'Data Structures',
    status: LearningLevelStatus.LOCKED,
    content: 'Arrays, Lists, and Maps used to store collections of data efficiently.',
    examples: ['List<String> names', 'Map<Key, Value>'],
    quiz: [{ question: 'What is the index of the first element in an array?', options: ['1', '0', '-1'], correctIndex: 1 }]
  },
  {
    id: 4,
    title: 'Algorithms',
    status: LearningLevelStatus.LOCKED,
    content: 'Sorting and Searching algorithms.',
    examples: ['QuickSort', 'Binary Search'],
    quiz: [{ question: 'Best case for QuickSort?', options: ['O(n)', 'O(n log n)', 'O(n^2)'], correctIndex: 1 }]
  },
  {
    id: 5,
    title: 'Complexity',
    status: LearningLevelStatus.LOCKED,
    content: 'Big O notation and complexity analysis.',
    examples: ['O(1)', 'O(n)'],
    quiz: [{ question: 'Complexity of accessing array by index?', options: ['O(1)', 'O(n)', 'O(log n)'], correctIndex: 0 }]
  }
];

export const SERVICE_GROUPS = [
  {
    title: "Tools & University Systems",
    links: [
      { label: "Student Services", url: "https://prod.banner.leeds.ac.uk/ssb/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu" },
      { label: "University Email", url: "https://outlook.office365.com/mail/?wa=wsignin1.0" },
      { label: "My Timetable", url: "#" }, 
      { label: "OneDrive", url: "https://leeds365-my.sharepoint.com/?wa=wsignin1%2E0" },
      { label: "PebblePad", url: "https://v3.pebblepad.co.uk/login/leeds" },
      { label: "LinkedIn Learning", url: "https://www.linkedin.com/learning/?u=57895809" },
      { label: "FutureLearn Campus", url: "https://www.futurelearn.com/campus/university-of-leeds" },
      { label: "Coursera", url: "https://www.coursera.org/programs/university-of-leeds-on-coursera-6er00?authProvider=c4c-leeds-university" },
      { label: "Digital Education Help", url: "https://desystemshelp.leeds.ac.uk/student-guides/" }
    ]
  },
  {
    title: "Students",
    links: [
      { label: "Students Website", url: "https://students.leeds.ac.uk/" },
      { label: "Leeds University Union", url: "https://www.luu.ac.uk/" },
      { label: "Student Wellbeing", url: "https://students.leeds.ac.uk/counselling-wellbeing-support" },
      { label: "Disability Services", url: "https://students.leeds.ac.uk/support-disabled-students/doc/disability-services" },
      { label: "Report + Support", url: "https://reportandsupport.leeds.ac.uk/" },
      { label: "Academic Integrity", url: "https://desystemshelp.leeds.ac.uk/student-guides/assessment/the-academic-integrity-tutorial-and-test/" },
      { label: "The Language Zone", url: "https://leeds365.sharepoint.com/sites/TheLanguageZone" }
    ]
  },
  {
    title: "Library",
    links: [
      { label: "Library Search", url: "https://library.leeds.ac.uk/" },
      { label: "My Library Account", url: "https://leeds.primo.exlibrisgroup.com/discovery/login?vid=44LEE_INST:VU1" },
      { label: "Book a Study Space", url: "https://library.leeds.ac.uk/info/1200/library_services/198/study_space" },
      { label: "Resources for My Subject", url: "https://library.leeds.ac.uk/subjects" },
      { label: "Opening Hours", url: "https://library.leeds.ac.uk/locations" },
      { label: "Academic Skills", url: "https://library.leeds.ac.uk/info/1401/academic_skills" },
      { label: "Referencing", url: "https://library.leeds.ac.uk/info/1402/referencing" }
    ]
  },
  {
    title: "IT Help & Services",
    links: [
      { label: "Report a Problem", url: "https://it.leeds.ac.uk/it?id=sc_cat_item&sys_id=3f1dd0320a0a0b99000a53f7604a2ef9" },
      { label: "Service Status", url: "https://it.leeds.ac.uk/it?id=services_status" },
      { label: "Campus Map", url: "https://www.leeds.ac.uk/campusmap" },
      { label: "Computer Clusters", url: "https://it.leeds.ac.uk/it?id=clusters" },
      { label: "MyPrint Account", url: "https://myprint.leeds.ac.uk/app;jsessionid=node01q81wz33hmvqwfh6vr47r1r8y147792.node0?service=page/Home" },
      { label: "Software for Home Use", url: "https://it.leeds.ac.uk/it?id=kb_article&sysparm_article=KB0011862" },
      { label: "IT Help Articles", url: "https://it.leeds.ac.uk/it?id=kb_view2" },
      { label: "Minerva Help Guides", url: "https://desystemshelp.leeds.ac.uk/student-guides/" },
      { label: "Working Off-Campus", url: "https://it.leeds.ac.uk/it?id=kb_article_view&sysparm_article=KB0013832" }
    ]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Lecture Cancelled',
    message: 'The lecture for CS101 tomorrow is cancelled due to illness. Please check the learning materials for recorded content. We apologize for the inconvenience and will reschedule nicely.',
    sender: 'Dr. Alan Turing',
    date: '2 hours ago',
    type: 'alert',
    moduleId: 'm1',
    read: false
  },
  {
    id: 'n2',
    title: 'New Assignment Uploaded',
    message: 'Assignment 2: Genetic Algorithms has been uploaded. This is a crucial part of your coursework. Please review the requirements carefully.',
    sender: 'Dr. Dijkstra',
    date: '1 day ago',
    type: 'assignment',
    moduleId: 'm9',
    read: false
  },
  {
    id: 'n3',
    title: 'Library Overdue Notice',
    message: 'You have a book overdue: "Clean Code". Please return it to the Brotherton Library to avoid fines.',
    sender: 'Library Services',
    date: '2 days ago',
    type: 'alert',
    read: true
  },
  {
    id: 'n4',
    title: 'Week 5 Slides Available',
    message: 'The slides for Week 5 have been uploaded to the module resources. It covers the new topics on Data Structures.',
    sender: 'Dr. Ada Lovelace',
    date: '3 days ago',
    type: 'file',
    moduleId: 'm2',
    read: true
  },
  {
    id: 'n5',
    title: 'Campus WiFi Maintenance',
    message: 'Eduroam will be down for maintenance on Saturday from 2am to 6am. Please plan your study time accordingly.',
    sender: 'IT Services',
    date: '4 days ago',
    type: 'announcement',
    link: 'https://it.leeds.ac.uk/it?id=services_status',
    read: true
  }
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act1',
    type: 'grade',
    title: 'Grade posted: Coursework Submission',
    description: 'You received a grade for "Machine Learning Basics"',
    date: 'Today',
    timestamp: '14:20',
    moduleId: 'm12',
    moduleName: 'Intro to AI (AI201)',
    isRead: false,
    actionLabel: 'View Grade'
  },
  {
    id: 'act2',
    type: 'announcement',
    title: 'Reminder: Supervisors Meet the Students - Monday 9 February',
    description: 'A reminder that the supervisor meeting will take place in the main hall...',
    content: 'A reminder that the supervisor meeting will take place in the main hall. Please bring your project proposal drafts. This is a mandatory session for all final year students.',
    date: 'Today',
    timestamp: '09:00',
    moduleName: 'General',
    isRead: false
  },
  {
    id: 'act3',
    type: 'assignment',
    title: 'New Assignment: Dissertation Draft',
    description: 'Added: 2024_Dissertation_Guidelines.pdf',
    date: 'Yesterday',
    timestamp: '16:45',
    moduleId: 'm9',
    moduleName: 'Algorithms (CS201)',
    isRead: true,
    actionLabel: 'View Assignment'
  },
  {
    id: 'act4',
    type: 'resource',
    title: 'Week 4 Lecture Slides Uploaded',
    description: 'The slides for "Greedy Algorithms" are now available.',
    date: 'Yesterday',
    timestamp: '11:30',
    moduleId: 'm9',
    moduleName: 'Algorithms (CS201)',
    isRead: true
  },
  {
    id: 'act5',
    type: 'announcement',
    title: 'Minerva Maintenance',
    description: 'System will be offline for 2 hours this weekend.',
    content: 'Please be advised that the Minerva system will undergo scheduled maintenance on Saturday between 02:00 and 04:00 AM. Ensure you save all work beforehand.',
    date: 'Last Week',
    timestamp: 'Feb 6',
    moduleName: 'IT Services',
    isRead: true
  },
  {
    id: 'act6',
    type: 'grade',
    title: 'Grade posted: Ethics Quiz 4',
    description: 'Score: 18/20',
    date: 'Last Week',
    timestamp: 'Feb 5',
    moduleId: 'm8',
    moduleName: 'Ethics in Computing',
    isRead: true,
    actionLabel: 'View Feedback'
  },
  {
    id: 'act7',
    type: 'resource',
    title: 'SUST0005 (Sustainability Induction)',
    description: 'Added: 2.4 Reflective Task: How could your discipline contribute to sustainability?',
    date: 'Last Week',
    timestamp: 'Feb 4',
    moduleName: 'Sustainability Module',
    isRead: true
  },
  {
    id: 'act8',
    type: 'announcement',
    title: 'Guest Lecture: Dr. Hinton',
    description: 'Join us for a talk on Neural Networks.',
    content: 'Dr. Hinton will be visiting on Friday to give a guest lecture on the history and future of Neural Networks. Room: LT 20.',
    date: 'Last Week',
    timestamp: 'Feb 4',
    moduleId: 'm12',
    moduleName: 'Intro to AI',
    isRead: true
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      role: 'Student'
    },
    category: 'Academic',
    content: 'Has anyone started the Algorithm Analysis essay yet? I am slightly confused about the requirements for the "Time Complexity" section. Are we supposed to include pseudo-code or just the mathematical proof?',
    timestamp: '2 hours ago',
    likes: 12,
    comments: 2,
    commentsList: [
        {
            id: 'c1',
            author: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
            content: 'Just the proof is fine, pseudo-code is optional but helpful.',
            timestamp: '1 hour ago'
        },
        {
            id: 'c2',
            author: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
            content: 'Great, thanks David!',
            timestamp: '30 mins ago'
        }
    ]
  },
  {
    id: 'p2',
    author: {
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
      role: 'Class Rep'
    },
    category: 'Announcement',
    content: 'Reminder: The student union is hosting a coffee morning for all CS students this Friday at 10 AM. Free pastries! 🥐☕',
    timestamp: '5 hours ago',
    likes: 45,
    comments: 0,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p3',
    author: {
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      role: 'Student'
    },
    category: 'Non-Academic',
    content: 'Found a blue water bottle in the Roger Stevens lecture hall (LT 20) after the Mechanics lecture. Left it at the front desk!',
    timestamp: '1 day ago',
    likes: 5,
    comments: 1,
    commentsList: [
        {
            id: 'c3',
            author: 'Tom Holland',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
            content: 'I think that belongs to Matt!',
            timestamp: '20 hours ago'
        }
    ]
  },
  {
    id: 'p4',
    author: {
      name: 'Michael Chang',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      role: 'Student'
    },
    category: 'Academic',
    content: 'Here are my notes from today\'s Linear Algebra lecture if anyone missed it. The professor went really fast through the Eigenvalues part.',
    timestamp: '1 day ago',
    likes: 28,
    comments: 0,
    file: {
      name: 'Linear_Algebra_Week4_Notes.pdf',
      type: 'pdf'
    }
  }
];


export type VideoCategory = 'Yoga' | 'HIIT' | 'Strength' | 'Meditation' | 'Flexibility';

export type Video = {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  thumbnailUrl: string;
  aiHint: string; // For Unsplash search for thumbnail
  videoUrl: string; // Placeholder for actual video source
  duration: string; // e.g., "15:30"
  instructor?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
};

export const videos: Video[] = [
  {
    id: 'vid_001',
    title: 'Gentle Morning Yoga Flow',
    description: 'Start your day with this refreshing 20-minute yoga sequence designed to awaken your body and mind. Suitable for all levels.',
    category: 'Yoga',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'yoga sunrise serene',
    videoUrl: 'placeholder_yoga_flow.mp4',
    duration: '20:15',
    instructor: 'Priya Sharma',
    level: 'Beginner',
  },
  {
    id: 'vid_002',
    title: '30-Minute Full Body HIIT',
    description: 'A high-intensity interval training workout to burn calories and boost your metabolism. No equipment needed!',
    category: 'HIIT',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'HIIT workout dynamic',
    videoUrl: 'placeholder_hiit_full_body.mp4',
    duration: '30:00',
    instructor: 'Raj Verma',
    level: 'Intermediate',
  },
  {
    id: 'vid_003',
    title: 'Core Strength Builder',
    description: 'Target your abdominal muscles and build a strong core with these effective exercises. 15 minutes to a stronger midsection.',
    category: 'Strength',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'core workout abs',
    videoUrl: 'placeholder_core_strength.mp4',
    duration: '15:45',
    instructor: 'Aarav Singh',
    level: 'Intermediate',
  },
  {
    id: 'vid_004',
    title: 'Guided Meditation for Stress Relief',
    description: 'Unwind and find calm with this 10-minute guided meditation. Perfect for reducing stress and improving focus.',
    category: 'Meditation',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'meditation peaceful nature',
    videoUrl: 'placeholder_meditation_stress_relief.mp4',
    duration: '10:30',
    instructor: 'Anika Reddy',
    level: 'Beginner',
  },
  {
    id: 'vid_005',
    title: 'Advanced Vinyasa Yoga Practice',
    description: 'Challenge yourself with this dynamic 60-minute Vinyasa flow, incorporating advanced poses and transitions.',
    category: 'Yoga',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'advanced yoga pose studio',
    videoUrl: 'placeholder_vinyasa_advanced.mp4',
    duration: '60:00',
    instructor: 'Priya Sharma',
    level: 'Advanced',
  },
  {
    id: 'vid_006',
    title: 'Quick HIIT Cardio Blast',
    description: 'A 10-minute quick cardio session to get your heart rate up. Perfect for a busy schedule.',
    category: 'HIIT',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'cardio workout energetic',
    videoUrl: 'placeholder_hiit_cardio_quick.mp4',
    duration: '10:00',
    instructor: 'Raj Verma',
    level: 'All Levels',
  },
  {
    id: 'vid_007',
    title: 'Upper Body Strength Workout',
    description: 'Build strength in your arms, shoulders, chest, and back with this targeted 45-minute workout. Dumbbells recommended.',
    category: 'Strength',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'upper body strength fitness',
    videoUrl: 'placeholder_upper_body_strength.mp4',
    duration: '45:20',
    instructor: 'Aarav Singh',
    level: 'Intermediate',
  },
  {
    id: 'vid_008',
    title: 'Mindfulness Meditation for Beginners',
    description: 'Learn the basics of mindfulness meditation in this gentle 15-minute guided session.',
    category: 'Meditation',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'mindfulness person calm',
    videoUrl: 'placeholder_meditation_mindfulness.mp4',
    duration: '15:00',
    instructor: 'Anika Reddy',
    level: 'Beginner',
  },
  {
    id: 'vid_009',
    title: 'Deep Stretch & Flexibility Routine',
    description: 'Improve your flexibility and relieve muscle tension with this 25-minute deep stretching routine.',
    category: 'Flexibility',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'stretching flexibility person',
    videoUrl: 'placeholder_flexibility_routine.mp4',
    duration: '25:00',
    instructor: 'Priya Sharma',
    level: 'All Levels',
  },
  {
    id: 'vid_010',
    title: 'Leg Day Power Builder',
    description: 'A challenging leg workout focused on building strength and power. Squats, lunges, and more. 50 minutes.',
    category: 'Strength',
    thumbnailUrl: 'https://placehold.co/400x225.png',
    aiHint: 'leg workout gym',
    videoUrl: 'placeholder_leg_day_power.mp4',
    duration: '50:00',
    instructor: 'Aarav Singh',
    level: 'Advanced',
  },
];

export const videoCategories: VideoCategory[] = ['Yoga', 'HIIT', 'Strength', 'Meditation', 'Flexibility'];

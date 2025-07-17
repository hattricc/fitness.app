export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  videoId: string;
  image?: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: '10 Minute Morning Yoga Flow',
    description: 'Start your day with this energizing yoga sequence to wake up your body and mind.',
    category: 'Yoga',
    duration: 10,
    videoId: 'v7AYKMP6rOE'
  },
  {
    id: '2',
    title: 'Perfect Push-up Form',
    description: 'Learn the proper form for push-ups to maximize results and prevent injury.',
    category: 'Strength',
    duration: 5,
    videoId: 'IODxDxX7oi4'
  },
  {
    id: '3',
    title: 'Meal Prep for Weight Loss',
    description: 'Simple and healthy meal prep ideas to support your weight loss goals.',
    category: 'Nutrition',
    duration: 8,
    videoId: 'pKSPbD0BECM'
  },
  {
    id: '4',
    title: 'Full Body Stretching Routine',
    description: 'Improve flexibility and reduce muscle tension with this complete stretching routine.',
    category: 'Flexibility',
    duration: 15,
    videoId: 'g_tea8ZNk5A'
  },
  {
    id: '5',
    title: 'HIIT Workout for Beginners',
    description: 'High-intensity interval training workout that burns maximum calories in minimal time.',
    category: 'Cardio',
    duration: 20,
    videoId: 'ml6cTNFAZtI'
  },
  {
    id: '6',
    title: 'Core Strengthening Exercises',
    description: 'Build a strong core with these effective exercises you can do at home.',
    category: 'Core',
    duration: 12,
    videoId: '2pLT-olgUBe8'
  },
];

import coursesData from './courses.json';
import { Course } from '@/types/course';

const courses = coursesData as Course[];

// // Group exercises by category
// const coursesByCategory = courses.reduce((acc, course) => {
//   if (!acc[course.category]) {
//     acc[course.category] = [];
//   }
//   acc[course.category].push(course);
//   return acc;
// }, {} as Record<string, CourseData[]>);

// // Create a workout routine from exercises in a category
// const createWorkoutRoutine = (category: string): WorkoutRoutine => {
//   const categoryCourses = coursesByCategory[category] || [];

//   // Create exercise routines from the exercises
//   const courseRoutines: ExerciseRoutine[] = categoryCourses.map((course, index) => ({
//     id: course.id,
//     name: course.name,
//     tag: course.subcategory,
//     difficulty: 'intermediate',
//     duration: course.duration,
//     calories: 10,
//     imageUrl: course.imageUrl,
//     description: course.description,
//     category: course.category.toLowerCase().replace(/\s+/g, '-'),
//     categoryName: course.category,
//     videoUrl: course.url || '',
//     // sets: [
//     //   {
//     //     id: `s-${ex.id}-1`,
//     //     name: 'Set 1',
//     //     description: ex.name,
//     //     duration: 30,
//     //     rest: 10,
//     //     videoUrl: ex.url || ''
//     //   },
//     //   {
//     //     id: `s-${ex.id}-2`,
//     //     name: 'Set 2',
//     //     description: ex.name,
//     //     duration: 30,
//     //     rest: 10,
//     //     videoUrl: ex.url || ''
//     //   }
//     // ]
//   }));

//   return {
//     id: `wr-${category.toLowerCase().replace(/\s+/g, '-')}`,
//     name: category,
//     tag: category,
//     difficulty: 'intermediate',
//     duration: courseRoutines.length * 5 + ' min', // 5 minutes per exercise
//     calories: courseRoutines.length * 30, // 30 calories per exercise
//     imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
//     description: `Workout routine for ${category}`,
//     category: category.toLowerCase().replace(/\s+/g, '-'),
//     rounds: [
//       {
//         id: 'r1',
//         exercises: courseRoutines
//       }
//     ]
//   };
// };

// // Create workout routines for each category
// const workoutRoutines: WorkoutRoutine[] = Object.keys(coursesByCategory).map(
//   category => createWorkoutRoutine(category)
// );

// // Create a map of workout routines by ID for easy lookup
// const workouts: Record<string, WorkoutRoutine> = workoutRoutines.reduce((acc, routine) => {
//   acc[routine.id] = routine;
//   return acc;
// }, {} as Record<string, WorkoutRoutine>);

export const getWorkoutById = (id: string): Course | undefined => {
  return courses.find((course) => course.id === id);
};

export const getAllWorkouts = (): Course[] => {
  return courses;
};

export default courses;

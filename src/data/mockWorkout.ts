import { WorkoutRoutine, ExerciseRoutine, ExerciseSet } from '../types/exercise';
import exercisesData from './exercises.json';

interface ExerciseData {
  category: string;
  subcategory: string;
  id: string;
  name: string;
  url: string;
}

// Type assertion for exercises data
const exercises = exercisesData as ExerciseData[];

// Group exercises by category
const exercisesByCategory = exercises.reduce((acc, exercise) => {
  if (!acc[exercise.category]) {
    acc[exercise.category] = [];
  }
  acc[exercise.category].push(exercise);
  return acc;
}, {} as Record<string, ExerciseData[]>);

// Create a workout routine from exercises in a category
const createWorkoutRoutine = (category: string): WorkoutRoutine => {
  const categoryExercises = exercisesByCategory[category] || [];
  
  // Create exercise routines from the exercises
  const exerciseRoutines: ExerciseRoutine[] = categoryExercises.map((ex, index) => ({
    id: `ex-${category.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    name: ex.name,
    tag: ex.subcategory,
    difficulty: 'intermediate',
    duration: 30,
    calories: 10,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
    description: ex.name,
    category: ex.category.toLowerCase().replace(/\s+/g, '-'),
    categoryName: ex.category,
    videoUrl: ex.url || '',
    // sets: [
    //   {
    //     id: `s-${ex.id}-1`,
    //     name: 'Set 1',
    //     description: ex.name,
    //     duration: 30,
    //     rest: 10,
    //     videoUrl: ex.url || ''
    //   },
    //   {
    //     id: `s-${ex.id}-2`,
    //     name: 'Set 2',
    //     description: ex.name,
    //     duration: 30,
    //     rest: 10,
    //     videoUrl: ex.url || ''
    //   }
    // ]
  }));

  return {
    id: `wr-${category.toLowerCase().replace(/\s+/g, '-')}`,
    name: category,
    tag: category,
    difficulty: 'intermediate',
    duration: exerciseRoutines.length * 5, // 5 minutes per exercise
    calories: exerciseRoutines.length * 30, // 30 calories per exercise
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
    description: `Workout routine for ${category}`,
    category: category.toLowerCase().replace(/\s+/g, '-'),
    categoryName: category,
    rounds: [
      {
        id: 'r1',
        exercises: exerciseRoutines
      }
    ]
  };
};

// Create workout routines for each category
const workoutRoutines: WorkoutRoutine[] = Object.keys(exercisesByCategory).map(
  category => createWorkoutRoutine(category)
);

// Create a map of workout routines by ID for easy lookup
const workouts: Record<string, WorkoutRoutine> = workoutRoutines.reduce((acc, routine) => {
  acc[routine.id] = routine;
  return acc;
}, {} as Record<string, WorkoutRoutine>);

export const getWorkoutById = (id: string): WorkoutRoutine | undefined => {
  return workouts[id];
};

export const getAllWorkouts = (): WorkoutRoutine[] => {
  return Object.values(workouts);
};

export const mockWorkout = workoutRoutines[0]; // Default export for backward compatibility

export default workoutRoutines;

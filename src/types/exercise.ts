export interface ExerciseSet {
  id: string;
  name: string;
  duration: number; // in seconds
  rest: number; // in seconds
  videoUrl?: string;
  description: string;
  imageUrl?: string;
}

export interface BaseExercise {
  id: string;
  name: string;
  tag?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | string;
  duration?: string;
  calories?: number;
  imageUrl: string;
  description?: string;
  category: string;
  url?: string;
  directLink?: boolean;
  modules?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    videoUrl: string;
  }[];
}

export interface ExerciseRoutine extends BaseExercise {
  // sets: ExerciseSet[];
  rounds?: never;
}

export interface WorkoutRoutine extends BaseExercise {
  rounds: {
    id: string;
    exercises: ExerciseRoutine[];
  }[];
}

export type Exercise = ExerciseRoutine | WorkoutRoutine;

// Type guard to check if an exercise is a WorkoutRoutine
export function isWorkoutRoutine(exercise: Exercise): exercise is WorkoutRoutine {
  return 'rounds' in exercise && Array.isArray((exercise as WorkoutRoutine).rounds);
}


export type Course = BaseExercise;
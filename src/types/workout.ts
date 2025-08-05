export interface WorkoutRoutine {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // in minutes
  exercises: string[]; // array of exercise IDs
  image?: string;
  description?: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  exercises: {
    exerciseId: string;
    completed: boolean;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  workouts: string[]; // array of workout routine IDs
  startDate: Date;
  endDate?: Date;
  active: boolean;
}

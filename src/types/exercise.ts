export interface ExerciseSet {
  id: string;
  name: string;
  duration: number; // in seconds
  rest: number; // in seconds
  videoUrl?: string;
  description: string;
  imageUrl?: string;
}

export interface ExerciseRoutine {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  calories: number;
  imageUrl: string;
  description: string;
  sets: ExerciseSet[];
  category: string;
}

export type Exercise = ExerciseRoutine;

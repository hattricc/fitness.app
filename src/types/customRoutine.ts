export interface CustomRoutineExerciseRef {
    exerciseId: string;
    moduleId: string;
    name: string;
    mediaType: 'image' | 'video';
    imageUrl?: string;
    videoUrl?: string;
    url?: string;
}

export interface CustomRoutine {
    id: string;
    name: string;
    createdAt: number;
    exercises: CustomRoutineExerciseRef[];
}

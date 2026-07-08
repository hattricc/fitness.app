import { Course } from '@/types/course';
import { CustomRoutineExerciseRef } from '@/types/customRoutine';

const PAIR_SEPARATOR = ',';
const ID_SEPARATOR = ':';

export const encodeSelection = (exercises: CustomRoutineExerciseRef[]): string => {
  return exercises.map((ex) => `${ex.moduleId}${ID_SEPARATOR}${ex.exerciseId}`).join(PAIR_SEPARATOR);
};

export const decodeSelection = (param: string, workout: Course): CustomRoutineExerciseRef[] => {
  return param
    .split(PAIR_SEPARATOR)
    .map((pair) => {
      const [moduleId, exerciseId] = pair.split(ID_SEPARATOR);
      const module = workout.modules.find((m) => m.id === moduleId);
      const exercise = module?.exercises.find((e) => e.id === exerciseId);
      if (!module || !exercise) return null;
      return {
        exerciseId: exercise.id,
        moduleId: module.id,
        name: exercise.name,
        mediaType: exercise.mediaType ?? 'video',
        imageUrl: exercise.imageUrl,
        videoUrl: exercise.videoUrl,
        url: exercise.url,
      } satisfies CustomRoutineExerciseRef;
    })
    .filter((ref): ref is CustomRoutineExerciseRef => ref !== null);
};

export const buildShareUrl = (workoutId: string, exercises: CustomRoutineExerciseRef[]): string => {
  const params = new URLSearchParams({ ex: encodeSelection(exercises) });
  return `${window.location.origin}/builder/${workoutId}?${params.toString()}`;
};

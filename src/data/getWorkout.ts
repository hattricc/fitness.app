import { Course } from '@/types/course';

let coursesCache: Course[] | null = null;

// Load all courses from both JSON files
export const loadAllCourses = async (): Promise<Course[]> => {
  if (coursesCache) return coursesCache;

  try {
    const [coursesModule, homeModule] = await Promise.all([
      import('./courses.json'),
      import('./home.json')
    ]);

    // Handle both default and direct imports
    const coursesData = coursesModule.default || coursesModule;
    const homeData = homeModule.default || homeModule;

    // Ensure we have arrays
    const coursesArray = Array.isArray(coursesData) ? coursesData : [];
    const homeArray = Array.isArray(homeData) ? homeData : [];

    // Combine and filter out any undefined/null items
    coursesCache = [...coursesArray, ...homeArray].filter(Boolean) as Course[];

    // Filter out invisible courses and modules, and apply course.locked to exercises
    coursesCache = coursesCache
      .filter(c => c.visible !== false)
      .map(course => ({
        ...course,
        modules: (course.modules || [])
          .filter(module => module.visible !== false)
          .map(module => ({
            ...module,
            exercises: (module.exercises || [])
              .filter(exercise => exercise.visible !== false)
              .map(exercise => ({
                ...exercise,
                locked: exercise.locked !== false ? course.locked === true : false
              }))
          }))
      }));


    return coursesCache;
  } catch (error) {
    console.error('Error loading course data:', error);
    return [];
  }
};

// For backward compatibility
let staticCourses: Course[] = [];
const loadStaticCourses = async () => {
  if (staticCourses.length === 0) {
    staticCourses = await loadAllCourses();
  }
  return staticCourses;
};

// Initialize static courses for immediate use
loadStaticCourses();

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
  return coursesCache?.find((course) => course.id === id);
};

export const getAllWorkouts = (): Course[] => {
  return coursesCache || [];
};

export default coursesCache;

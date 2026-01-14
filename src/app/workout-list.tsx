import React, { useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';
// import WorkoutCard from '../components/organisms/workout/workout-card';
import { WorkoutRoutine } from '../types/exercise';
import WorkoutListHeader from '../components/organisms/workout/workout-list-header';
import { ExerciseCard } from '../components/molecules';
import { Course } from '@/types/course';

interface WorkoutListProps {
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onSelectWorkout: (workout: WorkoutRoutine) => void;
  workouts: Course[];
}

const WorkoutList: React.FC<WorkoutListProps> = ({
  difficulty,
  onDifficultyChange,
  onSelectWorkout,
  workouts,
}) => {
  const filteredWorkouts = useMemo(() => {
    return workouts.filter(
      (workout) => difficulty === 'all' || workout.difficulty === difficulty
    );
  }, [difficulty, workouts]);

  // Group workouts by tag
  const workoutsByTag = useMemo(() => {
    return filteredWorkouts.reduce<Record<string, WorkoutRoutine[]>>((acc, workout) => {
      const tag = workout.tag || 'Sin etiqueta';
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(workout);
      return acc;
    }, {});
  }, [filteredWorkouts]);

  const handleWorkoutClick = (workout: WorkoutRoutine) => {
    onSelectWorkout(workout);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{
      py: 4,
      width: '100%',
      maxWidth: '100%',
      px: 2
    }}>
      <WorkoutListHeader
        difficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
      />

      {filteredWorkouts.length === 0 ? (
        <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
          No hay programas para la categoría seleccionada.
        </Typography>
      ) : (
        <Box>
          {/* <Typography variant="h5" gutterBottom textAlign="center">
            {difficulty === 'all' ? 'Todos los programas' : `Programas de ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`}
          </Typography> */}

          {Object.entries(workoutsByTag).map(([tag, tagWorkouts]) => (
            <Box key={tag} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {tag}
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                {tagWorkouts.map((workout: WorkoutRoutine) => (
                  <ExerciseCard
                    exercise={workout}
                    onClick={handleWorkoutClick}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default WorkoutList;

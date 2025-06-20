import React, { useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';
import DifficultyFilter from '../components/molecules/difficulty-filter';
import WorkoutCard from '../components/molecules/workout-card';
import { WorkoutRoutine } from '../types/exercise';

interface WorkoutListProps {
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onSelectWorkout: (workout: WorkoutRoutine) => void;
  workouts: WorkoutRoutine[];
}

const WorkoutList: React.FC<WorkoutListProps> = ({
  difficulty,
  onDifficultyChange,
  onSelectWorkout,
  workouts,
}) => {
  const filteredWorkouts = useMemo(() => {
    return workouts.filter(
      (workout) => difficulty === 'todo' || workout.difficulty === difficulty
    );
  }, [difficulty, workouts]);

  const handleWorkoutClick = (workout: WorkoutRoutine) => {
    onSelectWorkout(workout);
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 10 }}>
      <Box sx={{ my: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Rutinas
        </Typography>
        <DifficultyFilter
          value={difficulty}
          onChange={onDifficultyChange}
        />
      </Box>

      {filteredWorkouts.length === 0 ? (
        <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
          No hay rutinas para el nivel de dificultad seleccionado.
        </Typography>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            {difficulty === 'todo' ? 'Todas las rutinas' : `Rutinas de ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`}
          </Typography>
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={handleWorkoutClick}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default WorkoutList;

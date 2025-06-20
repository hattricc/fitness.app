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
      (workout) => difficulty === 'all' || workout.difficulty === difficulty
    );
  }, [difficulty, workouts]);

  const handleWorkoutClick = (workout: WorkoutRoutine) => {
    onSelectWorkout(workout);
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 10 }}>
      <Box sx={{ my: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Workouts
        </Typography>
        <DifficultyFilter
          value={difficulty}
          onChange={onDifficultyChange}
        />
      </Box>

      {filteredWorkouts.length === 0 ? (
        <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
          No workouts found for the selected difficulty level.
        </Typography>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            {difficulty === 'all' ? 'All Workouts' : `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Workouts`}
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

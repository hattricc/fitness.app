import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography, Button, IconButton, Chip } from '@mui/material';
import ExerciseCard from '../components/molecules/exercise-card';
import { ExerciseRoutine } from '../types/exercise';
import { getWorkoutById } from '../data/mockWorkout';
import WorkoutHeader from '../components/organisms/workout/workout-header';
import StartWorkoutButton from 'components/atoms/start-workout-button/start-workout-button';

interface WorkoutProps {
  onSelectExercise: (exercise: ExerciseRoutine) => void;
}

const Workout: React.FC<WorkoutProps> = ({ onSelectExercise }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get the workout data based on the ID
  const workout = id ? getWorkoutById(id) : null;

  const handleBack = () => {
    navigate(-1);
  };

  const handleExerciseClick = (exercise: ExerciseRoutine) => {
    onSelectExercise(exercise);
  };

  const handleStartWorkout = () => {
    if (workout?.rounds[0]?.exercises[0]) {
      onSelectExercise(workout.rounds[0].exercises[0]);
    }
  };
  
  if (!workout) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Workout not found</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ 
      pb: 10, 
      pt: 4,
      width: '100%',
      maxWidth: '100%',
      px: 2 
    }}>
      <WorkoutHeader workout={workout} />

      {/* Workout Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        {/* <Typography variant="h5" gutterBottom>{workout.name}</Typography> */}
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {workout.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
          <Chip 
            label={`${workout.duration} min`} 
            color="secondary"
          />
          {/* <Chip 
            label={`${workout.calories} cal`} 
            variant="outlined"
            color="error"
          /> */}
          <Chip 
            label={workout.difficulty}
            color="primary"
          />
        </Box>
      </Box>

      {/* Workout Rounds */}
      <Box sx={{ mb: 4 }}>
        {/* <Typography variant="h6" gutterBottom>
          Workout Plan
        </Typography> */}
        
        {workout.rounds.map((round) => (
          <Box key={round.id} sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium', textAlign: 'center' }}>
              Round {round.id.replace('r', '')}
            </Typography>
            {round.exercises.map((exercise) => (
              <Box 
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise)}
                sx={{ mb: 2, cursor: 'pointer' }}
              >
                <ExerciseCard
                  exercise={exercise}
                  onClick={() => {}}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Start Workout Button */}
      {workout.rounds.length > 0 && workout.rounds[0].exercises.length > 0 && (
        <Box sx={{ position: 'fixed', bottom: 20, left: 0, right: 0, px: 2, zIndex: 1 }}>
          <StartWorkoutButton  onClick={handleStartWorkout} />
        </Box>
      )}
    </Container>
  );
};

export default Workout;

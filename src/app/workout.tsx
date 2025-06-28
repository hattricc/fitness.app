import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography, Button, IconButton, Chip } from '@mui/material';
import { ArrowBack, PlayArrow } from '@mui/icons-material';
import ExerciseCard from '../components/molecules/exercise-card';
import { ExerciseRoutine } from '../types/exercise';
import { getWorkoutById } from '../data/mockWorkout';

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
    <Container maxWidth="sm" sx={{ pb: 10, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {workout.name}
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacer for alignment */}
      </Box>

      {/* Workout Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        {/* <Typography variant="h5" gutterBottom>{workout.name}</Typography> */}
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {workout.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
          <Chip 
            label={`${workout.duration} min`} 
            variant="outlined"
          />
          {/* <Chip 
            label={`${workout.calories} cal`} 
            variant="outlined"
            color="error"
          /> */}
          <Chip 
            label={workout.difficulty}
            variant="outlined"
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
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
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
        <Box sx={{ position: 'fixed', bottom: 70, left: 0, right: 0, px: 2, zIndex: 1 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<PlayArrow />}
            onClick={handleStartWorkout}
            sx={{
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            Comenzar rutina
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Workout;

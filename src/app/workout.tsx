import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { ExerciseVideo } from '../components/molecules';
import { ExerciseRoutine } from '../types/exercise';
import { getWorkoutById } from '../data/mockWorkout';
import WorkoutHeader from '../components/organisms/workout/workout-header';

interface WorkoutProps {
  onSelectExercise: (exercise: ExerciseRoutine) => void;
}

const Workout: React.FC<WorkoutProps> = ({ onSelectExercise }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get the workout data based on the ID
  const workout = id ? getWorkoutById(id) : null;

  // const handleBack = () => {
  //   navigate(-1);
  // };


  // const handleStartWorkout = () => {
  //   if (workout?.rounds[0]?.exercises[0]) {
  //     onSelectExercise(workout.rounds[0].exercises[0]);
  //   }
  // };
  
  if (!workout) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Workout not found</Typography>
        {/* <Button onClick={handleBack} sx={{ mt: 2 }}>Go Back</Button> */}
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
      {/* Workout Header */}
      <WorkoutHeader workout={workout} />

      {/* Workout Rounds */}
      <Box sx={{ mb: 4 }}>

        {workout.rounds.map((round) => (
          <Box key={round.id} sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
              Round {round.id.replace('r', '')}
            </Typography>
            {round.exercises.map((exercise) => (
              <Box
                key={exercise.id}
                sx={{ mb: 2, cursor: 'pointer' }}
              >
                <ExerciseVideo
                  exercise={exercise}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* {workout.rounds.length > 0 && workout.rounds[0].exercises.length > 0 && (
        <Box sx={{ position: 'fixed', bottom: 20, left: 0, right: 0, px: 2, zIndex: 1 }}>
          <StartWorkoutButton  onClick={handleStartWorkout} />
        </Box>
      )} */}
    </Container>
  );
};

export default Workout;

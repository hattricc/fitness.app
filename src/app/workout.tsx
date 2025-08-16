import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import ExerciseClass from '../components/organisms/exercise-class';
import { getWorkoutById } from '../data/getWorkout';
import WorkoutHeader from '../components/organisms/workout/workout-header';

interface WorkoutClassProps {
  withPrefix: boolean;
}

const Workout: React.FC<WorkoutClassProps> = ({ withPrefix = false}) => {
  const { id } = useParams<{ id: string }>();
  const workout = id ? getWorkoutById(id) : null;

  if (!workout) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Rutina no encontrada</Typography>
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

      {/* {workout.map((course) => ( */}
      <Box key={workout.id} sx={{ mb: 3 }}>

        {/* TODO DEBO CONVERTIR LOS ROUNDS POR TEMAS PARA PODER HACER ACORDEONES */}
        {workout.modules.map((module, index) => (
          <>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
              {withPrefix && `Módulo ${index + 1}: `}{module.name}
            </Typography>
            <Box
              key={module.id}
              sx={{ mb: 2, cursor: 'pointer' }}
            >
              <ExerciseClass
                exercise={module}
              />
            </Box>
          </>
        ))}
      </Box>
      {/* ))} */}
    </Container>
  );
};

export default Workout;

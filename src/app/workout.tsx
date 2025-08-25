import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import ExerciseClass from '../components/organisms/exercise-class';
import { getWorkoutById } from '../data/getWorkout';
import WorkoutHeader from '../components/organisms/workout/workout-header';

interface WorkoutClassProps {
  withPrefix: boolean;
}

const Workout: React.FC<WorkoutClassProps> = ({ withPrefix = false}) => {
  const { id } = useParams<{ id: string }>();
  const workout = id ? getWorkoutById(id) : null;
  const [expandedModule, setExpandedModule] = useState<string | false>(workout?.modules[0]?.id || false);

  const handleAccordionChange = (moduleId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedModule(isExpanded ? moduleId : false);
  };

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
      width: '100%',
      maxWidth: '100%',
    }}>
      {/* <WorkoutHeader workout={workout} /> */}

      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 2, 
        p: 2, 
        backgroundColor: 'rgba(255, 193, 7, 0.1)', 
        borderRadius: 2,
        border: '1px solid rgba(255, 193, 7, 0.3)',
        color: 'warning.main'
      }}>
        <LockIcon sx={{ color: 'warning.main', fontSize: 20 }} />
        <Typography variant="body2" color="warning.main" fontWeight="medium">
          Sé parte de la suscripción básica para ver todas las clases.
        </Typography>
      </Box>

      <Box key={workout.id} sx={{ mb: 3 }}>

        {workout.modules.map((module, index) => (
          <Accordion
            key={module.id}
            expanded={expandedModule === module.id}
            onChange={handleAccordionChange(module.id)}
            sx={{
              mb: 2,
              '&:before': {
                display: 'none',
              },
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: 2,
              py: 2,
              px: 1
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  margin: 0,
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: '700', fontSize: '2rem' }}>
                {withPrefix && `Módulo ${index + 1}: `}{module.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <ExerciseClass 
                module={module} 
                isLocked={true}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      {/* ))} */}
    </Container>
  );
};

export default Workout;

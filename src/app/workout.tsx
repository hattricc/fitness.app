import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, InfoOutline } from '@mui/icons-material';
import ExerciseClass from '../components/organisms/exercise-class';
import { getWorkoutById } from '../data/getWorkout';
import ReactMarkdown from 'react-markdown';

interface WorkoutClassProps {
  withPrefix: boolean;
  setOpenModal?: (open: boolean) => void;
}

const Workout: React.FC<WorkoutClassProps> = ({ withPrefix = false, setOpenModal }) => {
  const { id } = useParams<{ id: string }>();
  const workout = id ? getWorkoutById(id) : null;
  const [expandedModule, setExpandedModule] = useState<string | false>(false);

  const handleAccordionChange = (moduleId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedModule(isExpanded ? moduleId : false);

    if (workout?.locked) {
      setOpenModal?.(true);
      return;
    }
  };

  const boxLockInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2,
    p: 2,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    border: '1px solid rgba(255, 193, 7, 0.3)',
    // backgroundColor: 'rgba(2, 136, 209, 0.1)',
    // border: '1px solid rgba(2, 136, 209, 0.3)',
    borderRadius: 2,
    color: 'warning.main'
  }
  const accordionStyles = {
    mb: 2,
    '&:before': {
      display: 'none',
    },
    backgroundColor: '#ffffff',
    borderRadius: 2,
    boxShadow: 2,
    py: 2,
    px: 0
  }

  if (!workout) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Rutina no encontrada</Typography>
      </Container>
    );
  }
  return (
    <>
      <Container maxWidth={false} disableGutters sx={{
        pb: 10,
        width: '100%',
        maxWidth: '100%',
      }}>
        {workout.showTitle && workout.title != "" && (
          <Typography variant="h5" sx={{ fontWeight: '700', fontSize: '2rem' }}>
            {workout.title}
          </Typography>
        )}

        {/* <WorkoutHeader workout={workout} /> */}

        {/* <Box sx={boxLockInfoStyles}>
        <LockIcon sx={{ color: 'warning.main', fontSize: 20 }} />
        <Typography variant="body2" color="warning.main" fontWeight="medium">
          Sé parte de la suscripción básica para ver todas las clases.
        </Typography>
      </Box> */}
        {workout.showInfo && (
          <Box sx={boxLockInfoStyles}>
            <InfoOutline sx={{ color: 'warning.main', fontSize: 20 }} />
            <Typography variant="body2" color="warning.main" fontWeight="medium">
              Más cursos próximamente.
            </Typography>
          </Box>
        )}

        <Box key={workout.id} sx={{ mb: 3 }}>

          {workout.modules.map((module, index) => (
            <Accordion
              key={module.id}
              expanded={expandedModule === module.id}
              onChange={handleAccordionChange(module.id)}
              sx={accordionStyles}
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
                <Typography component="div" variant="body1" sx={{ fontSize: '1.25rem', color: '#000000', whiteSpace: 'pre-wrap' }}>
                  <ReactMarkdown>{(typeof module.note === 'string' ? module.note.replace(/\\n/g, '\n') : '')}</ReactMarkdown>
                </Typography>

                <ExerciseClass module={module} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default Workout;

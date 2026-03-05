import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import { ExpandMore, InfoOutline } from '@mui/icons-material';
import ExerciseClass from '../../components/organisms/exercise-class';
import { getWorkoutById } from '../../data/getWorkout';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Exercise } from '@/types/exercise';

interface WorkoutClassProps {
  withPrefix?: boolean;
  setOpenModal?: (open: boolean) => void;
  onSelectExercise?: (exercise: Exercise) => void;
}

const CoursePage: React.FC<WorkoutClassProps> = ({ withPrefix = false, setOpenModal, onSelectExercise }) => {
  const { id } = useParams<{ id: string }>();
  const workout = id ? getWorkoutById(id) : null;
  const [expandedModule, setExpandedModule] = useState<string | false>(false);

  const { subscription, subscriptionLoading } = useAuth();

  const handleAccordionChange = (moduleId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {

    setExpandedModule(isExpanded ? moduleId : false);

    if (subscriptionLoading) return;
    // if (!subscription) return;       // evita abrir modal por “unknown”

    // Find the module being expanded
    const currentModule = workout?.modules.find(module => module.id === moduleId);

    // Check if the module has at least one unlocked exercise
    const hasUnlockedExercises = currentModule?.exercises.some(exercise => exercise.locked === false);

    // Only block access if user doesn't have subscription AND course is locked AND no exercises are unlocked
    if (!subscription?.hasAccess && workout?.locked && !hasUnlockedExercises && isExpanded) {
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
    backgroundColor: 'rgba(25, 118, 210, 0.1)', // blue background
    border: '1px solid rgba(25, 118, 210, 0.3)', // blue border
    borderRadius: 2,
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

      {subscriptionLoading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <CircularProgress size={18} />
          <Typography variant="body2">Verificando tu suscripción…</Typography>
        </Box>
      )}

      {!subscriptionLoading && (
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

          {workout.showInfo && (
            <Box sx={boxLockInfoStyles}>
              <InfoOutline sx={{ color: 'info.main', fontSize: 20 }} />
              <Typography variant="body2" color="info.main" fontWeight="medium">
                {workout.infoDescription}
              </Typography>
            </Box>
          )}

          <Box key={workout.id} sx={{ mb: 3, pb: 20 }}>

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
      )}
    </>
  );
};

export default CoursePage;

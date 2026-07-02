import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button, List, ListItem, ListItemText, IconButton, CircularProgress } from '@mui/material';
import { ExpandMore, Delete } from '@mui/icons-material';
import RoutineBuilderClass from '../../components/organisms/routine-builder-class';
import { getWorkoutById } from '../../data/getWorkout';
import { Exercise, Module } from '@/types/course';
import { CustomRoutineExerciseRef } from '@/types/customRoutine';
import { useCustomRoutines } from '@/hooks/useCustomRoutines';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface RoutineBuilderPageProps {
  setOpenModal?: (open: boolean) => void;
}

const RoutineBuilderPage: React.FC<RoutineBuilderPageProps> = ({ setOpenModal }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workout = id ? getWorkoutById(id) : null;
  const { subscription, subscriptionLoading } = useAuth();
  const [selected, setSelected] = useState<Map<string, CustomRoutineExerciseRef>>(new Map());
  const { routines, deleteRoutine } = useCustomRoutines();

  useEffect(() => {
    if (subscriptionLoading) return;
    if (workout?.locked && !subscription?.hasAccess) {
      setOpenModal?.(true);
      navigate(-1);
    }
  }, [subscriptionLoading, workout?.locked, subscription?.hasAccess]);

  const toggleExercise = (exercise: Exercise, module: Module) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(exercise.id)) {
        next.delete(exercise.id);
      } else {
        next.set(exercise.id, {
          exerciseId: exercise.id,
          moduleId: module.id,
          name: exercise.name,
          mediaType: exercise.mediaType ?? 'video',
          imageUrl: exercise.imageUrl,
          videoUrl: exercise.videoUrl,
          url: exercise.url,
        });
      }
      return next;
    });
  };

  const startStory = (exercises: CustomRoutineExerciseRef[]) => {
    navigate(`/story/${id}`, { state: { exercises } });
  };

  if (subscriptionLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={18} />
        <Typography variant="body2">Verificando tu suscripción…</Typography>
      </Container>
    );
  }

  if (!workout) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Rutina no encontrada</Typography>
      </Container>
    );
  }

  const selectedList = Array.from(selected.values());

  return (
    <Container maxWidth={false} disableGutters sx={{ pb: 14, width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '2rem', mb: 2 }}>
        {workout.title}
      </Typography>

      {workout.modules.map((module) => (
        <Accordion
          key={module.id}
          sx={{
            mb: 2,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: 2,
            py: 2,
            px: 0,
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#1B1B1B' }} />}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B1B1B' }}>{module.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RoutineBuilderClass
              module={module}
              selectedIds={new Set(selected.keys())}
              onToggle={toggleExercise}
            />
          </AccordionDetails>
        </Accordion>
      ))}

      {routines.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Rutinas guardadas</Typography>
          <List>
            {routines.map((r) => (
              <ListItem
                key={r.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteRoutine(r.id)}>
                    <Delete />
                  </IconButton>
                }
                onClick={() => startStory(r.exercises)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText primary={r.name} secondary={`${r.exercises.length} ejercicios`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: '#1B1B1B', boxShadow: 4 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={selectedList.length === 0}
          onClick={() => startStory(selectedList)}
          sx={{ bgcolor: '#E57952', color: '#fff', '&:hover': { bgcolor: '#CC6A48' }, '&.Mui-disabled': { bgcolor: '#333', color: 'rgba(255,255,255,0.3)' } }}
        >
          Comenzar ({selectedList.length} seleccionados)
        </Button>
      </Box>
    </Container>
  );
};

export default RoutineBuilderPage;
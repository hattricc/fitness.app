import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button, List, ListItem, ListItemText, IconButton, CircularProgress, Stack, TextField } from '@mui/material';
import { ExpandMore, Delete, PlayArrow, Save, Share } from '@mui/icons-material';
import RoutineBuilderClass from '../../components/organisms/routine-builder-class';
import { getWorkoutById } from '../../data/getWorkout';
import { Exercise, Module } from '@/types/course';
import { CustomRoutineExerciseRef } from '@/types/customRoutine';
import { useCustomRoutines } from '@/hooks/useCustomRoutines';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { decodeSelection, buildShareUrl } from '@/utils/routineShareLink';

interface RoutineBuilderPageProps {
  setOpenModal?: (open: boolean) => void;
}

const RoutineBuilderPage: React.FC<RoutineBuilderPageProps> = ({ setOpenModal }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workout = id ? getWorkoutById(id) : null;
  const { subscription, subscriptionLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [initialSelection] = useState<CustomRoutineExerciseRef[]>(() => {
    const exParam = searchParams.get('ex');
    if (!exParam || !workout) return [];
    return decodeSelection(exParam, workout);
  });
  const [selected, setSelected] = useState<Map<string, CustomRoutineExerciseRef>>(
    () => new Map(initialSelection.map((ex) => [ex.exerciseId, ex]))
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(initialSelection.map((ex) => ex.moduleId))
  );
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const { routines, saveRoutine, deleteRoutine } = useCustomRoutines();

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

  const handleSaveConfirm = () => {
    const name = routineName.trim();
    if (!name) return;
    const result = saveRoutine(name, selectedList);
    if (result.ok) {
      setShowSaveInput(false);
      setRoutineName('');
    } else {
      alert('Máximo 3 rutinas guardadas. Elimina una desde el módulo para continuar.');
    }
  };

  const handleShare = async () => {
    if (!id) return;
    const url = buildShareUrl(id, selectedList);
    if (navigator.share) {
      try {
        await navigator.share({ title: workout.title, url });
      } catch {
        return;
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copiado al portapapeles');
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ pb: 14, width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '2rem', mb: 2 }}>
        {workout.title}
      </Typography>

      {workout.modules.map((module) => (
        <Accordion
          key={module.id}
          expanded={expandedModules.has(module.id)}
          onChange={(_, isExpanded) => {
            setExpandedModules((prev) => {
              const next = new Set(prev);
              if (isExpanded) {
                next.add(module.id);
              } else {
                next.delete(module.id);
              }
              return next;
            });
          }}
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
          <Typography variant="h6" sx={{ mb: 1, color: '#1B1B1B' }}>Rutinas guardadas</Typography>
          <List sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2, py: 0 }}>
            {routines.map((r) => (
              <ListItem
                key={r.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteRoutine(r.id)} sx={{ color: '#1B1B1B' }}>
                    <Delete />
                  </IconButton>
                }
                onClick={() => startStory(r.exercises)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText
                  primary={`${r.name} - ${r.exercises.length} ejercicios`}
                  slotProps={{ primary: { sx: { color: '#1B1B1B' } } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: '#1B1B1B', boxShadow: 4 }}>
        {/* Guardar inline — oculto temporalmente
        {showSaveInput && (
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Nombre de la rutina"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              sx={{
                flex: 1,
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#333',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSaveConfirm}
              sx={{ bgcolor: '#E57952', color: '#fff', '&:hover': { bgcolor: '#CC6A48' } }}
            >
              Guardar
            </Button>
          </Stack>
        )}
        */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            disabled={selectedList.length === 0}
            onClick={() => startStory(selectedList)}
            startIcon={<PlayArrow />}
            sx={{ flex: 1, bgcolor: '#E57952', color: '#fff', '&:hover': { bgcolor: '#CC6A48' }, '&.Mui-disabled': { bgcolor: '#333', color: 'rgba(255,255,255,0.3)' } }}
          >
            Comenzar ({selectedList.length} seleccionados)
          </Button>
          {/* Guardar / Compartir — ocultos temporalmente
          <IconButton
            disabled={selectedList.length === 0}
            onClick={() => setShowSaveInput((s) => !s)}
            sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
          >
            <Save />
          </IconButton>
          <IconButton
            disabled={selectedList.length === 0}
            onClick={handleShare}
            sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
          >
            <Share />
          </IconButton>
          */}
        </Stack>
      </Box>
    </Container>
  );
};

export default RoutineBuilderPage;
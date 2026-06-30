import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, IconButton, LinearProgress, TextField, Button, Stack } from '@mui/material';
import { PlayArrow, Pause, SkipNext, SkipPrevious, Close, Save } from '@mui/icons-material';
import { CustomRoutineExerciseRef } from '@/types/customRoutine';
import { useCustomRoutines } from '@/hooks/useCustomRoutines';

const StoryViewerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const exercises = (location.state as { exercises?: CustomRoutineExerciseRef[] } | null)?.exercises;

    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showSave, setShowSave] = useState(false);
    const [routineName, setRoutineName] = useState('');
    const { saveRoutine } = useCustomRoutines();

    useEffect(() => {
        if (!exercises || exercises.length === 0) {
            navigate(`/builder/${id}`, { replace: true });
        }
    }, [exercises, id, navigate]);

    const current = exercises?.[index];

    if (!exercises || exercises.length === 0 || !current) return null;

    const goNext = () => setIndex((i) => Math.min(i + 1, exercises.length - 1));
    const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

    const handleSave = () => {
        const name = routineName.trim();
        if (!name) return;
        const result = saveRoutine(name, exercises);
        if (result.ok) {
            setShowSave(false);
            setRoutineName('');
        } else {
            alert('Máximo 3 rutinas guardadas. Elimina una desde el módulo para continuar.');
        }
    };

    return (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#000', zIndex: 1300, display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1} sx={{ p: 1 }}>
                {exercises.map((_, i) => (
                    <LinearProgress
                        key={i}
                        variant="determinate"
                        value={i < index ? 100 : i === index ? 100 : 0}
                        sx={{ flex: 1, height: 3, borderRadius: 2 }}
                    />
                ))}
            </Stack>

            <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}>
                <Close />
            </IconButton>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {current.mediaType === 'image' && current.imageUrl && (
                    <Box component="img" src={current.imageUrl} alt={current.name} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                )}
                {current.mediaType === 'video' && (current.videoUrl || current.url) && (
                    <Box component="video" src={current.videoUrl || current.url} autoPlay={isPlaying} controls={false} sx={{ maxWidth: '100%', maxHeight: '100%' }} />
                )}
            </Box>

            <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} sx={{ p: 2 }}>
                <IconButton onClick={goPrev} disabled={index === 0} sx={{ color: '#fff' }}>
                    <SkipPrevious fontSize="large" />
                </IconButton>
                {current.mediaType === 'video' && (
                    <IconButton onClick={() => setIsPlaying((p) => !p)} sx={{ color: '#fff' }}>
                        {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                    </IconButton>
                )}
                <IconButton onClick={goNext} disabled={index === exercises.length - 1} sx={{ color: '#fff' }}>
                    <SkipNext fontSize="large" />
                </IconButton>
                <IconButton onClick={() => setShowSave((s) => !s)} sx={{ color: '#fff' }}>
                    <Save fontSize="large" />
                </IconButton>
            </Stack>

            {showSave && (
                <Stack direction="row" spacing={1} sx={{ p: 2, bgcolor: '#111' }}>
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
                    <Button variant="contained" onClick={handleSave}>Guardar</Button>
                </Stack>
            )}
        </Box>
    );
};

export default StoryViewerPage;

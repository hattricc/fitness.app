import React from 'react';
import { Box, Typography, IconButton, Stack, Paper } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { ExerciseRoutine } from '../../../types/exercise';

interface ExerciseItemProps {
  exercise: ExerciseRoutine;
  onPlay: (exercise: ExerciseRoutine) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onPlay }) => {
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      onClick={() => onPlay(exercise)}
    >
      <IconButton 
        color="primary" 
        sx={{ 
          backgroundColor: 'primary.light',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white',
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPlay(exercise);
        }}
      >
        <PlayArrow />
      </IconButton>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          {exercise.name}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {exercise.duration} seg
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {exercise.sets?.length || 3} sets
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ExerciseItem;

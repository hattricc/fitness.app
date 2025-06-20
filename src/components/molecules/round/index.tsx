import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ExerciseItem from '../exercise-item';
import { ExerciseRoutine } from '../../../types/exercise';

interface RoundProps {
  roundNumber: number;
  exercises: ExerciseRoutine[];
  onExercisePlay: (exercise: ExerciseRoutine) => void;
}

const Round: React.FC<RoundProps> = ({ roundNumber, exercises, onExercisePlay }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            flexShrink: 0,
          }}
        >
          {roundNumber}
        </Box>
        <Typography variant="h6" fontWeight="medium">
          Round {roundNumber}
        </Typography>
      </Box>
      
      <Box sx={{ pl: 6 }}>
        {exercises.map((exercise, index) => (
          <React.Fragment key={exercise.id}>
            <ExerciseItem 
              exercise={exercise} 
              onPlay={onExercisePlay} 
            />
            {index < exercises.length - 1 && (
              <Divider sx={{ my: 1, ml: 6, opacity: 0.5 }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default Round;

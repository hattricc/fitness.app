import React from 'react';
import { Box, Typography, Card, Checkbox } from '@mui/material';
import { Exercise } from '@/types/course';
import { CardStylesSquared, TextContainerStyles, ExerciseNameStyles } from '../exercise-item/styles';

interface RoutineBuilderItemProps {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: (exercise: Exercise) => void;
}

const RoutineBuilderItem: React.FC<RoutineBuilderItemProps> = ({ exercise, isSelected, onToggle }) => {
  return (
    <Card
      onClick={() => onToggle(exercise)}
      sx={{ ...CardStylesSquared, position: 'relative', cursor: 'pointer' }}
    >
      {exercise.imageUrl && (
        <Box
          component="img"
          src={exercise.imageUrl}
          alt={exercise.name}
          sx={{ width: 60, height: 60, borderRadius: 3, objectFit: 'cover' }}
        />
      )}

      <Box sx={TextContainerStyles}>
        <Typography variant="subtitle1" component="h3" fontWeight="bold" sx={ExerciseNameStyles}>
          {exercise.name}
        </Typography>
      </Box>

      <Box sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(exercise)}
          onClick={(e) => e.stopPropagation()}
          sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: 'primary.main' } }}
        />
      </Box>
    </Card>
  );
};

export default RoutineBuilderItem;
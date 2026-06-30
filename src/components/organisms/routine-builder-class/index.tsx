import React from 'react';
import { Box } from '@mui/material';
import RoutineBuilderItem from '../../molecules/routine-builder-item';
import { Exercise, Module } from '@/types/course';

interface RoutineBuilderClassProps {
  module: Module;
  selectedIds: Set<string>;
  onToggle: (exercise: Exercise, module: Module) => void;
}

const RoutineBuilderClass: React.FC<RoutineBuilderClassProps> = ({ module, selectedIds, onToggle }) => {
  return (
    <>
      {module.exercises.map((exercise) => (
        <Box key={exercise.id} sx={{ mb: 1 }}>
          <RoutineBuilderItem
            exercise={exercise}
            isSelected={selectedIds.has(exercise.id)}
            onToggle={(ex) => onToggle(ex, module)}
          />
        </Box>
      ))}
    </>
  );
};

export default RoutineBuilderClass;
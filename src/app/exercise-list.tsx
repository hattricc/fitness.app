import React, { useState, useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';
import DifficultyFilter from '../components/molecules/filter';
import ExerciseCard from '../components/molecules/card';
import { Exercise } from '../types/exercise';

// Mock data - in a real app, this would come from an API
const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Morning Stretch',
    difficulty: 'beginner',
    duration: 15,
    calories: 120,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
    description: 'Gentle stretches to start your day right',
    category: 'Stretching',
    sets: [
      { id: 's1', name: 'Neck Stretch', duration: 30, rest: 10, description: 'Gently tilt your head side to side' },
      { id: 's2', name: 'Shoulder Rolls', duration: 30, rest: 10, description: 'Roll shoulders forward and backward' },
    ],
  },
  {
    id: '2',
    name: 'Full Body Workout',
    difficulty: 'intermediate',
    duration: 30,
    calories: 300,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
    description: 'Complete full body workout for all fitness levels',
    category: 'Full Body',
    sets: [
      { id: 's1', name: 'Jumping Jacks', duration: 45, rest: 15, description: 'Jump while spreading arms and legs' },
      { id: 's2', name: 'Push-ups', duration: 45, rest: 15, description: 'Keep your body straight while lowering and raising' },
    ],
  },
  {
    id: '3',
    name: 'HIIT Challenge',
    difficulty: 'advanced',
    duration: 20,
    calories: 400,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
    description: 'High intensity interval training for maximum results',
    category: 'HIIT',
    sets: [
      { id: 's1', name: 'Burpees', duration: 30, rest: 10, description: 'Full body explosive exercise' },
      { id: 's2', name: 'Mountain Climbers', duration: 30, rest: 10, description: 'Keep core tight while bringing knees to chest' },
    ],
  },
];

interface ExerciseListProps {
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  difficulty,
  onDifficultyChange,
  onSelectExercise,
}) => {
  const filteredExercises = useMemo(() => {
    return mockExercises.filter(
      (exercise) => difficulty === 'all' || exercise.difficulty === difficulty
    );
  }, [difficulty]);

  const handleExerciseClick = (exercise: Exercise) => {
    onSelectExercise(exercise);
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 10 }}>
      <Box sx={{ my: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Workouts
        </Typography>
        <DifficultyFilter
          value={difficulty}
          onChange={onDifficultyChange}
        />
      </Box>

      {filteredExercises.length === 0 ? (
        <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
          No workouts found for the selected difficulty level.
        </Typography>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            {difficulty === 'all' ? 'All Workouts' : `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Workouts`}
          </Typography>
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={handleExerciseClick}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ExerciseList;

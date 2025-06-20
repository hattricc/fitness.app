import React, { useState, useMemo } from 'react';
import { Box, Container, Typography } from '@mui/material';
import DifficultyFilter from '../components/molecules/filter';
import WorkoutCard from '../components/molecules/workout-card';
import { WorkoutRoutine } from '../types/exercise';

// Mock data - in a real app, this would come from an API
const mockWorkouts: WorkoutRoutine[] = [
  {
    id: '1',
    name: 'Morning Stretch',
    difficulty: 'beginner',
    duration: 15,
    calories: 120,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
    description: 'Gentle stretches to start your day right',
    category: 'Stretching',
    rounds: [
      {
        id: 'r1',
        exercises: [
          { 
            id: 'e1', 
            name: 'Neck Stretch', 
            duration: 30, 
            calories: 10, 
            difficulty: 'beginner', 
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop', 
            description: 'Gently tilt your head side to side', 
            category: 'Stretching', 
            sets: [] 
          },
          { 
            id: 'e2', 
            name: 'Shoulder Rolls', 
            duration: 30, 
            calories: 10, 
            difficulty: 'beginner', 
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop', 
            description: 'Roll shoulders forward and backward', 
            category: 'Stretching', 
            sets: [] 
          },
        ]
      }
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
    rounds: [
      {
        id: 'r2',
        exercises: [
          { 
            id: 'e3',
            name: 'Jumping Jacks',
            duration: 45,
            calories: 15,
            difficulty: 'intermediate',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Jump while spreading arms and legs',
            category: 'Cardio',
            sets: []
          },
          { 
            id: 'e4',
            name: 'Push-ups',
            duration: 45,
            calories: 15,
            difficulty: 'intermediate',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Keep your body straight while lowering and raising',
            category: 'Strength',
            sets: []
          }
        ]
      }
    ]
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
    rounds: [
      {
        id: 'r3',
        exercises: [
          { 
            id: 'e5',
            name: 'Burpees',
            duration: 30,
            calories: 20,
            difficulty: 'advanced',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Full body explosive exercise',
            category: 'HIIT',
            sets: []
          },
          { 
            id: 'e6',
            name: 'Mountain Climbers',
            duration: 30,
            calories: 15,
            difficulty: 'intermediate',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
            description: 'Keep core tight while bringing knees to chest',
            category: 'HIIT',
            sets: []
          }
        ]
      }
    ]
  },
];

interface WorkoutListProps {
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onSelectWorkout: (workout: WorkoutRoutine) => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({
  difficulty,
  onDifficultyChange,
  onSelectWorkout,
}) => {
  const filteredWorkouts = useMemo(() => {
    return mockWorkouts.filter(
      (workout) => difficulty === 'all' || workout.difficulty === difficulty
    );
  }, [difficulty]);

  const handleWorkoutClick = (workout: WorkoutRoutine) => {
    onSelectWorkout(workout);
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

      {filteredWorkouts.length === 0 ? (
        <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
          No workouts found for the selected difficulty level.
        </Typography>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            {difficulty === 'all' ? 'All Workouts' : `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Workouts`}
          </Typography>
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={handleWorkoutClick}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default WorkoutList;

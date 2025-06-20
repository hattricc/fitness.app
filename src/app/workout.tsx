import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography, Button, IconButton, Chip } from '@mui/material';
import { ArrowBack, PlayArrow } from '@mui/icons-material';
import ExerciseCard from '../components/molecules/exercise-card';
import { WorkoutRoutine, ExerciseRoutine } from '../types/exercise';

// Mock data - in a real app, this would come from an API
const mockWorkout: WorkoutRoutine = {
  id: '1',
  name: 'Full Body Workout',
  difficulty: 'intermediate',
  duration: 30,
  calories: 300,
  imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
  description: 'Complete full body workout for all fitness levels',
  category: 'Full Body',
  sets: [],
  rounds: [
    {
      id: 'r1',
      exercises: [
        {
          id: 'e1',
          name: 'Jumping Jacks',
          duration: 45,
          calories: 50,
          imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
          description: 'Jump while spreading arms and legs',
          difficulty: 'beginner',
          category: 'Cardio',
          sets: [
            { id: 's1', name: 'Set 1', duration: 45, rest: 15, description: 'Jumping jacks set 1' },
            { id: 's2', name: 'Set 2', duration: 45, rest: 15, description: 'Jumping jacks set 2' },
          ]
        },
        {
          id: 'e2',
          name: 'Push-ups',
          duration: 45,
          calories: 60,
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
          description: 'Keep your body straight while lowering and raising',
          difficulty: 'intermediate',
          category: 'Strength',
          sets: [
            { id: 's3', name: 'Set 1', duration: 45, rest: 15, description: 'Push-ups set 1' },
            { id: 's4', name: 'Set 2', duration: 45, rest: 15, description: 'Push-ups set 2' },
          ]
        },
        {
          id: 'e3',
          name: 'Squats',
          duration: 45,
          calories: 70,
          imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&auto=format&fit=crop',
          description: 'Keep your back straight and lower your body',
          difficulty: 'beginner',
          category: 'Strength',
          sets: [
            { id: 's5', name: 'Set 1', duration: 45, rest: 15, description: 'Squats set 1' },
            { id: 's6', name: 'Set 2', duration: 45, rest: 15, description: 'Squats set 2' },
          ]
        }
      ]
    },
    {
      id: 'r2',
      exercises: [
        {
          id: 'e4',
          name: 'Lunges',
          duration: 45,
          calories: 65,
          imageUrl: 'https://images.unsplash.com/photo-1594386454691-946486faf55e?w=800&auto=format&fit=crop',
          description: 'Step forward and lower your body',
          difficulty: 'intermediate',
          category: 'Strength',
          sets: [
            { id: 's7', name: 'Set 1', duration: 45, rest: 15, description: 'Lunges set 1' },
            { id: 's8', name: 'Set 2', duration: 45, rest: 15, description: 'Lunges set 2' },
          ]
        },
        {
          id: 'e5',
          name: 'Plank',
          duration: 60,
          calories: 40,
          imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
          description: 'Hold a push-up position with your body straight',
          difficulty: 'intermediate',
          category: 'Core',
          sets: [
            { id: 's9', name: 'Set 1', duration: 60, rest: 15, description: 'Plank set 1' },
            { id: 's10', name: 'Set 2', duration: 60, rest: 15, description: 'Plank set 2' },
          ]
        },
        {
          id: 'e6',
          name: 'Bicycle Crunches',
          duration: 45,
          calories: 55,
          imageUrl: 'https://images.unsplash.com/photo-1596357395217-80de13130e02?w=800&auto=format&fit=crop',
          description: 'Alternate touching your elbows to the opposite knees',
          difficulty: 'intermediate',
          category: 'Core',
          sets: [
            { id: 's11', name: 'Set 1', duration: 45, rest: 15, description: 'Bicycle crunches set 1' },
            { id: 's12', name: 'Set 2', duration: 45, rest: 15, description: 'Bicycle crunches set 2' },
          ]
        }
      ]
    },
    {
      id: 'r3',
      exercises: [
        {
          id: 'e7',
          name: 'Burpees',
          duration: 30,
          calories: 80,
          imageUrl: 'https://images.unsplash.com/photo-1571019131783-5a2486a18f9e?w=800&auto=format&fit=crop',
          description: 'Full body exercise combining a squat, push-up, and jump',
          difficulty: 'advanced',
          category: 'HIIT',
          sets: [
            { id: 's13', name: 'Set 1', duration: 30, rest: 15, description: 'Burpees set 1' },
            { id: 's14', name: 'Set 2', duration: 30, rest: 15, description: 'Burpees set 2' },
          ]
        },
        {
          id: 'e8',
          name: 'Mountain Climbers',
          duration: 45,
          calories: 65,
          imageUrl: 'https://images.unsplash.com/photo-1594386454691-946486faf55e?w=800&auto=format&fit=crop',
          description: 'Bring your knees to your chest while in a plank position',
          difficulty: 'intermediate',
          category: 'Cardio',
          sets: [
            { id: 's15', name: 'Set 1', duration: 45, rest: 15, description: 'Mountain climbers set 1' },
            { id: 's16', name: 'Set 2', duration: 45, rest: 15, description: 'Mountain climbers set 2' },
          ]
        },
        {
          id: 'e9',
          name: 'High Knees',
          duration: 40,
          calories: 50,
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
          description: 'Run in place with high knees',
          difficulty: 'beginner',
          category: 'Cardio',
          sets: [
            { id: 's17', name: 'Set 1', duration: 40, rest: 15, description: 'High knees set 1' },
            { id: 's18', name: 'Set 2', duration: 40, rest: 15, description: 'High knees set 2' },
          ]
        }
      ]
    }
  ]
};

// Function to get workout by ID - in a real app, this would be an API call
const getWorkoutById = (id: string): WorkoutRoutine | undefined => {
  // For now, we only have one mock workout, so we'll return it if the ID matches
  return id === mockWorkout.id ? mockWorkout : undefined;
};

interface WorkoutProps {
  onSelectExercise: (exercise: ExerciseRoutine) => void;
}

const Workout: React.FC<WorkoutProps> = ({ onSelectExercise }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get the workout data based on the ID
  const workout = id ? getWorkoutById(id) : null;

  const handleBack = () => {
    navigate(-1);
  };

  const handleExerciseClick = (exercise: ExerciseRoutine) => {
    onSelectExercise(exercise);
  };

  const handleStartWorkout = () => {
    // Navigate to the first exercise in the first round
    if (workout?.rounds[0]?.exercises[0]) {
      onSelectExercise(workout.rounds[0].exercises[0]);
    }
  };
  
  if (!workout) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Workout not found</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pb: 10, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {workout.name}
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacer for alignment */}
      </Box>

      {/* Workout Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>{workout.name}</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {workout.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
          <Chip 
            label={`${workout.duration} min`} 
            variant="outlined"
          />
          <Chip 
            label={`${workout.calories} cal`} 
            variant="outlined"
            color="error"
          />
          <Chip 
            label={workout.difficulty}
            variant="outlined"
            color="primary"
          />
        </Box>
      </Box>

      {/* Workout Rounds */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Workout Plan
        </Typography>
        
        {workout.rounds.map((round) => (
          <Box key={round.id} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
              Round {round.id.replace('r', '')}
            </Typography>
            {round.exercises.map((exercise) => (
              <Box 
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise)}
                sx={{ mb: 2, cursor: 'pointer' }}
              >
                <ExerciseCard
                  exercise={exercise}
                  onClick={() => {}}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Start Workout Button */}
      {workout.rounds.length > 0 && workout.rounds[0].exercises.length > 0 && (
        <Box sx={{ position: 'fixed', bottom: 70, left: 0, right: 0, px: 2, zIndex: 1 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<PlayArrow />}
            onClick={handleStartWorkout}
            sx={{
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            Comenzar rutina
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Workout;

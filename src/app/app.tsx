import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Header from '../components/organisms/header';
import Footer from '../components/organisms/footer';
import WorkoutList from './workout-list';
import Workout from './workout';
import ExerciseDetail from './exercise-detail';
import { Exercise, WorkoutRoutine } from '../types/exercise';
import mockWorkouts from '../data/mockWorkouts.json';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [workouts] = useState<WorkoutRoutine[]>(mockWorkouts);

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    navigate(`/exercise/${exercise.id}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 2, 
          pb: 8,
          pt: { xs: 9, sm: 10 } // Add padding top to account for fixed header
        }}>
          <Routes>
            <Route
              path="/"
              element={
                <WorkoutList
                  difficulty={difficulty}
                  onDifficultyChange={setDifficulty}
                  onSelectWorkout={(workout) => {
                    navigate(`/workout/${workout.id}`);
                  }}
                  workouts={workouts}
                />
              }
            />
            <Route
              path="/workout/:id"
              element={
                <Workout onSelectExercise={handleExerciseSelect} />
              }
            />
            <Route
              path="/exercise/:id"
              element={
                <ExerciseDetail 
                  exercise={selectedExercise} 
                  onBack={() => navigate(-1)} 
                />
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;

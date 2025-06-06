import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Header from '../components/organisms/header';
import Footer from '../components/organisms/footer';
import ExerciseList from './exercise-list';
import ExerciseDetail from './exercise-detail';
import { Exercise } from '../types/exercise';

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
  const [difficulty, setDifficulty] = useState<string>('beginner');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 2, pb: 8 }}>
          <Routes>
            <Route
              path="/"
              element={
                <ExerciseList
                  difficulty={difficulty}
                  onDifficultyChange={setDifficulty}
                  onSelectExercise={setSelectedExercise}
                />
              }
            />
            <Route
              path="/exercise/:id"
              element={
                <ExerciseDetail
                  exercise={selectedExercise}
                  onBack={() => window.history.back()}
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

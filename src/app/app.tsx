import { useState, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import './app.css';
import Header from '../components/organisms/header';
import WorkoutList from './workout-list';
import Workout from './workout';
import ExerciseDetail from './exercise-detail';
import { Exercise, WorkoutRoutine } from '../types/exercise';
import { getAllWorkouts } from '../data/mockWorkout';
import { darkTheme } from '../data/theme';

function App() {
  const [hasIntroEnded, setHasIntroEnded] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [workouts] = useState<WorkoutRoutine[]>(getAllWorkouts());

  const handleVideoEnd = () => {
    setHasIntroEnded(true);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    navigate(`/exercise/${exercise.id}`);
  };

  // Show intro video if it hasn't ended yet
  if (!hasIntroEnded) {
    return <Box className="intro-video-container">
      <video
        ref={videoRef}
        autoPlay
        muted
        onEnded={handleVideoEnd}
        className="video-player"
      >
        {/* Replace with your actual video path */}
        <source src="/videos/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  }

  const routes = [
    {
      path: '/',
      element: (
        <WorkoutList
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onSelectWorkout={(workout) => {
            navigate(`/workout/${workout.id}`);
          }}
          workouts={workouts}
        />
      ),
    },
    {
      path: '/workout/:id',
      element: <Workout onSelectExercise={handleExerciseSelect} />,
    },
    {
      path: '/exercise/:id',
      element: (
        <ExerciseDetail
          exercise={selectedExercise}
          onBack={() => navigate(-1)}
        />
      ),
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box className="app-container">
        <Header />
        <Box component="main" className="main-content">
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Box>
        {/* <Footer /> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;

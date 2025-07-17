import { useState, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import './app.css';
import Header from '../components/organisms/header';
import Home from './home';
import WorkoutList from './workout-list';
import Workout from './workout';
import ExerciseDetail from './exercise-detail';
import Articles from './articles';
import { Exercise, WorkoutRoutine } from '../types/exercise';
import { getAllWorkouts } from '../data/mockWorkout';
import { darkTheme } from '../data/theme';
import SplashScreen from '../components/molecules/splash-screen/SplashScreen';
import LoginForm from '../components/organisms/login';
import SignUpForm from '../components/organisms/signup';
import ResetPasswordForm from '../components/organisms/reset-password';

function App() {
  const [showApp, setShowApp] = useState(false);
  const [hasIntroEnded, setHasIntroEnded] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [workouts] = useState<WorkoutRoutine[]>(getAllWorkouts());

  const handleWorkoutSelect = (workout: WorkoutRoutine) => {
    navigate(`/workout/${workout.id}`);
  };

  const handleSplashAndCarouselComplete = () => {
    setShowApp(true);
  };

  const handleVideoEnd = () => {
    setHasIntroEnded(true);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    navigate(`/exercise/${exercise.id}`);
  };

  // Show splash screen and carousel if app hasn't been shown yet
  if (!showApp) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SplashScreen onAnimationEnd={handleSplashAndCarouselComplete} />
      </ThemeProvider>
    );
  }

  // Show intro video if it hasn't ended yet
  if (!hasIntroEnded) {
    return (
      <Box className="intro-video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          onEnded={handleVideoEnd}
          className="video-player"
        >
          <source src="/videos/intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    );
  }

  const routes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/workouts",
      element: <WorkoutList difficulty={difficulty} onDifficultyChange={setDifficulty} onSelectWorkout={handleWorkoutSelect} workouts={workouts} />,
    },
    {
      path: "/workout/:id",
      element: <Workout onSelectExercise={handleExerciseSelect} />,
    },
    {
      path: "/exercise/:id",
      element: selectedExercise ? (
        <ExerciseDetail exercise={selectedExercise} onBack={() => navigate(-1)} />
      ) : null,
    },
    {
      path: "/login",
      element: <LoginForm theme={darkTheme} />,
    },
    {
      path: "/signup",
      element: <SignUpForm theme={darkTheme} />,
    },
    {
      path: "/reset-password",
      element: <ResetPasswordForm theme={darkTheme} />,
    },
    {
      path: "/articles",
      element: <Articles />,
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

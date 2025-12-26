import { useState, useRef, useCallback } from 'react';
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
import { Exercise, WorkoutRoutine } from '../types/exercise';
import { getAllWorkouts } from '../data/getWorkout';
import { darkTheme } from '../data/theme';
import LoginForm from '../components/organisms/login';
import ResetPasswordForm from '../components/organisms/reset-password';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import CombateSagrado from './pages/combate-sagrado';
import PagoExitosoPage from './pages/PagoExitosoPage';
import { AuthCallback } from '@/components/auth/AuthCallback';
import { setUserSession, UserSession } from '@/lib/userSession'
import SignOut from '@/components/organisms/signout/signout';
import SubscriptionPage from './pages/SubscriptionPage';

import { MakModal } from '@/components/molecules/MakModal/MakModal';


function App() {
  const [hasIntroEnded, setHasIntroEnded] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [workouts] = useState<WorkoutRoutine[]>(getAllWorkouts());
  const [user, setUser] = useState<UserSession | null>(null);

  const [openModal, setOpenModal] = useState(false);
  

  const setSession = useCallback((user: UserSession | null) => {
    setUserSession(user);
    setUser(user);
  }, []);

  const handleWorkoutSelect = (workout: WorkoutRoutine) => {
    navigate(`/workout/${workout.id}`);
  };

  const handleVideoEnd = () => {
    setHasIntroEnded(true);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    navigate(`/exercise/${exercise.id}`);
  };

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
      element: <Workout setOpenModal={setOpenModal} onSelectExercise={handleExerciseSelect} />,
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
      // element: <SignUpForm theme={darkTheme} />,
      element: <LoginForm theme={darkTheme} />,
    },
    {
      path: "/reset-password",
      element: <ResetPasswordForm theme={darkTheme} />,
    },
    // {
    //   path: "/articles",
    //   element: <Articles />,
    // },
    // {
    //   path: "/weekly-challenge",
    //   element: <WeeklyChallenge />,
    // },
    // {
    //   path: "/progress",
    //   element: <Progress />,
    // },
    {
      path: "/combate-sagrado",
      element: <CombateSagrado />,
    },
    {
      path: "/pago-exitoso",
      element: <PagoExitosoPage />
    },
    {
      path: "/subscription",
      element: <SubscriptionPage />
    },
    {
      path: "/auth/callback",
      element: <AuthCallback setSession={setSession} />
    },
    {
      path: "/signout",
      element: <SignOut />
    }
  ];

  return (
    <AuthProvider setSession={setSession}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header user={user} />
          <MakModal openModal={openModal} setOpenModal={setOpenModal} />

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Box>
          {/* <MakModal initialOpen={openModal} onClose={() => setOpenModal(false)} /> */}
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

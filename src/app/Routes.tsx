// src/app/routes.tsx
import { RouteObject, useNavigate } from 'react-router-dom';
import Home from './home.tsx';
import WorkoutList from './workout-list.tsx';
import ExerciseDetail from './exercise-detail.tsx';
import LoginForm from '../components/organisms/login/index.tsx';
import ResetPasswordForm from '../components/organisms/reset-password/index.tsx';
import PagoExitosoPage from './pages/PagoExitosoPage.tsx';
import { AuthCallback } from '@/components/auth/AuthCallback';
import SignOut from '@/components/organisms/signout/signout';
import SubscriptionPage from './pages/SubscriptionPage.tsx';
import CoursePage from './pages/CoursePage.tsx';
import AcercaDeMiPage from './pages/AcercaDeMiPage.tsx';
import { useState } from 'react';
import { getAllWorkouts } from '@/data/getWorkout.ts';
import { Exercise, WorkoutRoutine } from '../types/exercise.ts';
import { Course } from '@/types/course';
import { darkTheme } from '../data/theme';
import SignUpForm from '@/components/organisms/signup/index.tsx';

// Route configuration factory
export const createAppRoutes = (
    difficulty: string,
    setDifficulty: (value: string) => void,
    handleWorkoutSelect: (workout: WorkoutRoutine) => void,
    handleExerciseSelect: (exercise: Exercise) => void,
    selectedExercise: Exercise | null,
    navigate: (to: string) => void,
    setOpenModal: (open: boolean) => void
): RouteObject[] => {
    const workouts = getAllWorkouts();

    return [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/workouts",
            element: (
                <WorkoutList
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    onSelectWorkout={handleWorkoutSelect}
                    workouts={workouts}
                />
            ),
        },
        {
            path: "/workout/:id",
            element: <CoursePage setOpenModal={setOpenModal} onSelectExercise={handleExerciseSelect} />,
        },
        {
            path: "/exercise/:id",
            element: selectedExercise ? (
                <ExerciseDetail exercise={selectedExercise} onBack={() => navigate('/workouts')} />
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
            path: "/acerca-de-mi",
            element: <AcercaDeMiPage />,
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
            element: <AuthCallback />
        },
        {
            path: "/signout",
            element: <SignOut />
        }
    ];
};

// Hook for managing routes with state
export const useAppRoutes = () => {
    const [difficulty, setDifficulty] = useState<string>('all');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const handleWorkoutSelect = (workout: WorkoutRoutine) => {
        navigate(`/workout/${workout.id}`);
    };

    const handleExerciseSelect = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        navigate(`/exercise/${exercise.id}`);
    };

    const routes = createAppRoutes(
        difficulty,
        setDifficulty,
        handleWorkoutSelect,
        handleExerciseSelect,
        selectedExercise,
        navigate,
        setOpenModal
    );

    return {
        routes,
        difficulty,
        setDifficulty,
        selectedExercise,
        setSelectedExercise,
        openModal,
        setOpenModal,
        handleWorkoutSelect,
        handleExerciseSelect
    };
};
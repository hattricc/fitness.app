import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import ExerciseItem from '../../molecules/exercise-item';
import YouTubeModal from '../../molecules/youtube-modal';
import { Exercise, Module } from '@/types/course';
import { useAuth } from "@/contexts/auth/AuthProvider";

interface ExerciseClassProps {
  module: Module;
}

const ExerciseClass: React.FC<ExerciseClassProps> = ({
  module,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const { subscription, subscriptionLoading } = useAuth();

  const handleCloseVideo = () => {
    setTimeout(() => {
      setSelectedVideo(null);
    }, 100);
  };

  const handleExerciseClick = (videoUrl: string, exercise: Exercise) => {
    if (subscriptionLoading) return;
    // Check if exercise is locked and user doesn't have an active subscription
    if (exercise.locked && subscription?.status !== 'paid') {
      // Option 1: Show a modal or alert
      alert('Please subscribe to access premium content');
      // Option 2: Redirect to subscription page
      // navigate('/subscribe');
      return;
    }
    setSelectedVideo(videoUrl);
  };

  console.log('subscription ExcerciseClass', subscription);

  return (
    <>
      {subscriptionLoading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <CircularProgress size={18} />
          <Typography variant="body2">Verificando suscripción…</Typography>
        </Box>
      )}

      {!subscriptionLoading && (
        module.exercises.map((exercise, index) => {
          const isExerciseLocked =
            !subscriptionLoading && exercise.locked && subscription?.status !== "paid";

          return (
            <Box key={index} sx={{ position: 'relative' }}>
              <ExerciseItem
                exercise={exercise}
                setSelectedVideo={(videoUrl: string) => handleExerciseClick(videoUrl, exercise)}
                isExerciseLocked={isExerciseLocked}
                sx={{
                  borderRadius: () => {
                    if (module.exercises.length === 1) return '12px';
                    if (index === 0) return '12px 12px 0 0';
                    if (index === module.exercises.length - 1) return '0 0 12px 12px';
                    return 0;
                  },
                  borderBottom: index < module.exercises.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  opacity: isExerciseLocked ? 0.5 : 1,
                  pointerEvents: isExerciseLocked ? 'none' : 'auto',
                  filter: isExerciseLocked ? 'grayscale(1)' : 'none',
                }}
              />
            </Box>
          );
        })

      )}

      <YouTubeModal
        open={!!selectedVideo}
        url={selectedVideo}
        onClose={handleCloseVideo}
      />
    </>
  );
};

export default ExerciseClass;

import React, { useState } from 'react';
import { Box } from '@mui/material';
import ExerciseItem from '../../molecules/exercise-item';
import YouTubeModal from '../../molecules/youtube-modal';
import { Module } from '@/types/course';

interface ExerciseClassProps {
  module: Module;
  isLocked?: boolean;
}

const ExerciseClass: React.FC<ExerciseClassProps> = ({
  module,
  isLocked = true,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  console.log('module:', module);

  const handleCloseVideo = () => {
    setTimeout(() => {
      setSelectedVideo(null);
    }, 100);
  };

  const handleExerciseClick = (videoUrl: string, exerciseIndex: number) => {
    // const isExerciseLocked = false; // First two items (index 0 and 1) are unlocked, rest are locked
    const isExerciseLocked = exerciseIndex >= 2; // First two items (index 0 and 1) are unlocked, rest are locked
    
    if (!isExerciseLocked) {
      setSelectedVideo(videoUrl);
    }
  };

  return (
    <>
      {module.exercises.map((exercise, index) => {
        const isExerciseLocked = index >= 2; // First two items (index 0 and 1) are unlocked, rest are locked
        // const isExerciseLocked = false; // First two items (index 0 and 1) are unlocked, rest are locked
        
        return (
          <Box key={index} sx={{ position: 'relative' }}>
            <ExerciseItem 
              exercise={exercise}
              setSelectedVideo={(videoUrl: string) => handleExerciseClick(videoUrl, index)}
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
      })}

      <YouTubeModal
        open={!!selectedVideo}
        url={selectedVideo}
        onClose={handleCloseVideo}
      />
    </>
  );
};

export default ExerciseClass;

import React, { useState } from 'react';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Modal } from '@mui/material';
import { ModalBoxStyles, ModalCloseButtonStyles, ModalStyles, ModalVideoBoxStyles, ModalVideoStyles } from './styles';
import { Module } from '@/types/course';
import ExerciseItem from '../../molecules/exercise-item';

interface ExerciseClassProps {
  module: Module;
  isLocked?: boolean;
}

const ExerciseClass: React.FC<ExerciseClassProps> = ({
  module,
  isLocked = true,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Debug logging
  console.log('ExerciseClass isLocked:', isLocked);

  const handleCloseVideo = () => {
    setTimeout(() => {
      setSelectedVideo(null);
    }, 100);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
  };

  const handleExerciseClick = (videoUrl: string, exerciseIndex: number) => {
    const isExerciseLocked = exerciseIndex >= 2; // First two items (index 0 and 1) are unlocked, rest are locked
    if (!isExerciseLocked) {
      setSelectedVideo(videoUrl);
    }
  };

  return (
    <>
      {isLocked && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 2, 
          p: 2, 
          backgroundColor: 'rgba(255, 193, 7, 0.1)', 
          borderRadius: 2,
          border: '1px solid rgba(255, 193, 7, 0.3)',
          color: 'warning.main'
        }}>
          <LockIcon sx={{ color: 'warning.main', fontSize: 20 }} />
          <Typography variant="body2" color="warning.main" fontWeight="medium">
            🔒 Sé parte de la suscripción básica para ver todas las clases.
          </Typography>
        </Box>
      )}

      {module.exercises.map((exercise, index) => {
        const isExerciseLocked = index >= 2; // First two items (index 0 and 1) are unlocked, rest are locked
        
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

      {selectedVideo && (
        <Modal
          open={!!selectedVideo}
          aria-labelledby="video-modal-title"
          aria-describedby="video-modal-description"
          sx={ModalStyles}
        >
          <Box sx={ModalBoxStyles}>
            <IconButton onClick={handleCloseVideo} sx={ModalCloseButtonStyles}>
              <CloseIcon />
            </IconButton>

            <Box sx={ModalVideoBoxStyles}>
              {selectedVideo && (
                <iframe
                  width="100%" height="100%" allowFullScreen
                  src={getYouTubeEmbedUrl(selectedVideo)}
                  title="Exercise Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={ModalVideoStyles}
                />
              )}
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ExerciseClass;

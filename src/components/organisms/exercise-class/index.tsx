import React, { useState } from 'react';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Modal } from '@mui/material';
import { ModalBoxStyles, ModalCloseButtonStyles, ModalStyles, ModalVideoBoxStyles, ModalVideoStyles } from './styles';
import { Module } from '@/types/course';
import { YouTubeHelper } from '../../../data/youtube-helper';
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

  console.log('module:', module);

  const handleCloseVideo = () => {
    setTimeout(() => {
      setSelectedVideo(null);
    }, 100);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    return YouTubeHelper.getEmbedUrl(url, true) || '';
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

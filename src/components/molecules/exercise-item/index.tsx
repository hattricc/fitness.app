import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack, Paper, Modal } from '@mui/material';
import { PlayArrow, Close } from '@mui/icons-material';
import { ExerciseRoutine } from '../../../types/exercise';

interface ExerciseItemProps {
  exercise: ExerciseRoutine;
  onPlay: (exercise: ExerciseRoutine) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onPlay }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  console.log(exercise);
  const videoUrl = exercise.sets[0]?.videoUrl || '';

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoUrl) {
      e.preventDefault();
      setIsVideoOpen(true);
    }
  };

  const handleItemClick = () => {
    if (!videoUrl) {
      onPlay(exercise);
    }
  };

  return (
    <>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 2, 
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        onClick={handleItemClick}
      >
        <Box
          sx={{
            width: 80,
            height: 60,
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {videoUrl && (
            <IconButton
              onClick={handlePlayClick}
              size="small"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                pointerEvents: 'auto', // Ensure the button catches the click
              }}
              onMouseDown={e => e.stopPropagation()} // Prevent parent's onClick when clicking the play button
            >
              <PlayArrow />
            </IconButton>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {exercise.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {exercise.duration} seg
          </Typography>
        </Box>
      </Paper>

      {/* Video Modal */}
      <Modal
        open={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        aria-labelledby="exercise-video-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '80%',
            maxWidth: '800px',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            outline: 'none',
          }}
        >
          <IconButton
            onClick={() => setIsVideoOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'common.white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Close />
          </IconButton>
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%', // 16:9 aspect ratio
              width: '100%',
              overflow: 'hidden',
              borderRadius: 1,
            }}
          >
            {videoUrl && (
              <video
                controls
                autoPlay
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {exercise.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {exercise.description}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ExerciseItem;

import React, { useState } from 'react';
import { Box, Card, Typography, Chip, Stack, IconButton } from '@mui/material';
import { AccessTime, PlayArrow } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Modal } from '@mui/material';
import { Module } from '@/types/course';
import { CardStyles, ExerciseDurationStyles, ExerciseNameStyles, ExerciseRepetitionsStyles, ModalBoxStyles, ModalCloseButtonStyles, ModalStyles, ModalVideoStyles, PlayArrowBoxStyles, TextContainerStyles } from './styles';

interface ExerciseClassProps {
  exercise: Module;
}

const ExerciseClass: React.FC<ExerciseClassProps> = ({
  exercise,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exercise.url) {
      setSelectedVideo(exercise.url);
    }
  };

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


  return (
    <Card
      onClick={handleCardClick}
      sx={CardStyles}
    >
      <Box sx={PlayArrowBoxStyles}>
        <PlayArrow sx={{
          color: 'primary.main',
          fontSize: 70,
        }} />
      </Box>

      <Box sx={TextContainerStyles}>
        <Typography
          variant="subtitle1"
          component="h3"
          fontWeight="bold"
          sx={ExerciseNameStyles}
        >
          {exercise.name}
        </Typography>

      </Box>

      <Chip
        icon={<AccessTime fontSize="small" />}
        label={exercise.duration}
        size="small"
        variant="outlined"
        sx={ExerciseDurationStyles}
      />
      <Typography
        sx={ExerciseRepetitionsStyles}
      >
        {/* {exercise.repetitions || 0} repeticiones */}
        1 repetición
      </Typography>


      {selectedVideo && (
        <Modal
          open={!!selectedVideo}
          aria-labelledby="video-modal-title"
          aria-describedby="video-modal-description"
          sx={ModalStyles}
        >
          <Box sx={ModalBoxStyles}>
            <IconButton
              onClick={handleCloseVideo}
              sx={ModalCloseButtonStyles}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 aspect ratio
              borderRadius: 1,
              overflow: 'hidden',
            }}>
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

    </Card>
  );
};

export default ExerciseClass;

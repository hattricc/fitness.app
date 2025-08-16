import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Modal } from '@mui/material';
import { ModalBoxStyles, ModalCloseButtonStyles, ModalStyles, ModalVideoBoxStyles, ModalVideoStyles } from './styles';
import { Module } from '@/types/course';
import ExerciseItem from '../../molecules/exercise-item';

interface ExerciseClassProps {
  module: Module;
}

const ExerciseClass: React.FC<ExerciseClassProps> = ({
  module,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
    <>
      {module.exercises.map((exercise, index) => (
        <ExerciseItem 
          key={index}
          exercise={exercise}
          setSelectedVideo={setSelectedVideo}
          sx={{
            borderRadius: () => {
              if (module.exercises.length === 1) return '12px';
              if (index === 0) return '12px 12px 0 0';
              if (index === module.exercises.length - 1) return '0 0 12px 12px';
              return 0;
            },
            borderBottom: index < module.exercises.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
          }}
        />
      ))}

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

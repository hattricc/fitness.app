import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack, Modal, IconButton } from '@mui/material';
import { AccessTime, Whatshot, Star, PlayArrow, Close, InfoOutlined } from '@mui/icons-material';

interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    difficulty: string;
    duration: number;
    calories: number;
    imageUrl: string;
    description: string;
    category: string;
    categoryName: string;
    sets?: any[];
    rounds?: any[];
  };
  onClick: (exercise: any) => void;
  showDetails?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onClick = () => { },
  showDetails = true
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoUrl = exercise.sets?.[0]?.videoUrl || '';

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log('videoUrl', videoUrl);

    if (videoUrl) {
      setIsVideoOpen(true);
    } else {
      onClick(exercise);
    }
  };

  const handleCloseVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoOpen(false);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 160 }}>
        <Box
          component="img"
          src={exercise.imageUrl}
          alt={exercise.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (videoUrl) {
                setIsVideoOpen(true);
              }
            }}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              p: 0.5,
              width: 24,
              height: 24
            }}
          >
            <InfoOutlined fontSize="small" />
          </IconButton>
          <Chip
            label={exercise.categoryName}
            color="primary"
            size="small"
            sx={{
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          />
        </Box>
      </Box>

      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" sx={{ color: 'text.primary' }}>
          {exercise.name}
        </Typography>

        {showDetails && (
          <Typography variant="body2" color="text.primary" paragraph>
            {exercise.description || 'No description available'}
          </Typography>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.primary">
              {exercise.duration} seg
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Whatshot fontSize="small" color="action" />
            <Typography variant="body2" color="text.primary">
              {exercise.calories} repeticiones
            </Typography>
          </Box>

          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Whatshot fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {exercise.calories} cal
            </Typography>
          </Box> */}

          {/* {showDetails && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
              <Star fontSize="small" color="warning" />
              <Typography variant="body2" color="text.secondary">
                4.5
              </Typography>
            </Box>
          )} */}
        </Stack>
      </CardContent>

      {/* Video Modal */}
      <Modal
        open={isVideoOpen}
        onClose={handleCloseVideo}
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
            width: '90vw',
            maxWidth: '800px',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            outline: 'none',
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={handleCloseVideo}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              zIndex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <Close />
          </IconButton>
          {videoUrl && (
            <video
              autoPlay
              controls
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                display: 'block',
              }}
              src={videoUrl}
            />
          )}
        </Box>
      </Modal>
    </Card>
  );
};

export default ExerciseCard;

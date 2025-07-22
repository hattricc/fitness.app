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
  // const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoUrl = exercise.sets?.[0]?.videoUrl || '';

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log('videoUrl', videoUrl);

    // if (videoUrl) {
    //   // setIsVideoOpen(true);
    // } else {
      onClick(exercise);
    // }
  };

  // const handleCloseVideo = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setIsVideoOpen(false);
  // };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 8,
        boxShadow: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
        display: 'flex',
        flexDirection: 'row',
        height: 160
      }}
    >
      <Box sx={{
        width: '70%',
        p: 4,
        pr: 6,
        pl: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Box>
          <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" sx={{ color: 'text.primary' }}>
            {exercise.name}
          </Typography>

          {showDetails && (
            <Typography variant="body2" color="text.primary" paragraph>
              {exercise.description || 'No description available'}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
          <Chip
            icon={<AccessTime fontSize="small" />}
            label={`${exercise.duration} seg`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<Whatshot fontSize="small" />}
            label={`${exercise.calories} cal`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<Star fontSize="small" />}
            label={exercise.difficulty}
            size="small"
            variant="outlined"
          />
        </Stack>
      </Box>

      <Box sx={{
        width: '30%',
        position: 'relative',
        minHeight: '100%',
        '&:hover .play-button': {
          opacity: 1,
        }
      }}>
        <Box
          component="img"
          src={exercise.imageUrl}
          alt={exercise.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 8,
          }}
        />
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // if (videoUrl) {
              //   setIsVideoOpen(true);
              // }
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
        {videoUrl && (
          <Box
            className="play-button"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <PlayArrow sx={{ color: 'white', fontSize: 32 }} />
          </Box>
        )}
      </Box>

      <CardContent sx={{ display: 'none' }}>
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
      </CardContent>

      {/* Video Modal */}
      {/* <Modal
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
      </Modal> */}
    </Card>
  );
};

export default ExerciseCard;

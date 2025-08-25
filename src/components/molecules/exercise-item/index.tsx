import React from 'react';
import { Box, Typography, Card, Chip } from '@mui/material';
import { PlayArrow, AccessTime } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import { Exercise } from '@/types/course';
import { YouTubeHelper } from '../../../data/youtube-helper';
import { CardStylesSquared, ExerciseNameStyles, ChipContainerStyles, PlayArrowBoxStyles, TextContainerStyles } from './styles';

interface ExerciseItemProps {
  exercise: Exercise;
  setSelectedVideo: (videoUrl: string) => void;
  isExerciseLocked?: boolean;
  sx?: any;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, setSelectedVideo, isExerciseLocked = false, sx }) => {

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exercise.url) {
      setSelectedVideo(exercise.url);
    }
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{ ...CardStylesSquared, ...sx, position: 'relative' }}
      >

        {/* <Box
          component="img"
          src={exercise.url ? YouTubeHelper.getThumbnailUrl(exercise.url, 'mqdefault') || '/images/exercises/exercises-exteriores.jpg' : '/images/exercises/exercises-exteriores.jpg'}
          alt={exercise.name}
          sx={{
            width: 60,
            height: 60,
            borderRadius: 3,
            objectFit: 'cover',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        /> */}

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

        {/* <Box sx={ChipContainerStyles}>
          {exercise.sets && <Chip
            label={exercise.sets + ' sets'}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 2,
              bgcolor: 'background.default',
              borderColor: 'divider',
              height: 24,
              '& .MuiChip-label': {
                px: 1,
                color: 'text.secondary',
                fontSize: '0.75rem',
              },
            }}
          />}
          {exercise.repetitions && <Chip
            label={exercise.repetitions + ' reps'}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 2,
              bgcolor: 'background.default',
              borderColor: 'divider',
              height: 24,
              '& .MuiChip-label': {
                px: 1,
                color: 'text.secondary',
                fontSize: '0.75rem',
              },
            }}
          />}
          <Chip
            label={exercise.duration}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 2,
              bgcolor: 'background.default',
              borderColor: 'divider',
              height: 24,
              '& .MuiChip-label': {
                px: 1,
                color: 'text.secondary',
                fontSize: '0.75rem',
              },
            }}
          />

        </Box> */}

        <Box sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}>
          {isExerciseLocked ? (
            <Box sx={{
              backgroundColor: 'rgba(255, 193, 7, 0.9)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0,
              transform: 'translateX(-2px)'
            }}>
              <LockIcon sx={{ color: 'white', fontSize: 16 }} />
            </Box>
          ) : (
            <Box sx={PlayArrowBoxStyles}>
              <PlayArrow sx={{
                color: 'primary.main',
                fontSize: 38,
              }} />
            </Box>
          )}
        </Box>
      </Card>
    </>
  );
};

export default ExerciseItem;

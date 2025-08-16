import React from 'react';
import { Box, Typography, Card, Chip } from '@mui/material';
import { PlayArrow, AccessTime } from '@mui/icons-material';
import { Exercise } from '@/types/course';
import { CardStylesSquared, ExerciseDurationStyles, ExerciseNameStyles, ExerciseRepetitionsStyles, PlayArrowBoxStyles, TextContainerStyles } from './styles';

interface ExerciseItemProps {
  exercise: Exercise;
  setSelectedVideo: (videoUrl: string) => void;
  sx?: any;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, setSelectedVideo, sx }) => {

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
        sx={{ ...CardStylesSquared, ...sx }}
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
      </Card>
    </>
  );
};

export default ExerciseItem;

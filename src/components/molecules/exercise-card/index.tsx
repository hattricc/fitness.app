import React from 'react';
import { Box, Card, Typography, Chip, Stack, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { AccessTime, Whatshot, Star, PlayArrow, InfoOutlined } from '@mui/icons-material';
import { ExerciseRoutine } from '@/types/exercise';

interface ExerciseCardProps {
  exercise: ExerciseRoutine;
  onClick: (exercise: ExerciseRoutine) => void;
  showDetails?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onClick = () => { },
  showDetails = true
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const videoUrl = exercise.videoUrl || '';

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    console.log('videoUrl', videoUrl);

    onClick(exercise);
  };

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
        flexDirection: isDesktop ? 'column' : 'row',
        height: isDesktop ? 'auto' : 160,
        width: isDesktop ? '95%' : '100%',
        maxWidth: '100%',
      }}
    >
      {/* Image Section */}
      <Box 
        sx={{
          width: isDesktop ? '100%' : '40%',
          height: isDesktop ? 200 : '100%',
          position: 'relative',
          '&:hover .play-button': {
            opacity: 1,
          }
        }}
      >
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
        <Box sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          display: 'flex', 
          gap: 1 
        }}>

          {exercise.category && <Chip
            label={exercise.category}
            color="primary"
            size="small"
            sx={{
              fontWeight: 'bold',
              textTransform: 'capitalize',
            }}
          />}
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

      {/* Content Section */}
      <Box sx={{
        width: isDesktop ? '100%' : '60%',
        p: isDesktop ? 3 : 4,
        pr: isDesktop ? 3 : 2 ,
        pl: isDesktop ? 3 : 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <Box>
          <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" sx={{ color: 'text.primary' }}>
            {exercise.name}
          </Typography>

          {showDetails && exercise.description && (
            <Typography variant="body2" color="text.primary" paragraph>
              {exercise.description}
            </Typography>
          )}
        </Box>

        <Stack 
          display="flex"
          direction="row" 
          spacing={0} 
          sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}
          >
          {exercise.duration && <Chip
            icon={<AccessTime fontSize="small" />}
            label={`${exercise.duration}`}
            size="small"
            variant="outlined"
          />}
          {exercise.calories && <Chip
            icon={<Whatshot fontSize="small" />}
            label={`${exercise.calories} cal`}
            size="small"
            variant="outlined"
          />}
          {exercise.difficulty && <Chip
            icon={<Star fontSize="small" />}
            label={exercise.difficulty}
            size="small"
            variant="outlined"
          />}
        </Stack>
      </Box>
    </Card>
  );
};

export default ExerciseCard;

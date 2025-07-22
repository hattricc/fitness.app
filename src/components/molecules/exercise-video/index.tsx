import React from 'react';
import { Box, Card, Typography, Chip, Stack } from '@mui/material';
import { AccessTime, Whatshot, Star, PlayArrow } from '@mui/icons-material';

interface ExerciseVideoProps {
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
    sets?: Array<{
      id: string;
      videoUrl?: string;
      [key: string]: any;
    }>;
    rounds?: any[];
  };
  onClick?: (exercise: any) => void;
}

const ExerciseVideo: React.FC<ExerciseVideoProps> = ({
  exercise,
  onClick = () => { }
}) => {
  // videoUrl is available for future video playback functionality
  // const videoUrl = exercise.sets?.[0]?.videoUrl || '';

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(exercise);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 18,
        boxShadow: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
        position: 'relative',
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        px: 3,
      }}>
        {/* Video Thumbnail */}
        <Box
          sx={{
            transition: 'all 0.3s',
            '& .MuiSvgIcon-root': {
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        >
          <PlayArrow sx={{
            color: 'primary.main',
            fontSize: 70,
          }} />
        </Box>

        {/* Exercise Info */}
        <Box sx={{
          width: '60%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography
              variant="subtitle1"
              component="h3"
              fontWeight="bold"
              sx={{
                color: 'text.primary',
                mb: 0.5,
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxHeight: '2.8em'
              }}
            >
              {exercise.name}
            </Typography>
            {/* <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
                height: '2.6em'
              }}
            >
              {exercise.description || 'No description available'}
            </Typography> */}
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
            <Chip
              icon={<AccessTime fontSize="small" />}
              label={`${exercise.duration} seg`}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: 'background.default',
                borderColor: 'divider',
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                },
              }}
            />
            {/*<Chip
              icon={<Whatshot fontSize="small" />}
              label={`${exercise.calories} cal`}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: 'background.default',
                borderColor: 'divider',
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                },
              }}
            />
            <Chip
              icon={<Star fontSize="small" />}
              label={exercise.difficulty}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: 'background.default',
                borderColor: 'divider',
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                },
              }}
            />*/}
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default ExerciseVideo;

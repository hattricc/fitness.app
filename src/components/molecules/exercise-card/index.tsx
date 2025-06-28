import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { AccessTime, Whatshot, Star } from '@mui/icons-material';

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
    sets?: any[];
    rounds?: any[];
  };
  onClick: (exercise: any) => void;
  showDetails?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  onClick,
  showDetails = true 
}) => {
  const handleClick = () => {
    onClick(exercise);
  };

  return (
    <Card 
      onClick={handleClick}
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
        <Chip
          label={exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        />
      </Box>
      
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {exercise.name}
        </Typography>
        
        {showDetails && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {exercise.description || 'No description available'}
          </Typography>
        )}
        
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {exercise.duration} seg
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Whatshot fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
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
    </Card>
  );
};

export default ExerciseCard;

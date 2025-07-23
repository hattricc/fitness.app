import React from 'react';
import { Box, Typography, CardActionArea } from '@mui/material';
import { styled } from '@mui/material/styles';

const WorkoutImage = styled('div')<{ image: string }>(({ theme, image }) => ({
  position: 'relative',
  paddingTop: '75%',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
  },
}));

const WorkoutInfo = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  color: theme.palette.common.white,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
}));

interface ExerciseCard1Props {
  imageUrl: string;
  name: string;
  description: string;
  duration: number;
  exerciseCount: number;
  onClick?: () => void;
}

const ExerciseCardHeader: React.FC<ExerciseCard1Props> = ({
  imageUrl,
  name,
  description,
  duration,
  exerciseCount,
  onClick,
}) => {
  return (
    <CardActionArea onClick={onClick}>
      <WorkoutImage 
        image={imageUrl || 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop'} 
        title={name}
      >
        <WorkoutInfo>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
              {name}
            </Typography>
            <Typography variant="caption" display="block">
              {description}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" display="block">
              {exerciseCount} ejercicios • {duration} min
            </Typography>
          </Box>
        </WorkoutInfo>
      </WorkoutImage>
    </CardActionArea>
  );
};

export default ExerciseCardHeader;

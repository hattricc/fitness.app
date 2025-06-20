import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Exercise } from '../../../types/exercise';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.spacing(2), // Using theme.spacing for consistent border radius
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const ExerciseImage = styled(CardMedia)({
  height: 160,
  position: 'relative',
});

const DifficultyChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  fontWeight: 'bold',
  textTransform: 'capitalize',
  '&.beginner': {
    backgroundColor: '#4caf50',
    color: '#fff',
  },
  '&.intermediate': {
    backgroundColor: '#ff9800',
    color: '#fff',
  },
  '&.advanced': {
    backgroundColor: '#f44336',
    color: '#fff',
  },
}));

const ExerciseDuration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(2), // Using theme.spacing for consistent spacing
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: (exercise: Exercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick(exercise);
    navigate(`/exercise/${exercise.id}`);
  };

  return (
    <StyledCard onClick={handleClick}>
      <CardActionArea>
        <ExerciseImage image={exercise.imageUrl} title={exercise.name}>
          <DifficultyChip 
            label={exercise.difficulty} 
            className={exercise.difficulty} 
            size="small"
          />
          <ExerciseDuration>
            <Typography variant="caption">
              {exercise.duration} min • {exercise.calories} kcal
            </Typography>
          </ExerciseDuration>
        </ExerciseImage>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {exercise.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {exercise.description}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Chip 
              label={`${exercise.sets?.length} exercises`} 
              size="small" 
              variant="outlined"
            />
            <Chip 
              label={exercise.category} 
              size="small" 
              variant="outlined"
              color="primary"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default ExerciseCard;

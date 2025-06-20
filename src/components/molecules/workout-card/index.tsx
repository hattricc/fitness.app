import React from 'react';
import { Card, CardMedia, Typography, CardActionArea, Box, Chip, styled } from '@mui/material';
import { WorkoutRoutine } from '../../../types/exercise';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const WorkoutImage = styled(CardMedia)({
  height: 160,
  position: 'relative',
});

const DifficultyChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  fontWeight: 'bold',
  textTransform: 'capitalize',
  '&.principiante': {
    backgroundColor: '#4caf50',
    color: '#fff',
  },
  '&.intermedio': {
    backgroundColor: '#ff9800',
    color: '#fff',
  },
  '&.avanzado': {
    backgroundColor: '#f44336',
    color: '#fff',
  },
}));

const WorkoutInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  left: theme.spacing(1),
  right: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
}));

interface WorkoutCardProps {
  workout: WorkoutRoutine;
  onClick: (workout: WorkoutRoutine) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick(workout);
    navigate(`/workout/${workout.id}`);
  };

  // Calculate total exercises in the workout
  const totalExercises = workout.rounds.reduce(
    (total, round) => total + (round.exercises?.length || 0), 
    0
  );

  return (
    <StyledCard onClick={handleClick}>
      <CardActionArea>
        <WorkoutImage 
          image={workout.imageUrl || 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop'} 
          title={workout.name}
        >
          <DifficultyChip 
            label={workout.difficulty} 
            className={workout.difficulty} 
            size="small"
          />
          <WorkoutInfo>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {workout.name}
              </Typography>
              <Typography variant="caption" display="block">
                {workout.description}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" display="block">
                {totalExercises} ejercicios • {workout.duration} min
              </Typography>
              <Typography variant="caption" display="block">
                {workout.calories} kcal
              </Typography>
            </Box>
          </WorkoutInfo>
        </WorkoutImage>
      </CardActionArea>
    </StyledCard>
  );
};

export default WorkoutCard;

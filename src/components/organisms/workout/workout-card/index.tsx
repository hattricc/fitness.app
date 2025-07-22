import React from 'react';
// import { Card, CardMedia, Typography, CardActionArea, Box, Chip, styled } from '@mui/material';
import { WorkoutRoutine } from '../../../../types/exercise';
import { useNavigate } from 'react-router-dom';
import { ExerciseCard } from '../../../../components/molecules';

// const StyledCard = styled(Card)(({ theme }) => ({
//   width: '100%',
//   borderRadius: theme.spacing(2),
//   marginBottom: theme.spacing(2),
//   overflow: 'hidden',
//   boxShadow: theme.shadows[2],
//   transition: 'transform 0.2s, box-shadow 0.2s',
//   backgroundColor: theme.palette.background.paper,
//   '&:hover': {
//     transform: 'translateY(-4px)',
//     boxShadow: theme.shadows[6],
//   },
// }));

// const WorkoutImage = styled(CardMedia)({
//   height: 260,
//   position: 'relative',
// });

// const CategoryChip = styled(Chip)(({ theme }) => ({
//   position: 'absolute',
//   top: theme.spacing(1),
//   right: theme.spacing(1),
//   fontWeight: 'bold',
//   textTransform: 'capitalize',
//   '&.tren-inferior': {
//     backgroundColor: '#4caf50',
//     color: '#fff',
//   },
//   '&.intermedio': {
//     backgroundColor: '#ff9800',
//     color: '#fff',
//   },
//   '&.avanzado': {
//     backgroundColor: '#f44336',
//     color: '#fff',
//   },
// }));

// const WorkoutInfo = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   bottom: theme.spacing(1),
//   left: theme.spacing(1),
//   right: theme.spacing(1),
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   color: '#fff',
//   padding: theme.spacing(1, 2),
//   borderRadius: theme.spacing(1),
// }));

interface WorkoutCardProps {
  workout: WorkoutRoutine;
  onClick: (workout: WorkoutRoutine) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(workout);
    navigate(`/workout/${workout.id}`);
  };

  return (
    <ExerciseCard
      exercise={workout}
      onClick={handleClick}
    />
  );
};

export default WorkoutCard;

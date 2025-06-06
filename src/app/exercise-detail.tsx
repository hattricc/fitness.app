import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Chip,
  Button,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { ArrowBack, PlayArrow, FitnessCenter, AccessTime, Whatshot } from '@mui/icons-material';
import { Exercise } from '../types/exercise';

interface ExerciseDetailProps {
  exercise: Exercise | null;
  onBack: () => void;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise, onBack }) => {
  const navigate = useNavigate();
  
  if (!exercise) {
    return (
      <Container>
        <Typography>Exercise not found</Typography>
        <Button onClick={onBack}>Go back</Button>
      </Container>
    );
  }

  const handleStartWorkout = () => {
    // Navigate to workout screen
    navigate(`/workout/${exercise.id}`);
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 10 }}>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <CardMedia
          component="img"
          height="240"
          image={exercise.imageUrl}
          alt={exercise.name}
          sx={{
            borderRadius: 2,
            boxShadow: 2,
          }}
        />
        <IconButton
          onClick={onBack}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Chip
          label={exercise.difficulty}
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            textTransform: 'capitalize',
            fontWeight: 'bold',
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {exercise.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<AccessTime />} 
            label={`${exercise.duration} min`} 
            variant="outlined" 
          />
          <Chip 
            icon={<Whatshot />} 
            label={`${exercise.calories} kcal`} 
            variant="outlined" 
            color="error"
          />
          <Chip 
            icon={<FitnessCenter />} 
            label={`${exercise.sets.length} exercises`} 
            variant="outlined"
            color="secondary"
          />
        </Box>
        <Typography variant="body1" paragraph>
          {exercise.description}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Workout Plan
        </Typography>
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            {exercise.sets.map((set, index) => (
              <React.Fragment key={set.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="div">
                          {set.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`${set.duration}s`} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                          {set.rest > 0 && (
                            <Chip 
                              label={`${set.rest}s rest`} 
                              size="small" 
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={set.description}
                    secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
                {index < exercise.sets.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      <Box sx={{ position: 'fixed', bottom: 70, left: 0, right: 0, p: 2, backgroundColor: 'background.paper', boxShadow: 3 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          onClick={handleStartWorkout}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
          }}
        >
          Start Workout
        </Button>
      </Box>
    </Container>
  );
};

export default ExerciseDetail;

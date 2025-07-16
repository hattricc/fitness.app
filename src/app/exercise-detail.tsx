import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  Container, 
  Card, 
  CardContent,
  CardMedia,
  Stack,
  styled,
  Button,
  Modal
} from '@mui/material';
import { ArrowBack, PlayArrow, AccessTime, Whatshot, Star, Person, Close } from '@mui/icons-material';
import { Exercise, ExerciseRoutine } from '../types/exercise';

const InfoItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {icon}
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
  </Box>
);

const VideoContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '40vh',
  backgroundColor: '#000',
  borderRadius: 16,
  overflow: 'hidden',
  marginBottom: 16,
});

const PlayButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(123, 31, 162, 0.8)',
  color: 'white',
  padding: 16,
  zIndex: 2, // Ensure it's above the image
  '&:hover': {
    backgroundColor: 'rgba(156, 39, 176, 0.9)',
    transform: 'translate(-50%, -50%) scale(1.1)',
    transition: 'all 0.2s ease-in-out',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '3rem',
  },
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  border: '2px solid white',
});

const DifficultyChip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: theme.palette.warning.main,
  color: 'white',
  padding: '4px 12px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}));

const PrimaryButton = styled(Button)({
  width: '100%',
  padding: '12px 24px',
  borderRadius: 12,
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '1rem',
});

interface ExerciseDetailProps {
  exercise: Exercise | null;
  onBack: () => void;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise: propExercise, onBack }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | ExerciseRoutine | null>(propExercise || null);
  const [loading, setLoading] = useState(!propExercise);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoUrl = exercise?.sets?.[0]?.videoUrl || '';

  useEffect(() => {
    if (!propExercise && id) {
      const fetchExercise = async () => {
        try {
          // In a real app, you would fetch the exercise by ID from your API
          // const data = await getExerciseById(id);
          // For now, we'll use a mock implementation
          const mockExercises: (Exercise | ExerciseRoutine)[] = [
            {
              id: 'e1',
              name: 'Jumping Jacks',
              description: 'A physical jumping exercise performed by jumping to a position with the legs spread wide and the hands touching overhead, sometimes in a clap, and then returning to a position with the feet together and the arms at the sides.',
              difficulty: 'beginner',
              duration: 45,
              calories: 50,
              imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop',
              category: 'Cardio',
              categoryName: 'Cardio',
              sets: [
                { id: 's1', name: 'Set 1', duration: 45, rest: 15, description: 'Jumping jacks set 1' },
                { id: 's2', name: 'Set 2', duration: 45, rest: 15, description: 'Jumping jacks set 2' },
              ],
            },
            // Add more mock exercises as needed
          ];
          
          const foundExercise = mockExercises.find(ex => ex.id === id) || null;
          setExercise(foundExercise);
        } catch (error) {
          console.error('Error fetching exercise:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchExercise();
    }
  }, [id, propExercise]);

  if (loading) {
    return (
      <Container>
        <Typography>Loading exercise...</Typography>
      </Container>
    );
  }

  if (!exercise) {
    return (
      <Container>
        <Typography>Exercise not found</Typography>
      </Container>
    );
  }

  const handleStartWorkout = () => {
    navigate(`/workout/${exercise.id}`);
  };

  return (
    <Container maxWidth="sm" sx={{ pb: 10, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacer for alignment */}
      </Box>

      <VideoContainer>
        <Box sx={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          '&:hover .play-button': {
            transform: 'translate(-50%, -50%) scale(1.1)',
          }
        }}>
          <CardMedia
            component="img"
            height="100%"
            image={exercise.imageUrl}
            alt={exercise.name}
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              position: 'relative',
              zIndex: 1
            }}
          />
          {videoUrl && (
            <PlayButton 
              className="play-button"
              size="large" 
              onClick={(e) => {
                e.stopPropagation();
                setIsVideoOpen(true);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(156, 39, 176, 0.95)',
                }
              }}
            >
              <PlayArrow />
            </PlayButton>
          )}
        </Box>
        <DifficultyChip>
          <Star sx={{ fontSize: 16 }} />
          <span>4.4</span>
        </DifficultyChip>
      </VideoContainer>

      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            {exercise.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {exercise.description || 'No description available'}
          </Typography>
          
          <Stack direction="row" spacing={3} sx={{ mt: 2, mb: 3, justifyContent: 'space-between' }}>
            <InfoItem 
              icon={<AccessTime color="primary" />} 
              text={`${exercise.duration} Segundos`} 
            />
            <InfoItem 
              icon={<Whatshot color="primary" />} 
              text={`${exercise.sets?.length || 3} Repeticiones`} 
            />
            <InfoItem 
              icon={<Person color="primary" />} 
              text={exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)} 
            />
          </Stack>

        </CardContent>
      </Card>
    </Container>
  );
};

export default ExerciseDetail;

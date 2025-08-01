import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  useTheme,
  useMediaQuery,
  Button,
  Card
} from '@mui/material';
import Footer from '../components/organisms/footer';
import QuickActions from '../components/molecules/quick-actions/QuickActions';
import {
  FitnessCenter as WorkoutIcon,
  Timeline as ProgressIcon,
  Restaurant as NutritionIcon,
  EmojiEvents as ChallengeIcon
} from '@mui/icons-material';
import { ExerciseCard } from '../components/molecules';
import { ExerciseRoutine } from '@/types/exercise';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data for recommendations
  const recommendations: ExerciseRoutine[] = [
    {
      id: 'wr-jalones',
      name: 'Full Body Workout', 
      category: 'Strength', 
      duration: 30, 
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop',
      difficulty: 'Beginner',
      calories: 0,
      description: 'Full Body Workout',
      categoryName: 'Strength',
      videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
    },
    {
      id: '2',
      name: 'Yoga Flow', 
      category: 'Flexibility', 
      duration: 25, 
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop',
      difficulty: 'Beginner',
      calories: 0,
      description: 'Yoga Flow',
      categoryName: 'Flexibility',
      videoUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
    },
    {
      id: '3',
      name: 'HIIT Cardio', 
      category: 'Cardio', 
      duration: 20, 
      imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&auto=format&fit=crop',
      difficulty: 'Beginner',
      calories: 0,
      description: 'HIIT Cardio',
      categoryName: 'Cardio',
      videoUrl: 'https://www.youtube.com/watch?v=pKSPbD0BECM'
    },
  ];


  const quickActions = [
    { id: 'workout', icon: <WorkoutIcon />, label: 'Entrenamiento', onClick: () => navigate('/workouts') },
    { id: 'progress', icon: <ProgressIcon />, label: 'Progreso', onClick: () => navigate('/progress') },
    { id: 'nutrition', icon: <NutritionIcon />, label: 'Nutrición', onClick: () => navigate('/nutrition') },
    // { id: 'community', icon: <CommunityIcon />, label: 'Community', onClick: () => navigate('/community') },
  ];

  return (
    <Box sx={{ 
      pb: isMobile ? '56px' : 0, // Space for footer on mobile
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      mt: 8
    }}>
      <Box sx={{ flexGrow: 1, px: 2 }}>
        {/* Header */}
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          ¿Qué te gustaría hacer hoy?
          </Typography>
          {/* <Typography variant="body1" color="text.secondary">
            ¿Qué te gustaría hacer hoy?
          </Typography> */}
        </Box>

        {/* Quick Actions */}
        {/* <Box sx={{ mb: 4 }}>
          <QuickActions 
            actions={quickActions}
          />
        </Box> */}

        
        {/* Recommendations Section */}
        <Box sx={{ mb: 4 }}>
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Recommendations</Typography>
            <Button size="small" sx={{ textTransform: 'none' }}>See All</Button>
          </Box> */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 0 }}>
            {recommendations.map((item) => (
              <ExerciseCard exercise={item} onClick={() => navigate(`/workout/${item.id}`)} />
            ))}
          </Box>
        </Box>

        {/* Weekly Challenge Banner */}
        <Card 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            height: 120
          }}
        >
          <Box sx={{ p: 3, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="overline" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <ChallengeIcon sx={{ mr: 0.5, fontSize: 16 }} /> Weekly Challenge
            </Typography>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Plank with Hip Twist
            </Typography>
            <Button 
              variant="contained" 
              size="small" 
              onClick={() => navigate('/weekly-challenge')}
              sx={{ 
                alignSelf: 'flex-start',
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: 'none'
              }}
            >
              Start Now
            </Button>
          </Box>
          <Box 
            component="img"
            src="https://images.unsplash.com/photo-1571019614242-c6c2d118d3bc?w=300&auto=format&fit=crop"
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              height: '140%',
              opacity: 0.8,
              borderRadius: '50% 0 0 50%',
              objectFit: 'cover'
            }}
          />
        </Card>
      </Box>

      {/* Footer - Only visible on mobile */}
      {isMobile && <Footer />}
    </Box>
  );
};

export default Home;

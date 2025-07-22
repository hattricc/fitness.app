import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
  Button
} from '@mui/material';
import Footer from '../components/organisms/footer';
import { type Article } from '../data/mockArticles';
import QuickActions from '../components/molecules/quick-actions/QuickActions';
import {
  FitnessCenter as WorkoutIcon,
  Timeline as ProgressIcon,
  Restaurant as NutritionIcon,
  People as CommunityIcon,
  EmojiEvents as ChallengeIcon
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data for recommendations
  const recommendations = [
    { id: 1, title: 'Full Body Workout', category: 'Strength', duration: '30 min', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop' },
    { id: 2, title: 'Yoga Flow', category: 'Flexibility', duration: '25 min', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop' },
    { id: 3, title: 'HIIT Cardio', category: 'Cardio', duration: '20 min', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&auto=format&fit=crop' },
  ];

  // Import articles from mock data
  const articles = [
    {
      id: '1',
      title: '10 Minute Morning Yoga Flow',
      description: 'Start your day with this energizing yoga sequence to wake up your body and mind.',
      category: 'Yoga',
      duration: 10,
      videoId: 'v7AYKMP6rOE',
      image: 'https://img.youtube.com/vi/v7AYKMP6rOE/hqdefault.jpg'
    },
    {
      id: '2',
      title: 'Perfect Push-up Form',
      description: 'Learn the proper form for push-ups to maximize results and prevent injury.',
      category: 'Strength',
      duration: 5,
      videoId: 'IODxDxX7oi4',
      image: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg'
    },
    {
      id: '3',
      title: 'Meal Prep for Weight Loss',
      description: 'Simple and healthy meal prep ideas to support your weight loss goals.',
      category: 'Nutrition',
      duration: 8,
      videoId: 'pKSPbD0BECM',
      image: 'https://img.youtube.com/vi/pKSPbD0BECM/hqdefault.jpg'
    }
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
      flexDirection: 'column'
    }}>
      <Box sx={{ flexGrow: 1, px: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4, mt: 6 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Hola, Luis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ¿Qué te gustaría hacer hoy?
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <QuickActions 
            actions={quickActions}
          />
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

        {/* Recommendations Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Recommendations</Typography>
            <Button size="small" sx={{ textTransform: 'none' }}>See All</Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            {recommendations.map((item) => (
              <Card key={item.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="120"
                  image={item.image}
                  alt={item.title}
                  sx={{ width: '100%', objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {item.category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.duration}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Articles & Tips Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Articles & Tips</Typography>
            <Button 
              size="small" 
              sx={{ textTransform: 'none' }}
              onClick={() => navigate('/articles')}
            >
              See All
            </Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            {articles.slice(0, 3).map((article: Article) => (
              <Card 
                key={article.id} 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
                onClick={() => window.open(`https://www.youtube.com/watch?v=${article.videoId}`, '_blank')}
              >
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <CardMedia
                    component="img"
                    image={`https://img.youtube.com/vi/${article.videoId}/hqdefault.jpg`}
                    alt={article.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Chip
                    label={article.category}
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom noWrap>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {article.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer - Only visible on mobile */}
      {isMobile && <Footer />}
    </Box>
  );
};

export default Home;

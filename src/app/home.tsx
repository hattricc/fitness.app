import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import Footer from '../components/organisms/footer';
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

  // Mock data for articles
  const articles = [
    { id: 1, title: '5 Tips for Better Sleep', category: 'Wellness', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop' },
    { id: 2, title: 'Meal Prep Guide', category: 'Nutrition', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop' },
    { id: 3, title: 'Morning Routine', category: 'Lifestyle', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop' },
  ];

  const quickActions = [
    { icon: <WorkoutIcon sx={{ fontSize: 28 }} />, label: 'Workout', path: '/workouts' },
    { icon: <ProgressIcon sx={{ fontSize: 28 }} />, label: 'Progress', path: '/progress' },
    { icon: <NutritionIcon sx={{ fontSize: 28 }} />, label: 'Nutrition', path: '/nutrition' },
    { icon: <CommunityIcon sx={{ fontSize: 28 }} />, label: 'Community', path: '/community' },
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Hi, Luis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            What would you like to do today?
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              fullWidth
              variant="outlined"
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 2,
                textTransform: 'none',
                color: 'text.primary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <Box sx={{ color: 'primary.main', mb: 1 }}>{action.icon}</Box>
              <Typography variant="body2" fontWeight="medium">
                {action.label}
              </Typography>
            </Button>
          ))}
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
            <Button size="small" sx={{ textTransform: 'none' }}>See All</Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            {articles.map((article) => (
              <Card key={article.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="100"
                  image={article.image}
                  alt={article.title}
                  sx={{ width: '100%', objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="caption" color="primary" fontWeight="medium">
                    {article.category}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {article.title}
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

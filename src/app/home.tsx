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
import {
  EmojiEvents as ChallengeIcon
} from '@mui/icons-material';
import { ExerciseCard } from '../components/molecules';
import { ExerciseRoutine } from '@/types/exercise';
import coursesData from '../data/courses.json';


const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const courses = coursesData as unknown as ExerciseRoutine[];

  return (
    <Box sx={{ 
      pb: isMobile ? '56px' : 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      mt: 8
    }}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            ¿Qué te gustaría hacer hoy?
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, 
            gap: 0, 
            '& > *': {
              mb: { xs: 2, sm: 0 }
            }
          }}>
            {courses.map((item) => (
              <ExerciseCard key={item.id} exercise={item} onClick={() => navigate(`/workout/${item.id}`)} />
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

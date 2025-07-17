import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { FitnessCenter as FitnessCenterIcon } from '@mui/icons-material';

export default function WeeklyChallenge() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleStartChallenge = () => {
    // Navigate to the actual workout routine
    navigate('/workout/challenge-1');
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <Paper 
          elevation={6} 
          sx={{
            p: isMobile ? 3 : 5,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <Box 
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <FitnessCenterIcon sx={{ color: 'white', fontSize: 40 }} />
          </Box>
          
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Weekly Challenge
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Full Body HIIT Workout
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              lineHeight: 1.7,
              fontSize: '1.1rem',
            }}
          >
            Get ready to push your limits with this intense full body HIIT workout. 
            Complete 3 rounds of 10 exercises, 45 seconds on, 15 seconds off. 
            Perfect for burning fat and building endurance.
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 4,
            textAlign: 'center',
          }}>
            <Box>
              <Typography variant="h6" color="primary" fontWeight="bold">30 min</Typography>
              <Typography variant="body2" color="text.secondary">Duration</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="primary" fontWeight="bold">All Levels</Typography>
              <Typography variant="body2" color="text.secondary">Difficulty</Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="primary" fontWeight="bold">Full Body</Typography>
              <Typography variant="body2" color="text.secondary">Focus</Typography>
            </Box>
          </Box>
          
          <Button 
            variant="contained" 
            size="large"
            onClick={handleStartChallenge}
            sx={{
              py: 1.5,
              px: 6,
              borderRadius: 50,
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Challenge
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

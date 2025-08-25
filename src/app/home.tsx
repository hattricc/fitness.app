import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  Card,
  Modal,
  IconButton
} from '@mui/material';
import Footer from '../components/organisms/footer';
import {
  EmojiEvents as ChallengeIcon
} from '@mui/icons-material';
import { ExerciseCard } from '../components/molecules';
import { ExerciseRoutine } from '@/types/exercise';
import coursesData from '../data/courses.json';
import { Close as CloseIcon } from '@mui/icons-material';
import React from 'react';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const courses = coursesData as unknown as ExerciseRoutine[];

  return (
    <Box sx={{
      pb: isMobile ? '56px' : 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              handleOpen();
              setTimeout(handleClose, 26500);
            }}
            sx={{
              backgroundColor: '#1B1B1B',
              color: 'white',
              borderRadius: 4,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#333',
                opacity: 0.9,
              },
              transition: 'all 0.3s ease',
              minWidth: '40%',
              width: 'fit-content'
            }}
          >
          ¡Bienvenido Luis!
          </Button>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="welcome-video-modal"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
            zIndex: 10005,
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          <Box sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            maxHeight: '90vh',
            mx: 2,
            bgcolor: '#1B1B1B',
            borderRadius: 2,
            boxShadow: 24,
            p: 1,
            outline: 'none',
          }}>
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '177.78%', // 9:16 aspect ratio
              height: 0,
              overflow: 'hidden',
            }}>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/MonVZibsRp0?autoplay=1"
                title="Video de bienvenida"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </Box>
          </Box>
        </Modal>

        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            ¿Qué te gustaría hacer hoy?
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
          gap: 0,
          '& > *': {
            mb: { xs: 2, sm: 0 }
          },
          mb: 2
        }}>
          {courses.map((item) => (
            <ExerciseCard key={item.id} exercise={item} onClick={() => navigate(`/workout/${item.id}`)} />
          ))}
        </Box>

        {/* <Card
          sx={{
            borderRadius: 8,
            background: '#1B1B1B',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            height: 160
          }}
        >
          <Box sx={{ p: 3, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="overline" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <ChallengeIcon sx={{ mr: 0.5, fontSize: 16 }} /> Weekly Challenge
            </Typography>
            <Typography variant="h6" fontWeight="bold" color='white' gutterBottom>
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
        </Card> */}

      {/* Footer - Only visible on mobile */}
      {/* {isMobile && <Footer />} */}
    </Box>
  );
};

export default Home;

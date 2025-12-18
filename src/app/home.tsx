import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import SplashScreen from '../components/molecules/splash-screen/SplashScreen';
import { ExerciseCard } from '../components/molecules';
import { ExerciseRoutine } from '@/types/exercise';
import coursesData from '../data/courses.json';
import linksData from '../data/home.json';
import YouTubeModal from '../components/molecules/youtube-modal';
import Footer from '@/components/organisms/footer';

interface HomeProps {
}

const Home: React.FC<HomeProps> = ({
}) => {
  // Check if splash has been shown before using localStorage
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('hasSeenSplash');
    }
    return true;
  });
  const [open, setOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSplashEnd = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenSplash', 'true');
    }
    setShowSplash(false);
  };

  // Cleanup effect to ensure we don't have memory leaks
  useEffect(() => {
    return () => {
      // Any cleanup if needed when component unmounts
    };
  }, []);

  if (showSplash) {
    return (
      <SplashScreen onAnimationEnd={handleSplashEnd} />
    );
  }

  const handleOpenModal = (url: string | undefined) => {
    setOpen(true);
    setSelectedVideo(url);
  };
  const handleCloseModal = () => setOpen(false);

  const welcomeButtonStyle = {
    backgroundColor: '#E57952',
    color: 'white',
    borderRadius: 4,
    px: 4,
    py: 1.5,
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    '&:hover': {
      opacity: 0.9,
    },
    transition: 'all 0.3s ease',
    minWidth: '40%',
    width: 'fit-content'
  }

  const boxExerciseCardStyle = {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(4, 1fr)'
    },
    '& > *': {
      width: '100%',
      mb: { xs: 2, md: 0 }
    },
    '@media (min-width: 900px)': {
      gap: 3,
      '& > *': {
        maxWidth: '280px',
        margin: '0 auto'
      }
    },
    mb: 1
  }

  const homeBoxStyle = {
    pb: isMobile ? '56px' : 0,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }

  const courses = coursesData as unknown as ExerciseRoutine[];
  const links = linksData as unknown as ExerciseRoutine[];

  const goToCourse = (item: ExerciseRoutine) => {
    if (item.directLink) {
      return handleOpenModal(item.url);
    }

    const pdfUrl = (item as any)?.pdfUrl as string | undefined;
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.urlPage) {
      navigate(item.urlPage);
      return;
    }

    return navigate(`/workout/${item.id}`);
  }

  return (
    <>
      <Box sx={homeBoxStyle}>
        <Box sx={{ mb: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="contained"
            onClick={() => {
              handleOpenModal('https://www.youtube.com/watch?v=T8G37J9bdrY?autoplay=1');
              setTimeout(handleCloseModal, 85000 + 2000);
            }}
            sx={welcomeButtonStyle}
          >
            Mensaje de Bienvenida
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              navigate('/combate-sagrado')
            }}
            sx={welcomeButtonStyle}
          >
            Acerca de mí
          </Button>
        </Box>

        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            ¿Qué te gustaría hacer hoy?
          </Typography>
        </Box>

        <Box sx={boxExerciseCardStyle}>
          {courses.map((item) => (
            <ExerciseCard key={item.id} exercise={item as ExerciseRoutine} onClick={() => goToCourse(item)} />
          ))}
          {links.map((item) => (
            <ExerciseCard key={item.id} exercise={item as ExerciseRoutine} onClick={() => goToCourse(item)} />
          ))}
        </Box>

        {open && <YouTubeModal
          open={open}
          url={selectedVideo || null}
          onClose={handleCloseModal}
        />}

        {/* Footer - Only visible on mobile */}
        {/* {isMobile && <Footer />} */}
        <Footer />
      </Box>
    </>
  );
};

export default Home;

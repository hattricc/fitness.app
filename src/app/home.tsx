import { useNavigate } from 'react-router-dom';
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
import welcomeVideoData from '../data/welcome-video.json';
import Footer from '@/components/organisms/footer';
import { PlayCircleOutline } from '@mui/icons-material';

interface HomeProps {
}

const Home: React.FC<HomeProps> = ({
}) => {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const lastSeen = localStorage.getItem('lastSeenSplash');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      return !lastSeen || (now - parseInt(lastSeen, 10)) > oneDay;
    }
    return true;
  });


  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCloseSplash = () => {
    setShowSplash(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSeenSplash', Date.now().toString());
    }
  };

  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const animClass = animateIn ? 'animate-[fadeUp_600ms_ease-out_both]' : '';

  if (showSplash) {
    return (
      <SplashScreen onAnimationEnd={handleCloseSplash} />
    );
  }
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
    minWidth: '100%',
    width: 'fit-content'
  }

  const boxExerciseCardStyle = {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(4, 1fr)'
    },
    gap: { xs: 2, md: 3 },
    alignItems: 'stretch',
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
      return navigate('/video', { state: { url: item.url, title: item.name } });
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
        <Box
          className={`opacity-0 translate-y-2 ${animClass}`}
          style={{ animationDelay: '0ms' }}
          sx={{ mb: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/video', { state: { url: welcomeVideoData.url, title: welcomeVideoData.buttonText } });
            }}
            sx={welcomeButtonStyle}
          >
            {welcomeVideoData.buttonText} <PlayCircleOutline sx={{ ml: 1 }} />
          </Button>

          {/* <Button
            variant="contained"
            onClick={() => {
              navigate('/acerca-de-mi')
            }}
            sx={welcomeButtonStyle}
          >
            Acerca de mí
          </Button> */}
        </Box>

        <Box
          className={`opacity-0 translate-y-2 ${animClass}`}
          style={{ animationDelay: '200ms' }}
        >
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            ¿Qué te gustaría hacer hoy?
          </Typography>
        </Box>

        <Box sx={boxExerciseCardStyle}>
          {[...courses, ...links].map((item, idx) => (
            <div
              key={item.id}
              className={`opacity-0 translate-y-2 ${animClass}`}
              style={{ animationDelay: `${300 + idx * 60}ms` }}
            >
              <ExerciseCard exercise={item as ExerciseRoutine} onClick={() => goToCourse(item as any)} />
            </div>
          ))}
        </Box>

        {/* Footer - Only visible on mobile */}
        {/* {isMobile && <Footer />} */}
        <div
          className={`opacity-0 translate-y-2 ${animClass}`}
          style={{ animationDelay: '1000ms' }}
        >
          <Footer />
        </div>
      </Box>
    </>
  );
};

export default Home;

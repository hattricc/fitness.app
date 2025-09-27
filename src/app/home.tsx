import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import { ExerciseCard } from '../components/molecules';
import { ExerciseRoutine } from '@/types/exercise';
import coursesData from '../data/courses.json';
import React from 'react';
import YouTubeModal from '../components/molecules/youtube-modal';
import Footer from '@/components/organisms/footer';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);

  const handleOpenModal = (url: string | undefined) => {
    setOpen(true);
    setSelectedVideo(url);
  };
  const handleCloseModal = () => setOpen(false);
  const [selectedVideo, setSelectedVideo] = React.useState<string | undefined>(undefined);

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

  const goToCourse = (item: ExerciseRoutine) => {
    const pdfUrl = (item as any)?.pdfUrl as string | undefined;
    if (item.directLink) return handleOpenModal(item.url);
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    return navigate(`/workout/${item.id}`);
  }

  return (
    <>
      <Box sx={homeBoxStyle}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => {
              handleOpenModal('https://www.youtube.com/embed/UsiYtN0oAEY?autoplay=1');
              setTimeout(handleCloseModal, 30000 + 1500);
            }}
            sx={welcomeButtonStyle}
          >
            Mensaje de Bienvenida
          </Button>
        </Box>

        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            ¿Qué te gustaría hacer hoy?
          </Typography>
        </Box>

        <Box sx={boxExerciseCardStyle}>
          {courses.map((item) => (
            <ExerciseCard key={item.id} exercise={item} onClick={() => goToCourse(item)} />
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

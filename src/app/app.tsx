import { useState, useRef } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import './app.css';
import Header from '../components/organisms/header';
import { darkTheme } from '../data/theme';
import { useAuth } from '../contexts/auth/AuthProvider.tsx';

import { MakModal } from '@/components/molecules/MakModal/MakModal';
import { useAppRoutes } from './Routes.tsx';

function App() {
  const { user } = useAuth();
  const { routes, openModal, setOpenModal } = useAppRoutes(); // Get modal state from routes
  const renderedRoutes = useRoutes(routes);

  const [hasIntroEnded, setHasIntroEnded] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);


  const handleVideoEnd = () => {
    setHasIntroEnded(true);
  };


  // Show intro video if it hasn't ended yet
  if (!hasIntroEnded) {
    return (
      <Box className="intro-video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          onEnded={handleVideoEnd}
          className="video-player"
        >
          <source src="/videos/intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      {/* <AuthGate> */}
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header user={user} />
        <MakModal openModal={openModal} setOpenModal={setOpenModal} />

        <Box component="main" sx={{ flexGrow: 1, px: 2 }}>
          {renderedRoutes}
        </Box>
      </Box>
      {/* </AuthGate> */}
    </ThemeProvider>
  );
}

export default App;

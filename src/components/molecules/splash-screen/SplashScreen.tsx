import React, { useState, useEffect } from 'react';
import { Box, keyframes, styled } from '@mui/material';
import IntroCarousel from '../intro-carousel/IntroCarousel';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const SplashContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  zIndex: 9999,
  '&.fade-out': {
    animation: `${fadeOut} 0.5s ease-out forwards`,
  },
}));

const LogoImage = styled('img')({
  width: 150,
  height: 150,
  objectFit: 'contain',
  marginBottom: 16,
  backgroundColor: 'transparent',
});

const DebugText = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  color: theme.palette.text.primary,
  fontSize: '12px',
  opacity: 0.7,
}));

interface SplashScreenProps {
  onAnimationEnd: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd }) => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Initializing...');

  const handleSplashEnd = () => {
    setDebugInfo('Splash animation ended, showing carousel');
    setShowCarousel(true);
  };

  const handleCarouselComplete = () => {
    setDebugInfo('Carousel completed, proceeding to app');
    onAnimationEnd();
  };

  useEffect(() => {
    setDebugInfo('Setting up splash screen timeout');
    const timer = setTimeout(() => {
      setDebugInfo('Splash timeout reached, starting fade out');
      const splashContainer = document.querySelector('.splash-container');
      if (splashContainer) {
        splashContainer.classList.add('fade-out');
        splashContainer.addEventListener('animationend', handleSplashEnd, { once: true });
      } else {
        setDebugInfo('Error: Splash container not found');
        // Fallback to direct transition
        handleSplashEnd();
      }
    }, 2000); // Reduced time for testing

    return () => {
      clearTimeout(timer);
      const splashContainer = document.querySelector('.splash-container');
      if (splashContainer) {
        splashContainer.removeEventListener('animationend', handleSplashEnd);
      }
    };
  }, []);

  // Show carousel after splash screen
  if (showCarousel) {
    return <IntroCarousel onComplete={handleCarouselComplete} />;
  }

  // Show initial splash screen
  return (
    <SplashContainer className="splash-container">
      <LogoImage 
        src="/images/logo-2.png"
        alt="Fitness App Logo"
        onError={(e) => {
          console.error('Failed to load logo image');
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiwyQTEwLDEwIDAgMCwwIDIsMTJBMTAsMTAgMCAwLDAgMTIsMjJBMTAsMTAgMCAwLDAgMjIsMTJBMTAsMTAgMCAwLDAgMTIsMk0xMiwyQTEwLDEwIDAgMCwxIDIyLDEyQTEwLDEwIDAgMCwxIDEyLDIyQTEwLDEwIDAgMCwxIDIsMTJBMTAsMTAgMCAwLDEgMTIsM00xMSwxNlY4SDEzVjE2SDExTTExLDE5VjE3SDEzVjE5SDExWiIgLz48L3N2Zz4=';
        }}
      />
      <DebugText>{debugInfo}</DebugText>
    </SplashContainer>
  );
};

export default SplashScreen;

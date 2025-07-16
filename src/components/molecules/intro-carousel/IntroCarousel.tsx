import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, styled, keyframes } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const CarouselContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 9998,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  animation: `${fadeIn} 0.5s ease-in`,
  backgroundColor: '#121212', // Fallback background color
});

const Slide = styled(motion.div)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '40px 20px',
  boxSizing: 'border-box',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 'auto',
  paddingTop: '40px',
});

const LogoImage = styled('img')({
  width: 120,
  height: 120,
  objectFit: 'contain',
  backgroundColor: 'transparent',
});

const TextContainer = styled(Box)({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  borderRadius: 20,
  padding: '24px',
  margin: '0 20px',
  color: 'white',
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
});

const Title = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '12px',
  fontSize: '1.8rem',
  color: 'white',
});

const Description = styled(Typography)({
  marginBottom: '24px',
  opacity: 0.9,
  fontSize: '1rem',
  color: 'rgba(255, 255, 255, 0.9)',
});

const NextButton = styled(Button)({
  backgroundColor: '#E57952', // Using primary color from your theme
  color: 'white',
  borderRadius: 50,
  padding: '12px 40px',
  fontWeight: 'bold',
  textTransform: 'none',
  margin: '0 auto',
  marginBottom: '40px',
  '&:hover': {
    backgroundColor: '#CC6A48', // Darker shade for hover
  },
});

const DotsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
  gap: '8px',
});

const Dot = styled(Box)<{ active: boolean }>(({ active }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: active ? '#E57952' : 'rgba(255, 255, 255, 0.4)',
  transition: 'all 0.3s ease',
}));

interface SlideData {
  id: number;
  title: string;
  description: string;
  backgroundImage: string;
  backgroundColor?: string;
}

// Using solid colors as fallback if images don't load
const slides: SlideData[] = [
  {
    id: 1,
    title: 'Bienvenido a Luis Suarez',
    description: 'El mejor entrenador de fitness.',
    backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    backgroundColor: '#1a1a1a',
  },
  {
    id: 2,
    title: 'Sigue tu progreso',
    description: 'Registra tus entrenamientos y observa cómo mejoras con el tiempo.',
    backgroundImage: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    backgroundColor: '#2a2a2a',
  },
  {
    id: 3,
    title: 'Ejercicios',
    description: 'Accede a una amplia variedad de ejercicios adaptados a tus necesidades.',
    backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    backgroundColor: '#1a1a1a',
  },
  {
    id: 4,
    title: '¡Comencemos!',
    description: 'Crea tu perfil y comienza tu viaje de fitness hoy mismo.',
    backgroundImage: 'linear-gradient(135deg, #E57952 0%, #CC6A48 100%)',
    backgroundColor: '#E57952',
  },
];

interface IntroCarouselProps {
  onComplete: () => void;
}

const IntroCarousel: React.FC<IntroCarouselProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Log for debugging
  useEffect(() => {
    console.log('Current slide:', currentSlide);
    console.log('Images loaded:', imagesLoaded);
  }, [currentSlide, imagesLoaded]);

  return (
    <CarouselContainer>
      <AnimatePresence initial={false} custom={1}>
        <Slide
          key={slides[currentSlide].id}
          custom={1}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          style={{
            background: slides[currentSlide].backgroundImage,
            backgroundColor: slides[currentSlide].backgroundColor,
          }}
        >
          <LogoContainer>
            <LogoImage 
              src="/images/logo.png"
              alt="FitTrack Logo"
              onError={(e) => {
                console.error('Failed to load logo');
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiwyQTEwLDEwIDAgMCwwIDIsMTJBMTAsMTAgMCAwLDAgMTIsMjJBMTAsMTAgMCAwLDAgMjIsMTJBMTAsMTAgMCAwLDAgMTIsMk0xMiwyQTEwLDEwIDAgMCwxIDIyLDEyQTEwLDEwIDAgMCwxIDEyLDIyQTEwLDEwIDAgMCwxIDIsMTJBMTAsMTAgMCAwLDEgMTIsM00xMSwxNlY4SDEzVjE2SDExTTExLDE5VjE3SDEzVjE5SDExWiIgLz48L3N2Zz4=';
              }}
            />
          </LogoContainer>
          
          <Box>
            <TextContainer>
              <Title variant="h4">{slides[currentSlide].title}</Title>
              <Description variant="body1">
                {slides[currentSlide].description}
              </Description>
            </TextContainer>
            
            <DotsContainer>
              {slides.map((_, index) => (
                <Dot 
                  key={index} 
                  active={index === currentSlide} 
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </DotsContainer>
            
            <NextButton 
              variant="contained" 
              onClick={nextSlide}
              fullWidth
              size="large"
            >
              {currentSlide === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
            </NextButton>
          </Box>
        </Slide>
      </AnimatePresence>
    </CarouselContainer>
  );
};

export default IntroCarousel;

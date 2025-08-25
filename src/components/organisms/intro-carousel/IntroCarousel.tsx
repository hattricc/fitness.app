import React, { useState } from 'react';
import { Box, styled, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressButtons from '../../molecules/progress-buttons/progress-buttons';
import { SlideData } from '@/types/slidedata';

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
  backgroundColor: '#121212', // Fallback background color
  boxSizing: 'border-box',
  backgroundRepeat: 'no-repeat',
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: 16,
  right: 16,
  color: 'white',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  zIndex: 10,
});

const Slide = styled(motion.div)({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '40px 20px',
  boxSizing: 'border-box',
  backgroundRepeat: 'no-repeat',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
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

const slides: SlideData[] = [
  {
    id: 1,
    title: 'Bienvenido a Entrenamiento e Integración',
    backgroundImage: '',
    backgroundColor: '#1B1B1B',
  },
  {
    id: 2,
    title: 'Aquí encontrarás una guía de ejercicios y rutinas físicas',
    backgroundImage: 'url(/images/welcome/bienvenida-2.jpg)',
  },
  {
    id: 3,
    title: 'Adaptables a tus requerimientos personales',
    backgroundImage: 'url(/images/welcome/bienvenida-3.jpg)',
    backgroundColor: 'transparent',
  },
  {
    id: 4,
    title: 'Y acompañamiento integral en el proceso más importante de tu vida',
    backgroundImage: 'url(/images/welcome/bienvenida-4.jpg)',
  },
  {
    id: 5,
    title: 'Cultivar tu salud',
    backgroundImage: 'url(/images/welcome/bienvenida-5.jpg)',
    // backgroundColor: '#E57952',
  },
];

interface IntroCarouselProps {
  onComplete: () => void;
}

const IntroCarousel: React.FC<IntroCarouselProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <CarouselContainer>
      <AnimatePresence initial={false} custom={1}>
        <Slide
          key={slides[currentSlide].id}
          custom={1}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
          }}
          style={{
            // backgroundImage: slides[currentSlide].backgroundImage,
            backgroundColor: slides[currentSlide].backgroundColor,
          }}
        >
          <CloseButton onClick={onComplete} aria-label="close">
            <CloseIcon />
          </CloseButton>
          <LogoContainer>
            <LogoImage
              src="/images/logo/logo-blanco.png"
              alt="Logo"
              onError={(e) => {
                console.error('Failed to load logo');
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiwyQTEwLDEwIDAgMCwwIDIsMTJBMTAsMTAgMCAwLDAgMTIsMjJBMTAsMTAgMCAwLDAgMjIsMTJBMTAsMTAgMCAwLDAgMTIsMk0xMiwyQTEwLDEwIDAgMCwxIDIyLDEyQTEwLDEwIDAgMCwxIDEyLDIyQTEwLDEwIDAgMCwxIDIsMTJBMTAsMTAgMCAwLDEgMTIsM00xMSwxNlY4SDEzVjE2SDExTTExLDE5VjE3SDEzVjE5SDExWiIgLz48L3N2Zz4=';
              }}
            />
          </LogoContainer>

          <ProgressButtons 
            onComplete={onComplete} 
            slides={slides} 
            currentSlide={currentSlide} 
            setCurrentSlide={setCurrentSlide} 
          />

        </Slide>
      </AnimatePresence>
    </CarouselContainer>
  );
};

export default IntroCarousel;

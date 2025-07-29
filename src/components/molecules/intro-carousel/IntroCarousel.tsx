import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, styled, keyframes, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
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

const TextContainer = styled(Box)({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  borderRadius: 20,
  padding: '24px',
  margin: '20px 0px',
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

// const Description = styled(Typography)({
//   marginBottom: '24px',
//   opacity: 0.9,
//   fontSize: '1rem',
//   color: 'rgba(255, 255, 255, 0.9)',
// });

const PreviousButton = styled(Button)({
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
  width: '20%',
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
  width: '80%',
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
  // description: string;
  backgroundImage: string;
  backgroundColor?: string;
}

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
    backgroundColor: '#E57952',
  },
  {
    id: 5,
    title: 'Cultivar tu salud',
    backgroundImage: 'url(/images/welcome/bienvenida-5.jpg)',
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
    if (currentSlide == slides.length - 1) {
      onComplete();
      return;
    }

    setCurrentSlide(currentSlide + 1);
  };

  const previousSlide = () => {
    if (currentSlide <= 0) {
      return;
    }

    setCurrentSlide(currentSlide - 1);
  };

  const variants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as any
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as any
      }
    },
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
            opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
          }}
          style={{
            backgroundImage: slides[currentSlide].backgroundImage,
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

          <Box>
            <TextContainer>
              <Title variant="h4">{slides[currentSlide].title}</Title>
              {/* <Description variant="body1">
                {slides[currentSlide].description}
              </Description> */}
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

            <Box sx={
              {
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
              }
            }>
              {currentSlide > 0 && (
                <PreviousButton
                  variant="contained"
                  onClick={previousSlide}
                  fullWidth
                  size="large"
                >
                  <ChevronLeftIcon />
                </PreviousButton>
              )}
              <NextButton
                variant="contained"
                onClick={nextSlide}
                fullWidth
                size="large"
                sx={
                  {
                    width: currentSlide === 0 ? '100%' : '80%',
                  }
                }
              >
                {currentSlide === slides.length - 1 ? '¡Comencemos!' : 'Siguiente'}
              </NextButton>
            </Box>
          </Box>
        </Slide>
      </AnimatePresence>
    </CarouselContainer>
  );
};

export default IntroCarousel;

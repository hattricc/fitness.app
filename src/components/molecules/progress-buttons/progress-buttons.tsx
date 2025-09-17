import React, { useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import PreviousButton from '../../atoms/buttons/previous-button';
import NextButton from '../../atoms/buttons/next-button';
import { SlideData } from '@/types/slidedata';

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


interface ProgressButtonsProps {
    onComplete: () => void;
    slides: SlideData[];
    currentSlide: number;
    setCurrentSlide: (slide: number) => void;
}

const ProgressButtons: React.FC<ProgressButtonsProps> = ({ onComplete, slides, currentSlide, setCurrentSlide }) => {
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

    return (
        <Box>
            <TextContainer>
                <Title variant="h4">{slides[currentSlide].title}</Title>
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
                    height: '7rem'
                }
            }>
                {/* {currentSlide > 0 && (
                    <PreviousButton onClick={previousSlide} />
                )} */}

                <NextButton
                    onClick={nextSlide}
                    sx={{
                        backgroundColor: currentSlide === slides.length - 1 ? '#E57952' : 'white',
                        color: currentSlide === slides.length - 1 ? 'white' : '#1B1B1B',
                    }}
                    text={currentSlide === slides.length - 1 ? '¡Comencemos!' : 'Siguiente'}
                />
            </Box>
        </Box>
    );
};

export default ProgressButtons;

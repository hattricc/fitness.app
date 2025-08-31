import { Button, styled } from "@mui/material";
import { forwardRef, ComponentProps } from "react";

const StyledButton = styled(Button)({
  backgroundColor: 'white',
  color: '#1B1B1B',
  borderRadius: 50,
  padding: '12px 40px',
  fontWeight: 'bold',
  textTransform: 'none',
  margin: '0 auto',
  marginBottom: '40px',
  width: '85%',
  transition: 'opacity 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'white',
    opacity: 0.8,
  },
  '&.Mui-disabled': {
    backgroundColor: '#E57952',
    color: 'white'
  }
});

const NextButton = forwardRef<HTMLButtonElement, 
  Omit<ComponentProps<"button">, "className"> & {
    onClick: () => void;
    currentSlide: number;
    slidesLength: number;
    color?: string;
  }
>(({ children, onClick, currentSlide, slidesLength, color, ...props }, ref) => {
  return (
    <StyledButton
      ref={ref}
      onClick={onClick}
      disabled={currentSlide === slidesLength - 1}
      sx={{
        width: currentSlide === 0 ? '100%' : '80%',
        backgroundColor: currentSlide === slidesLength - 1 ? '#E57952' : 'white',
        '&:hover': {
          backgroundColor: currentSlide === slidesLength - 1 ? '#E57952' : 'white',
        },
      }}
      variant="contained"
      fullWidth
      size="large"
      {...props}
    >
      {children || (currentSlide === slidesLength - 1 ? '¡Comencemos!' : 'Siguiente')}
    </StyledButton>
  );
});

NextButton.displayName = 'NextButton';

export default NextButton;

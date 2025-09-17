import { Button, styled, SxProps, Theme } from "@mui/material";
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
  width: '100%',
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
    color?: string;
    text?: string;
    sx?: SxProps<Theme>;
  }
>(({ children, onClick, color, text, sx, ...props }, ref) => {
  return (
    <StyledButton
      ref={ref}
      onClick={onClick}
      sx={sx}
      variant="contained"
      fullWidth
      size="large"
      {...props}
    >
      {children || text || 'Click'}
    </StyledButton>
  );
});

NextButton.displayName = 'NextButton';

export default NextButton;

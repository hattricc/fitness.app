import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button, styled } from "@mui/material";
import { forwardRef, ComponentProps } from "react";

const NextButton = forwardRef<
  HTMLButtonElement,
  Omit<ComponentProps<"button">, "className"> & {
    onClick: () => void;
    currentSlide: number;
    slidesLength: number;
  }
>((props) => {

  const NextButton = styled(Button)({
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
      opacity: 0.8,
    },
  });

  return (
    <NextButton
      variant="contained"
      onClick={props.onClick}
      fullWidth
      size="large"
      sx={
        {
          width: props.currentSlide === 0 ? '100%' : '80%',
          backgroundColor: props.currentSlide === props.slidesLength - 1 ? '#E57952' : 'white',
        }
      }
    >
      {props.currentSlide === props.slidesLength - 1 ? '¡Comencemos!' : 'Siguiente'}
    </NextButton>
  );
});

export default NextButton;

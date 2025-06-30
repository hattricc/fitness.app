import { Button, ButtonProps } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import React from 'react';

interface StartWorkoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick: () => void;
  label?: string;
}

const StartWorkoutButton: React.FC<StartWorkoutButtonProps> = ({
  onClick,
  label = 'Comenzar rutina',
  ...props
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      size="large"
      startIcon={<PlayArrow />}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        py: 1.5,
        textTransform: 'none',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

export default StartWorkoutButton;
import React from 'react';
import { Button, ButtonProps, styled, Typography } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  minWidth: '80px',
  textTransform: 'none',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
  transition: 'all 0.3s ease',
  '&.MuiButton-root': {
    minWidth: 'auto',
  },
}));

const IconWrapper = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

interface SectionButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  label: string;
  iconColor?: string;
  iconBgColor?: string;
}

const SectionButton: React.FC<SectionButtonProps> = ({
  icon,
  label,
  iconColor,
  iconBgColor,
  sx,
  ...props
}) => {
  return (
    <StyledButton 
      {...props}
      sx={{
        ...sx,
      }}
    >
      <IconWrapper 
        sx={{
          ...(iconBgColor && { backgroundColor: iconBgColor }),
          ...(iconColor && { color: iconColor }),
        }}
      >
        {icon}
      </IconWrapper>
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: '0.7rem',
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: 1.2,
          mt: 0.5,
        }}
      >
        {label}
      </Typography>
    </StyledButton>
  );
};

export default SectionButton;

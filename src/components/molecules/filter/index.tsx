import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

interface DifficultyFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ value, onChange }) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
      <StyledToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="difficulty level"
      >
        <ToggleButton value="beginner" aria-label="beginner">
          Beginner
        </ToggleButton>
        <ToggleButton value="intermediate" aria-label="intermediate">
          Intermediate
        </ToggleButton>
        <ToggleButton value="advanced" aria-label="advanced">
          Advanced
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default DifficultyFilter;

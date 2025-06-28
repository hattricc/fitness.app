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

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange }) => {
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
        aria-label="categoria"
      >
        <ToggleButton value="gimnasio" aria-label="gimnasio">
          Gimnasio
        </ToggleButton>
        <ToggleButton value="exteriores" aria-label="exteriores">
          Exteriores
        </ToggleButton>
        <ToggleButton value="all" aria-label="all">
          Todos
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default CategoryFilter;

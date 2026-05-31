import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'transparent',
  userSelect: 'none',
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: '20px !important',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    '&:not(:first-of-type)': {
      borderRadius: '20px !important',
      marginLeft: theme.spacing(1),
    },
    '&:first-of-type': {
      borderRadius: '20px !important',
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
  },
}));

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ value, onChange }) => {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  const categories = [
    { value: 'gimnasio', label: 'Gimnasio' },
    { value: 'exteriores', label: 'Exteriores' },
    { value: 'all', label: 'Todos' },
  ];

  return (
    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
      <StyledToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="categoria"
      >
        {categories.map((category) => (
          <ToggleButton 
            key={category.value} 
            value={category.value} 
            aria-label={category.value}
          >
            {category.label}
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default CategoryFilter;

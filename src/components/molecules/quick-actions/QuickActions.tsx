import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import SectionButton from '../../atoms/section-button/SectionButton';

type ActionItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

interface QuickActionsProps {
  actions: ActionItem[];
  title?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, title }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2,
            pl: 1,
          }}
        >
          {title}
        </Typography>
      )}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(actions.length, 4)}, 1fr)`,
          gap: 2,
          px: 1,
        }}
      >
        {actions.map((action) => (
          <SectionButton 
            key={action.id}
            onClick={action.onClick}
            icon={action.icon}
            label={action.label}
            aria-label={action.label}
            sx={{ width: '100%' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default QuickActions;

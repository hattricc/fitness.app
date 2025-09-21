import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home as HomeIcon, FitnessCenter as WorkoutIcon, BarChart as ProgressIcon, Person as ProfileIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    // Update the active tab based on the current route
    const path = location.pathname;
    if (path === '/') setValue(0);
    else if (path.startsWith('/workouts')) setValue(1);
    else if (path.startsWith('/progress')) setValue(2);
    else if (path.startsWith('/profile')) setValue(3);
  }, [location]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // Navigate based on the selected tab
    switch(newValue) {
      case 0: navigate('/'); break;
      case 1: navigate('/workouts'); break;
      case 2: navigate('/progress'); break;
      case 3: navigate('/profile'); break;
      default: navigate('/');
    }
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Workouts" icon={<WorkoutIcon />} />
        <BottomNavigationAction label="Progress" icon={<ProgressIcon />} />
        <BottomNavigationAction label="Profile" icon={<ProfileIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;

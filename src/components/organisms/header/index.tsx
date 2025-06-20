import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Notifications as NotificationsIcon, AccountCircle as AccountIcon } from '@mui/icons-material';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = 'Fitness App', onMenuClick }) => {
  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Box>
          <IconButton size="large" color="inherit" aria-label="search">
            <SearchIcon />
          </IconButton>
          <IconButton size="large" color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
          <IconButton size="large" color="inherit" aria-label="account">
            <AccountIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

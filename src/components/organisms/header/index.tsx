import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Search as SearchIcon, Notifications as NotificationsIcon, AccountCircle as AccountIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Luis Suarez' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        color: 'text.secondary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isHomePage && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="go back"
              sx={{ mr: 2 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
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

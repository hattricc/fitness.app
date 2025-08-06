import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Divider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Search as SearchIcon, 
  Notifications as NotificationsIcon, 
  AccountCircle as AccountIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Home as HomeIcon,
  FitnessCenter as WorkoutIcon,
  Article as ArticleIcon,
  EmojiEvents as ChallengeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Map of routes to their corresponding titles and icons
const routeConfig = {
  '/': { title: 'Hola, Luis', icon: <HomeIcon /> },
  '/workouts': { title: 'Programas' },
  '/workout/': { title: 'Detalles del Programa' },
  '/articles': { title: 'Artículos' },
  '/weekly-challenge': { title: 'Reto Semanal' },
  '/login': { title: 'Iniciar Sesión' },
  '/signup': { title: 'Registrarse' },
  '/reset-password': { title: 'Restablecer Contraseña' },
};

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Luis Suarez' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [titleState, setTitleState] = useState('Inicio');
  const isHomePage = location.pathname === '/';

  // Update title and icon when route changes
  useEffect(() => {
    // Find the best matching route
    let matchedRoute = Object.entries(routeConfig).find(([path]) => 
      location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path))
    );

    if (matchedRoute) {
      const [_, config] = matchedRoute;
      setTitleState(config.title);
    } else {
      // Default title if no match found
      setTitleState('Luis Suarez');
    }
  }, [location.pathname]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };
  return (
    <AppBar 
      // position="fixed" 
      elevation={0} 
      sx={{ 
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#1B1B1B',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
              {titleState}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton size="large" color="inherit" aria-label="search">
            <SearchIcon />
          </IconButton>
          <IconButton size="large" color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
          <IconButton
            size="large"
            color="inherit"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem onClick={() => handleNavigation('/login')}>
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Iniciar sesión</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleNavigation('/signup')}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Crear cuenta</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

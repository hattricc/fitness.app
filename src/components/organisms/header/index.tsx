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
  '/': { title: 'Inicio', icon: <HomeIcon /> },
  '/workouts': { title: 'Programas' },
  '/workout/:courseId': { 
    title: (params: { courseId: string }) => {
      // Default title if course is not found
      return 'Curso';
    } 
  },
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
  const [courses, setCourses] = useState<Array<{id: string, name: string}>>([]);
  const isHomePage = location.pathname === '/';

  // Load courses data
  useEffect(() => {
    import('../../../data/courses.json').then(data => {
      setCourses(data.default || data);
    });
  }, []);

  // Update title and icon when route changes
  useEffect(() => {
    const path = location.pathname;
    let newTitle = 'Inicio';

    // Check for dynamic course route
    if (path.startsWith('/workout/')) {
      const courseId = path.split('/workout/')[1];
      const course = courses.find(c => c.id === courseId);
      newTitle = course ? course.name : 'Curso';
    } else {
      // Handle static routes
      const route = Object.entries(routeConfig).find(([route]) => 
        route === path || (route.includes(':') && new RegExp(`^${route.replace(/:[^/]+/g, '([^/]+)')}$`).test(path))
      );
      
      if (route) {
        const routeInfo = route[1];
        newTitle = typeof routeInfo.title === 'function' 
          ? routeInfo.title({ courseId: path.split('/').pop() || '' })
          : routeInfo.title;
      }
    }

    setTitleState(newTitle);
  }, [location.pathname, courses]);
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
      position="relative"
      elevation={0}
      sx={{
        color: 'text.secondary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        // backgroundColor: '#1B1B1B',
        backgroundColor: 'background.default',
        padding: '12px 0',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex' }}>
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
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1B1B1B' }}>
          {titleState}
        </Typography>
        <Box>
          {/* <IconButton size="large" color="inherit" aria-label="search">
            <SearchIcon />
          </IconButton> */}

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
                bgcolor: '#1B1B1B',
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
                  bgcolor: '#1B1B1B',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem
              onClick={() => handleNavigation('/login')}
              sx={{
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#333333',
                }
              }}
            >
              <ListItemIcon>
                <LoginIcon fontSize="small" sx={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText>Iniciar sesión</ListItemText>
            </MenuItem>
            <Divider sx={{ backgroundColor: '#333333' }} />
            <MenuItem
              onClick={() => handleNavigation('/signup')}
              sx={{
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#333333',
                }
              }}
            >
              <ListItemIcon>
                <PersonAddIcon fontSize="small" sx={{ color: '#ffffff' }} />
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

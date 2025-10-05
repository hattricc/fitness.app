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
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  WhatsApp,
  Mail,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Map of routes to their corresponding titles and icons
const routeConfig = {
  '/': { title: 'Inicio', icon: <HomeIcon /> },
  '/workouts': { title: 'Programas' },
  '/workout/:courseId': {
    title: (params: { courseId: string }) => {
      return params.courseId;
    }
  },
  '/articles': { title: 'Artículos' },
  '/weekly-challenge': { title: 'Reto Semanal' },
  '/login': { title: 'Iniciar Sesión' },
  '/signup': { title: 'Registrarse' },
  '/reset-password': { title: 'Restablecer Contraseña' },
  '/combate-sagrado': { title: 'Combate Sagrado' }
};

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [titleState, setTitleState] = useState('Inicio');
  const [courses, setCourses] = useState<Array<{ id: string, name: string }>>([]);
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isHomePage && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => window.history.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box
            component="img"
            src="/images/logo/logo.png"
            alt="Logo"
            sx={{
              height: 40,
              mr: 2,
              cursor: 'pointer',
              display: { sm: 'block' },
            }}
            onClick={() => navigate('/')}
          />

          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1B1B1B' }}>
            {titleState}
          </Typography>
        </Box>

        <Box>
          {/* <IconButton size="large" color="inherit" aria-label="search">
            <SearchIcon />
          </IconButton> */}

          {/*<IconButton size="large" color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>*/}

          {/* <IconButton
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
          </Menu> */}

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleMenu}
          >
            Agenda una cita
          </Button>
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
              component="a"
              href="https://wa.me/59170870099"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#ffffff',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: '#333333',
                }
              }}
            >
              <ListItemIcon>
                <WhatsApp fontSize="small" sx={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText>Whatsapp</ListItemText>
            </MenuItem>
            <Divider sx={{ backgroundColor: '#333333' }} />
            <MenuItem
              component="a"
              href="mailto:luissuarezf4f@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#ffffff',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: '#333333',
                }
              }}
            >
              <ListItemIcon>
                <Mail fontSize="small" sx={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText>Correo</ListItemText>
            </MenuItem>
          </Menu>


        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

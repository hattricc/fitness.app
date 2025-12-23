import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadAllCourses } from '@/data/getWorkout';
import { UserSession } from '@/lib/userSession';
import UserMenu from '@/components/molecules/UserMenu/UserMenu';


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
  '/combate-sagrado': { title: 'Combate Sagrado' },
  '/subscription': { title: 'Suscripción' },
};

interface HeaderProps {
  title?: string;
  user: UserSession | null;
}


const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [titleState, setTitleState] = useState('Inicio');
  const [courses, setCourses] = useState<Array<{ id: string, name: string }>>([]);
  const isHomePage = location.pathname === '/';

  // Load courses data
  useEffect(() => {
    const loadData = async () => {
      try {
        const allCourses = await loadAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Error loading course data:', error);
      }
    };

    loadData();
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

          <UserMenu user={user} />

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

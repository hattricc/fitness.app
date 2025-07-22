import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  Tabs, 
  Tab, 
  Paper,
  Divider,
  useTheme
} from '@mui/material';
import ProgressCharts from '../components/molecules/progress-charts';
import { 
  Person as PersonIcon,
  FitnessCenter as WorkoutIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import WorkoutLog from '../components/molecules/workout-log';

const Progress = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const userData = {
    name: 'Alex Johnson',
    gender: 'Male',
    age: 28,
    weight: '75 kg',
    height: '180 cm',
    joinDate: 'Member since Jan 2023',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 3,
          width: '100%'
        }}>
          <Box sx={{ 
            textAlign: 'center',
            width: { xs: '100%', md: 'auto' },
            flexShrink: 0
          }}>
            <Avatar 
              src={userData.avatar} 
              sx={{ 
                width: 100, 
                height: 100, 
                mx: 'auto',
                border: `3px solid ${theme.palette.primary.main}` 
              }} 
            />
          </Box>
          <Box sx={{ 
            flexGrow: 1,
            width: '100%',
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {userData.name}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Gender</Typography>
                <Typography variant="body1">{userData.gender}</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="body2" color="text.secondary">Age</Typography>
                <Typography variant="body1">{userData.age}</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="body2" color="text.secondary">Weight</Typography>
                <Typography variant="body1">{userData.weight}</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="body2" color="text.secondary">Height</Typography>
                <Typography variant="body1">{userData.height}</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {userData.joinDate}
            </Typography>
          </Box>
          <Box sx={{ 
            width: { xs: '100%', md: 'auto' },
            textAlign: { xs: 'center', md: 'right' },
            flexShrink: 0
          }}>
            <Button 
              variant="outlined" 
              startIcon={<PersonIcon />}
              sx={{ 
                borderRadius: 3, 
                textTransform: 'none',
                width: { xs: '100%', md: 'auto' }
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab 
            icon={<WorkoutIcon />} 
            label="Workout Log" 
            iconPosition="start" 
            sx={{ py: 2, textTransform: 'none', fontWeight: 600 }}
          />
          <Tab 
            icon={<ChartIcon />} 
            label="Charts" 
            iconPosition="start" 
            sx={{ py: 2, textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? <WorkoutLog /> : <ProgressCharts />}
        </Box>
      </Paper>
    </Box>
  );
};

export default Progress;
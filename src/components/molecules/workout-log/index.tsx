// src/app/progress/workout-log.tsx
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Paper,
  Button,
  Divider
} from '@mui/material';
import { 
  FitnessCenter as WorkoutIcon,
  DirectionsRun as RunIcon,
  DirectionsBike as BikeIcon,
  Pool as SwimIcon
} from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const activities = [
  {
    id: 1,
    title: 'Morning Workout',
    type: 'Strength',
    duration: '45 min',
    calories: 320,
    date: new Date(2023, 6, 15),
    icon: <WorkoutIcon />
  },
  {
    id: 2,
    title: 'Evening Run',
    type: 'Cardio',
    duration: '30 min',
    calories: 280,
    date: new Date(2023, 6, 14),
    icon: <RunIcon />
  },
  {
    id: 3,
    title: 'Swimming',
    type: 'Cardio',
    duration: '1h',
    calories: 450,
    date: new Date(2023, 6, 12),
    icon: <SwimIcon />
  },
  {
    id: 4,
    title: 'Cycling',
    type: 'Cardio',
    duration: '1h 15min',
    calories: 520,
    date: new Date(2023, 6, 10),
    icon: <BikeIcon />
  }
];

const WorkoutLog = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const filteredActivities = activities
    .filter(activity => 
      selectedDate && 
      activity.date.getDate() === selectedDate.getDate() &&
      activity.date.getMonth() === selectedDate.getMonth() &&
      activity.date.getFullYear() === selectedDate.getFullYear()
    );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Workout Calendar
        </Typography>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'background.paper' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              showDaysOutsideCurrentMonth
              fixedWeekNumber={6}
              disableFuture
              sx={{
                '& .MuiPickersDay-root': {
                  borderRadius: 3,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }
                }
              }}
            />
          </LocalizationProvider>
        </Paper>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ borderRadius: 3, textTransform: 'none' }}
          >
            Add Activity
          </Button>
        </Box>

        {filteredActivities.length > 0 ? (
          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <List sx={{ width: '100%' }}>
              {filteredActivities.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem 
                    alignItems="flex-start"
                    secondaryAction={
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          {activity.duration}
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="medium">
                          {activity.calories} cal
                        </Typography>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.type}
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                  {index < filteredActivities.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </Paper>
        ) : (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 3,
              bgcolor: 'background.default'
            }}
          >
            <Typography color="text.secondary">
              No workouts recorded for this day.
            </Typography>
            <Button 
              variant="text" 
              color="primary" 
              sx={{ mt: 1, textTransform: 'none' }}
            >
              Add Workout
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default WorkoutLog;
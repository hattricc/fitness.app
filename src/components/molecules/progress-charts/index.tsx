import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  useTheme
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

// Sample data - replace with your actual data
const monthlyData = [
  { month: 'Jan', steps: 4000 },
  { month: 'Feb', steps: 3000 },
  { month: 'Mar', steps: 5000 },
  { month: 'Apr', steps: 2780 },
  { month: 'May', steps: 1890 },
  { month: 'Jun', steps: 2390 },
  { month: 'Jul', steps: 3490 },
];

const dailyData = [
  { day: 'Mon', steps: 4200, duration: '45 min' },
  { day: 'Tue', steps: 3800, duration: '40 min' },
  { day: 'Wed', steps: 4500, duration: '50 min' },
  { day: 'Thu', steps: 5000, duration: '55 min' },
  { day: 'Fri', steps: 4800, duration: '50 min' },
  { day: 'Sat', steps: 5200, duration: '60 min' },
  { day: 'Sun', steps: 4600, duration: '50 min' },
];

const ProgressCharts = () => {
  const theme = useTheme();
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Activity Progress
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {formattedDate}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Monthly Steps
        </Typography>
        <Box sx={{ height: 300, mt: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="steps" 
                stroke={theme.palette.primary.main} 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Steps"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Box>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          This Week
        </Typography>
        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            '& > *': {
              width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' },
              minWidth: 0
            }
          }}
        >
          {dailyData.map((day, index) => (
            <Box key={index}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {day.day}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {day.steps.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        steps
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {day.duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        duration
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressCharts;

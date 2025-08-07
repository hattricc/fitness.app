import React from 'react';
import { Typography, Box, CardActionArea } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Course } from '../../../../types/course';

const WorkoutImage = styled('div')<{ image: string }>(({ theme, image }) => ({
    position: 'relative',
    marginTop: 40,
    marginBottom: 40,
    paddingTop: '35%',
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
    },
}));

const WorkoutInfo = styled('div')(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(2),
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
}));

interface WorkoutHeaderProps {
    workout: Course;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ workout }) => {
    return (
        <CardActionArea>
            <WorkoutImage
                image={workout.imageUrl || 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop'}
            >
                <WorkoutInfo>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                            {workout.name}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" display="block">
                            {workout.modules.length} módulos • {workout.duration}
                        </Typography>
                    </Box>
                </WorkoutInfo>
            </WorkoutImage>
        </CardActionArea>
    );
};

export default WorkoutHeader;

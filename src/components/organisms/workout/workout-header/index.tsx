import React from 'react';
import { Typography, Box } from '@mui/material';
import { WorkoutRoutine } from '../../../../types/exercise';

interface WorkoutHeaderProps {
    workout: WorkoutRoutine;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ workout }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ flexGrow: 1, textAlign: 'center' }}>
                {workout.name}
            </Typography>
            <Box sx={{ width: 40 }} />
        </Box>
    );
};

export default WorkoutHeader;

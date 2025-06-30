import React from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { WorkoutRoutine } from '../../../../types/exercise';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

interface WorkoutHeaderProps {
    workout: WorkoutRoutine;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ workout }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={handleBack}
                sx={{
                    mr: 1,
                    color: 'black',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                }}
            >
                <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ flexGrow: 1, textAlign: 'center' }}>
                {workout.name}
            </Typography>
            <Box sx={{ width: 40 }} />
        </Box>
    );
};

export default WorkoutHeader;

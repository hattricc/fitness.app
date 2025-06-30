import React from 'react';
import { Box, Typography } from '@mui/material';
import CategoryFilter from 'components/molecules/category-filter';

interface WorkoutListProps {
    difficulty: string;
    onDifficultyChange: (difficulty: string) => void;
}

const WorkoutListHeader: React.FC<WorkoutListProps> = ({
    difficulty,
    onDifficultyChange,
}) => {
    return (
        <Box sx={{ my: 3 }}>
            {/* TODO realmente necesito un titulo? */}
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Programas
            </Typography>
            <CategoryFilter
                value={difficulty}
                onChange={onDifficultyChange}
            />
        </Box>
    );
};

export default WorkoutListHeader;
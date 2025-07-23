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
            <CategoryFilter
                value={difficulty}
                onChange={onDifficultyChange}
            />
        </Box>
    );
};

export default WorkoutListHeader;
import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Box, Chip, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Course } from '../../../types/exercise';
import { useNavigate } from 'react-router-dom';


interface CourseCardProps {
    exercise: Course;
    onClick: (exercise: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ exercise, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onClick(exercise);
        navigate(`/exercise/${exercise.id}`);
    };

    return (
        <Card key={exercise.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
                component="img"
                height="220"
                image={exercise.image}
                alt={exercise.title}
                sx={{ width: '100%', objectFit: 'cover' }}
            />
            <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {exercise.title}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        {exercise.category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {exercise.duration}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default CourseCard;

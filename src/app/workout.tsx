import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography, Button, IconButton, Chip, Modal, IconButton as MuiIconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ExerciseVideo } from '../components/molecules';
import { ExerciseRoutine } from '../types/exercise';
import { getWorkoutById } from '../data/mockWorkout';
import WorkoutHeader from '../components/organisms/workout/workout-header';
import StartWorkoutButton from 'components/atoms/start-workout-button/start-workout-button';

interface WorkoutProps {
  onSelectExercise: (exercise: ExerciseRoutine) => void;
}

const Workout: React.FC<WorkoutProps> = ({ onSelectExercise }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Get the workout data based on the ID
  const workout = id ? getWorkoutById(id) : null;

  // const handleBack = () => {
  //   navigate(-1);
  // };

  const handleExerciseClick = (exercise: ExerciseRoutine) => {
    // Get the video URL from the first set of the exercise
    const videoUrl = exercise.sets?.[0]?.videoUrl;
    if (videoUrl) {
      setSelectedVideo(videoUrl);
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  // const handleStartWorkout = () => {
  //   if (workout?.rounds[0]?.exercises[0]) {
  //     onSelectExercise(workout.rounds[0].exercises[0]);
  //   }
  // };
  
  if (!workout) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Workout not found</Typography>
        {/* <Button onClick={handleBack} sx={{ mt: 2 }}>Go Back</Button> */}
      </Container>
    );
  }

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ 
      pb: 10, 
      pt: 4,
      width: '100%',
      maxWidth: '100%',
      px: 2 
    }}>
      <WorkoutHeader workout={workout} />

      {/* Workout Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        {/* <Typography variant="h5" gutterBottom>{workout.name}</Typography> */}
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {workout.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
          <Chip 
            label={`${workout.duration} min`} 
            color="secondary"
          />
          {/* <Chip 
            label={`${workout.calories} cal`} 
            variant="outlined"
            color="error"
          /> */}
          <Chip 
            label={workout.difficulty}
            color="primary"
          />
        </Box>
      </Box>

      {/* Workout Rounds */}
      <Box sx={{ mb: 4 }}>
        {/* <Typography variant="h6" gutterBottom>
          Workout Plan
        </Typography> */}
        
        {workout.rounds.map((round) => (
          <Box key={round.id} sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
              Round {round.id.replace('r', '')}
            </Typography>
            {round.exercises.map((exercise) => (
              <Box 
                key={exercise.id}
                sx={{ mb: 2, cursor: 'pointer' }}
              >
                <ExerciseVideo
                  exercise={exercise}
                  onClick={handleExerciseClick}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Video Modal */}
      <Modal
        open={!!selectedVideo}
        onClose={handleCloseVideo}
        aria-labelledby="video-modal-title"
        aria-describedby="video-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
        }}
      >
        <Box sx={{
          position: 'relative',
          width: '90%',
          maxWidth: '800px',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          outline: 'none',
        }}>
          <MuiIconButton
            onClick={handleCloseVideo}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.primary',
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <CloseIcon />
          </MuiIconButton>
          
          <Box sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            borderRadius: 1,
            overflow: 'hidden',
          }}>
            {selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(selectedVideo)}
                title="Exercise Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            )}
          </Box>
        </Box>
      </Modal>

      {/* {workout.rounds.length > 0 && workout.rounds[0].exercises.length > 0 && (
        <Box sx={{ position: 'fixed', bottom: 20, left: 0, right: 0, px: 2, zIndex: 1 }}>
          <StartWorkoutButton  onClick={handleStartWorkout} />
        </Box>
      )} */}
    </Container>
  );
};

export default Workout;

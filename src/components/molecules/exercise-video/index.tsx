import React, { useState } from 'react';
import { Box, Card, Typography, Chip, Stack, IconButton } from '@mui/material';
import { AccessTime, Whatshot, Star, PlayArrow } from '@mui/icons-material';
import { ExerciseRoutine } from '@/types/exercise';
import CloseIcon from '@mui/icons-material/Close';
import { Modal } from '@mui/material';

interface ExerciseVideoProps {
  exercise:   ExerciseRoutine;
    id: string;
    name: string;
    difficulty: string;
    duration: number;
    repetitions: number;
    calories: number;
    imageUrl: string;
    description: string;
    category: string;
    categoryName: string;
    videoUrl?: string;
    rounds?: any[];
}

const ExerciseVideo: React.FC<ExerciseVideoProps> = ({
  exercise,
}) => {
  // videoUrl is available for future video playback functionality
  // const videoUrl = exercise.sets?.[0]?.videoUrl || '';

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('exercise', exercise);
    handleExerciseClick(exercise);
  };

  const handleExerciseClick = (exercise: ExerciseRoutine) => {
    // Get the video URL from the first set of the exercise
    const videoUrl = exercise.videoUrl;
    if (videoUrl) {
      setSelectedVideo(videoUrl);
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

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
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 18,
        boxShadow: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
        position: 'relative',
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        px: 3,
      }}>
        {/* Video Thumbnail */}
        <Box
          sx={{
            transition: 'all 0.3s',
            '& .MuiSvgIcon-root': {
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        >
          <PlayArrow sx={{
            color: 'primary.main',
            fontSize: 70,
          }} />
        </Box>

        {/* Exercise Info */}
        <Box sx={{
          width: '60%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography
              variant="subtitle1"
              component="h3"
              fontWeight="bold"
              sx={{
                color: 'text.primary',
                mb: 0.5,
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxHeight: '2.8em'
              }}
            >
              {exercise.name}
            </Typography>
            {/* <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
                height: '2.6em'
              }}
            >
              {exercise.description || 'No description available'}
            </Typography> */}
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
            <Chip
              icon={<AccessTime fontSize="small" />}
              label={`${exercise.duration} seg`}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: 'background.default',
                borderColor: 'divider',
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                  color: 'text.secondary',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                },
              }}
            />
            {/*<Chip
              icon={<Whatshot fontSize="small" />}
              label={`${exercise.calories} cal`}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: 'background.default',
                borderColor: 'divider',
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                },
              }}
            />
            <Chip
              icon={<Star fontSize="small" />}
              label={exercise.difficulty}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                bgcolor: 'background.default',
                borderColor: 'divider',
                height: 24,
                '& .MuiChip-label': {
                  px: 1,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                },
              }}
            />*/}
          </Stack>
        </Box>


        <Box>
          <Typography
            sx={{
              textOverflow: 'ellipsis',
            }}
          >
            {/* {exercise.repetitions || 0} repeticiones */}
            0 repeticiones
          </Typography>
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
          <IconButton
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
          </IconButton>
          
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

      </Box>
    </Card>
  );
};

export default ExerciseVideo;

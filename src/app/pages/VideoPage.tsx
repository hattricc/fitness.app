import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { YouTubeHelper } from '@/data/youtube-helper';

interface VideoPageState {
  url: string;
  title?: string;
}

const VideoPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as VideoPageState | null;

  if (!state?.url) {
    return <Navigate to="/" replace />;
  }

  const embedUrl = YouTubeHelper.getEmbedUrl(state.url, true, {
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: { xs: 0, md: 4 },
        py: { xs: 0, md: 3 },
        minHeight: '60vh',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '900px' },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            bgcolor: '#000',
            borderRadius: { xs: 0, md: 2 },
            overflow: 'hidden',
          }}
        >
          <iframe
            src={embedUrl}
            title={state.title ?? 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
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
        </Box>

        {/* {state.title && (
          <Box sx={{ px: { xs: 2, md: 0 }, pt: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {state.title}
            </Typography>
          </Box>
        )} */}
      </Box>
    </Box>
  );
};

export default VideoPage;

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Container,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { articles } from '../data/mockArticles';

export default function Articles() {
  const theme = useTheme();
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const handleArticleClick = (videoId: string) => {
    setSelectedArticle(videoId);
  };

  if (selectedArticle) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <IconButton onClick={() => setSelectedArticle(null)} sx={{ mb: 2 }}>
          <ArrowBackIcon />
          <Typography variant="body1" ml={1}>Back to Articles</Typography>
        </IconButton>
        <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', mb: 3, borderRadius: 2 }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${selectedArticle}?autoplay=1`}
            title="YouTube video player"
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
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Fitness Articles & Tips</Typography>
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {articles.map((article: { id: string; title: string; description: string; category: string; duration: number; videoId: string }) => (
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
              onClick={() => handleArticleClick(article.videoId)}
            >
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <CardMedia
                  component="img"
                  image={`https://img.youtube.com/vi/${article.videoId}/hqdefault.jpg`}
                  alt={article.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Chip
                  label={article.category}
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {article.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    {article.duration} min read
                  </Typography>
                  <Typography variant="caption" color="primary">
                    Read more
                  </Typography>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>
    </Container>
  );
}

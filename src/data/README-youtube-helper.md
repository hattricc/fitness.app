# YouTube Helper Class

A utility class for handling YouTube URLs and generating various YouTube-related URLs for images and videos.

## Features

- Extract video IDs from various YouTube URL formats
- Generate thumbnail URLs with different qualities
- Create embed URLs for iframes
- Generate watch and shorts URLs
- Validate YouTube URLs
- Support for multiple YouTube URL formats

## Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- URLs with additional parameters (e.g., `&t=30s`)

## Usage

### Import the helper

```typescript
import { YouTubeHelper } from '@/data/youtube-helper';
```

### Extract Video ID

```typescript
const videoId = YouTubeHelper.extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// Returns: 'dQw4w9WgXcQ'
```

### Generate Thumbnail URLs

```typescript
// Default quality (mqdefault)
const thumbnail = YouTubeHelper.getThumbnailUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// Returns: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg'

// High quality
const hqThumbnail = YouTubeHelper.getThumbnailUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'hqdefault');
// Returns: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'

// Maximum resolution
const maxResThumbnail = YouTubeHelper.getThumbnailUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'maxresdefault');
// Returns: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
```

### Generate Embed URLs

```typescript
// Basic embed URL
const embedUrl = YouTubeHelper.getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// Returns: 'https://www.youtube.com/embed/dQw4w9WgXcQ'

// With autoplay
const autoplayEmbed = YouTubeHelper.getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', true);
// Returns: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'

// With additional parameters
const customEmbed = YouTubeHelper.getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, {
  'rel': '0',
  'modestbranding': '1'
});
// Returns: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1'
```

### Generate URL Formats

```typescript
const videoId = 'dQw4w9WgXcQ';

// Watch URL
const watchUrl = YouTubeHelper.getWatchUrl(videoId);
// Returns: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

// Shorts URL
const shortsUrl = YouTubeHelper.getShortsUrl(videoId);
// Returns: 'https://www.youtube.com/shorts/dQw4w9WgXcQ'
```

### Validate URLs

```typescript
const isValid = YouTubeHelper.isValidYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// Returns: true

const isInvalid = YouTubeHelper.isValidYouTubeUrl('https://www.google.com');
// Returns: false
```

### Best Thumbnail URLs

```typescript
// Get best available thumbnail (maxresdefault)
const bestThumbnail = YouTubeHelper.getBestThumbnailUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// Returns: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'

// Get fallback thumbnail (hqdefault)
const fallbackThumbnail = YouTubeHelper.getFallbackThumbnailUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// Returns: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
```

## Thumbnail Qualities

- `default`: 120x90
- `mqdefault`: 320x180 (medium quality)
- `hqdefault`: 480x360 (high quality)
- `sddefault`: 640x480 (standard definition)
- `maxresdefault`: 1280x720 (maximum resolution)

## Integration Examples

### React Component with Thumbnail

```typescript
import { YouTubeHelper } from '@/data/youtube-helper';

const VideoThumbnail = ({ youtubeUrl, fallbackImage }) => {
  const thumbnailUrl = YouTubeHelper.getThumbnailUrl(youtubeUrl, 'mqdefault') || fallbackImage;
  
  return (
    <img 
      src={thumbnailUrl} 
      alt="Video thumbnail"
      onError={(e) => {
        // Fallback to lower quality if maxresdefault fails
        const fallbackUrl = YouTubeHelper.getFallbackThumbnailUrl(youtubeUrl);
        if (fallbackUrl) {
          e.currentTarget.src = fallbackUrl;
        }
      }}
    />
  );
};
```

### React Component with Embed

```typescript
import { YouTubeHelper } from '@/data/youtube-helper';

const VideoPlayer = ({ youtubeUrl }) => {
  const embedUrl = YouTubeHelper.getEmbedUrl(youtubeUrl, true);
  
  if (!embedUrl) {
    return <div>Invalid YouTube URL</div>;
  }
  
  return (
    <iframe
      width="100%"
      height="315"
      src={embedUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};
```

## Error Handling

The helper methods return `null` for invalid URLs, so always check the return value:

```typescript
const thumbnailUrl = YouTubeHelper.getThumbnailUrl(invalidUrl);
if (thumbnailUrl) {
  // Use the thumbnail URL
} else {
  // Handle invalid URL
  console.error('Invalid YouTube URL');
}
```

## Performance

The helper uses regular expressions for URL parsing, which is efficient for most use cases. For high-frequency usage, consider caching the extracted video IDs.

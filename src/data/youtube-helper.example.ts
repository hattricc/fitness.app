import { YouTubeHelper } from './youtube-helper';

// Example usage of the YouTubeHelper class

// Example YouTube URLs
const youtubeUrls = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/shorts/paBNx6zShiA',
  'https://youtu.be/dQw4w9WgXcQ',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s',
];

// Example 1: Extract video ID from different URL formats
console.log('=== Video ID Extraction ===');
youtubeUrls.forEach(url => {
  const videoId = YouTubeHelper.extractVideoId(url);
  console.log(`URL: ${url}`);
  console.log(`Video ID: ${videoId}`);
  console.log('---');
});

// Example 2: Generate thumbnail URLs with different qualities
console.log('\n=== Thumbnail URLs ===');
const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const qualities: Array<'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault'> = [
  'default', 'mqdefault', 'hqdefault', 'sddefault', 'maxresdefault'
];

qualities.forEach(quality => {
  const thumbnailUrl = YouTubeHelper.getThumbnailUrl(testUrl, quality);
  console.log(`${quality}: ${thumbnailUrl}`);
});

// Example 3: Generate embed URLs
console.log('\n=== Embed URLs ===');
const embedUrl = YouTubeHelper.getEmbedUrl(testUrl, true);
console.log(`Autoplay embed: ${embedUrl}`);

const embedUrlWithParams = YouTubeHelper.getEmbedUrl(testUrl, false, {
  'rel': '0',
  'modestbranding': '1'
});
console.log(`Embed with params: ${embedUrlWithParams}`);

// Example 4: Generate different URL formats
console.log('\n=== URL Formats ===');
const videoId = YouTubeHelper.extractVideoId(testUrl);
if (videoId) {
  console.log(`Watch URL: ${YouTubeHelper.getWatchUrl(videoId)}`);
  console.log(`Shorts URL: ${YouTubeHelper.getShortsUrl(videoId)}`);
}

// Example 5: Validate YouTube URLs
console.log('\n=== URL Validation ===');
const invalidUrls = [
  'https://www.google.com',
  'https://www.youtube.com/invalid',
  'not-a-url',
  ''
];

[...youtubeUrls, ...invalidUrls].forEach(url => {
  const isValid = YouTubeHelper.isValidYouTubeUrl(url);
  console.log(`${url}: ${isValid ? 'Valid' : 'Invalid'}`);
});

// Example 6: Best thumbnail URL
console.log('\n=== Best Thumbnail ===');
const bestThumbnail = YouTubeHelper.getBestThumbnailUrl(testUrl);
const fallbackThumbnail = YouTubeHelper.getFallbackThumbnailUrl(testUrl);
console.log(`Best: ${bestThumbnail}`);
console.log(`Fallback: ${fallbackThumbnail}`);
